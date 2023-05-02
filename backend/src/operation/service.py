from datetime import datetime
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import AsyncClient, OrderState

from src.account.models import Account, Subaccount
from src.operation.models import Operation


async def get_operations(
    session: AsyncSession,
    *,
    subaccount: Subaccount,
    dt_from: datetime | None = None,
    dt_to: datetime | None = None,
    limit: int | None = None,
    offset: int | None = None,
) -> List[Operation]:
    stmt = (
        select(Operation)
        .filter(Operation.subaccount_id == subaccount.id)
        .options(selectinload(Operation.trades))
        .order_by(Operation.date.desc())
    )
    if dt_from is not None:
        stmt.filter(Operation.date >= dt_from)

    if dt_to is not None:
        stmt.filter(Operation.date <= dt_to)

    if offset is not None:
        stmt.offset(offset)

    if limit is not None:
        stmt.limit(limit)

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
