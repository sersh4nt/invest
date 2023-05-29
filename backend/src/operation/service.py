from datetime import datetime
from typing import List, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import AsyncClient, OrderState

import src.portfolio.service as portfolio_service
from src.account.models import Account, Subaccount
from src.common.pagination import PaginationOpts
from src.common.utils import paginate_stmt
from src.instrument.models import Instrument
from src.operation.models import Operation


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

    portfolio = await portfolio_service.get_latest_portfolio(
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

    if portfolio is not None:
        revenue += portfolio.cost[0].value

    return {"daily_volume": daily_volume, "profit": revenue}
