from datetime import datetime
from decimal import Decimal
from typing import List, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import (
    AioRequestError,
    AsyncClient,
    OrderDirection,
    OrderState,
    OrderType,
)

import src.portfolio.service as portfolio_service
from src.account.models import Account, Subaccount
from src.common.pagination import PaginationOpts
from src.common.utils import decimal_to_quotation, paginate_stmt
from src.instrument.models import Instrument
from src.operation.models import Operation
from src.operation.schemas import OrderCreate


async def get_operations(
    session: AsyncSession,
    *,
    subaccount: Subaccount,
    dt_from: datetime | None = None,
    dt_to: datetime | None = None,
    pagination: PaginationOpts = None
) -> Tuple[List[Operation], int]:
    stmt = (
        select(Operation)
        .filter(Operation.subaccount_id == subaccount.id)
        .join(Instrument, Operation.instrument_figi == Instrument.figi, isouter=True)
        .options(selectinload(Operation.trades), selectinload(Operation.instrument))
        .order_by(Operation.date.desc())
    )

    cnt_stmt = select(func.count(Operation.id)).filter(
        Operation.subaccount_id == subaccount.id
    )

    stmt = paginate_stmt(stmt, pagination)

    if dt_from is not None:
        stmt = stmt.filter(Operation.date >= dt_from)
        cnt_stmt = cnt_stmt.filter(Operation.date >= dt_from)

    if dt_to is not None:
        stmt = stmt.filter(Operation.date <= dt_to)
        cnt_stmt = cnt_stmt.filter(Operation.date <= dt_to)

    result = await session.scalars(stmt)
    count = await session.scalar(cnt_stmt)

    return result.all(), count


async def get_active_orders(
    session: AsyncSession, *, subaccount: Subaccount
) -> Tuple[List[OrderState], List[Instrument]]:
    token = (
        await session.scalars(
            select(Account.token).filter(Account.id == subaccount.account_id)
        )
    ).first()

    async with AsyncClient(token) as client:
        orders = await client.orders.get_orders(account_id=subaccount.broker_id)

    figis = {o.figi for o in orders.orders}
    instruments = await session.scalars(
        select(Instrument).filter(Instrument.figi.in_(figis))
    )
    return orders.orders, instruments.all()


async def get_operations_stats(
    session: AsyncSession, *, subaccount: Subaccount
) -> dict:
    dt_from = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    cnt = await session.scalar(
        select(func.count(Operation.id)).filter(
            Operation.subaccount_id == subaccount.id, Operation.date >= dt_from
        )
    )

    commission = await session.scalar(
        select(func.sum(Operation.commission)).filter(
            Operation.subaccount_id == subaccount.id
        )
    )
    return {"daily_count": cnt or 0, "total_commission": commission or 0}


async def get_portfolio_revenue(
    session: AsyncSession, *, subaccount: Subaccount
) -> dict:
    revenue = await session.scalar(
        select(func.sum(Operation.payment)).filter(
            Operation.subaccount_id == subaccount.id
        )
    )

    last_cost = await portfolio_service.get_latest_portfolio_cost(
        session, subaccount=subaccount
    )

    dt_from = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_volume = await session.scalar(
        select(func.sum(func.abs(Operation.payment))).filter(
            Operation.subaccount_id == subaccount.id, Operation.date >= dt_from
        )
    )

    revenue = revenue or 0
    daily_volume = daily_volume or 0

    if last_cost is not None:
        revenue += last_cost

    return {"daily_volume": daily_volume, "profit": revenue}


async def cancel_order(subaccount: Subaccount, order_id: str) -> True:
    async with AsyncClient(subaccount.account.token) as client:
        try:
            await client.orders.cancel_order(
                account_id=subaccount.broker_id, order_id=order_id
            )
            return True
        except AioRequestError:
            return False


async def create_order(
    *, subaccount: Subaccount, data: OrderCreate
) -> tuple[bool, str]:
    """
    returns order_id if created sucessfully
    else returns details string
    """
    direction = (
        OrderDirection.ORDER_DIRECTION_BUY
        if data.type == "buy"
        else OrderDirection.ORDER_DIRECTION_SELL
    )
    order_type = (
        OrderType.ORDER_TYPE_LIMIT if data.is_limit else OrderType.ORDER_TYPE_MARKET
    )
    async with AsyncClient(subaccount.account.token) as client:
        try:
            response = await client.orders.post_order(
                figi=data.figi,
                quantity=data.quantity,
                price=decimal_to_quotation(Decimal(data.price)),
                direction=direction,
                order_type=order_type,
            )
            return True, response.order_id
        except AioRequestError as e:
            return False, e.details
