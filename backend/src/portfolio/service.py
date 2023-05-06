from datetime import datetime
from decimal import Decimal
from typing import List, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
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
        .join(Subaccount)
        .filter(PortfolioCost.currency == currency, Subaccount.id == subaccount.id)
        .order_by(Portfolio.date_added)
    )

    if dt_from is not None:
        stmt.filter(Portfolio.date_added >= dt_from)

    if dt_to is not None:
        stmt.filter(Portfolio.date_added <= dt_to)

    values = await session.execute(stmt)
    return values.all()


async def get_portfolio_cost_stat(
    session: AsyncSession, *, subaccount: Subaccount
) -> dict:
    dt_from = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    last_portfolio = await get_latest_portfolio(session, subaccount=subaccount)
    cost = await get_portfolio_cost(session, subaccount=subaccount, dt_from=dt_from)
    current_cost = last_portfolio.cost[0].value
    return {"cost": current_cost, "daily_gain": current_cost / cost[0][0]}
