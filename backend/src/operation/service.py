from datetime import datetime
from typing import List

import src.portfolio.service as portfolio_service
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.account.models import Account, Subaccount
from src.operation.models import Operation
from tinkoff.invest import AsyncClient, OrderState


async def get_operations(
    session: AsyncSession,
    *,
    subaccount: Subaccount,
    dt_from: datetime | None = None,
    dt_to: datetime | None = None,
    page: int = 0,
    page_size: int = 50
) -> List[Operation]:
    stmt = (
        select(Operation)
        .filter(Operation.subaccount_id == subaccount.id)
        .options(selectinload(Operation.trades))
        .order_by(Operation.date.desc())
        .limit(page_size)
        .offset(page_size * page)
    )

    if dt_from is not None:
        stmt.filter(Operation.date >= dt_from)

    if dt_to is not None:
        stmt.filter(Operation.date <= dt_to)

    result = await session.scalars(stmt)
    return result.all()


async def get_active_orders(
    session: AsyncSession, *, subaccount: Subaccount
) -> List[OrderState]:
    token = (
        await session.scalars(
            select(Account.token).filter(Account.id == subaccount.account_id)
        )
    ).first()

    async with AsyncClient(token) as client:
        orders = await client.orders.get_orders(account_id=subaccount.broker_id)
    return orders.orders


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
    return {"daily_count": cnt, "total_commission": commission}


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

    if portfolio is not None:
        revenue += portfolio.cost[0].value

    return {"daily_volume": daily_volume or 0, "profit": revenue}
