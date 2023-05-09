from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Literal, Tuple

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
    range: Literal["today", "week", "month", "year", "all"] = "all"
) -> List[Tuple[Decimal, datetime]]:
    stmt = (
        select(PortfolioCost.value, Portfolio.date_added)
        .join(Portfolio)
        .join(Subaccount)
        .filter(PortfolioCost.currency == currency, Subaccount.id == subaccount.id)
        .order_by(Portfolio.date_added)
    )

    now = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    if range == "week":
        now = now - timedelta(days=now.weekday())
    elif range == "month":
        now = now.replace(day=1)
    elif range == "year":
        now = now.replace(month=1)

    if range != "all":
        stmt = stmt.filter(Portfolio.date_added >= now)

    values = await session.execute(stmt)
    return values.all()


async def get_portfolio_cost_stat(
    session: AsyncSession, *, subaccount: Subaccount
) -> dict:
    last_portfolio = await get_latest_portfolio(session, subaccount=subaccount)
    cost = await get_portfolio_cost(session, subaccount=subaccount, range="today")
    if last_portfolio is None:
        return {"cost": 0, "daily_gain": 0}
    current_cost = last_portfolio.cost[0].value
    return {"cost": current_cost, "daily_gain": current_cost / cost[0][0]}
