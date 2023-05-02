from datetime import datetime
from decimal import Decimal
from typing import List, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload
from src.account.models import Subaccount
from src.portfolio.models import Portfolio, PortfolioCost, PortfolioPosition


async def get_latest_portfolio(
    session: AsyncSession, *, subaccount: Subaccount
) -> Portfolio | None:
    portfolio = await session.scalars(
        select(Portfolio)
        .options(
            selectinload(Portfolio.positions).selectinload(
                PortfolioPosition.instrument
            ),
            selectinload(Portfolio.cost),
        )
        .filter(Portfolio.subaccount_id == subaccount.id)
        .order_by(Portfolio.date_added.desc())
    )
    await session.commit()
    return portfolio.first()


async def get_portfolio_cost(
    session: AsyncSession,
    *,
    subaccount: Subaccount,
    currency: str = "rub",
    dt_from: datetime | None = None,
    dt_to: datetime | None = None
) -> List[Tuple[Decimal, datetime]]:
    stmt = (
        select(PortfolioCost.value.label("value"), Portfolio.date_added.label("ts"))
        .join(Portfolio)
        .join(Subaccount, Subaccount.id == subaccount.id)
        .filter(PortfolioCost.currency == currency)
        .order_by(Portfolio.date_added)
    )

    if dt_from is not None:
        stmt.filter(Portfolio.date_added >= dt_from)

    if dt_to is not None:
        stmt.filter(Portfolio.date_added <= dt_to)

    values = await session.execute(stmt)
    return values.all()
