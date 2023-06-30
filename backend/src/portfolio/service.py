from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Literal, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import AioRequestError, AsyncClient

from src.account.models import Subaccount
from src.common.utils import quotation_to_decimal
from src.instrument.models import Instrument
from src.portfolio.models import Portfolio, PortfolioCost, PortfolioPosition


async def get_latest_portfolio_cost(
    session: AsyncSession, *, subaccount: Subaccount, currency: str = "rub"
) -> Decimal | None:
    cost = await session.scalars(
        select(PortfolioCost.value)
        .join(Portfolio)
        .filter(
            Portfolio.subaccount_id == subaccount.id, PortfolioCost.currency == currency
        )
        .order_by(Portfolio.date_added.desc())
    )
    return cost.first()


async def get_latest_portfolio(
    session: AsyncSession, *, subaccount: Subaccount
) -> Portfolio | None:
    async with AsyncClient(subaccount.account.token) as client:
        try:
            response = await client.operations.get_portfolio(
                account_id=subaccount.broker_id
            )
        except AioRequestError:
            response = None

    if response is None:
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
            .limit(1)
        )
        return portfolio.first()

    instruments = await session.scalars(
        select(Instrument).filter(
            Instrument.uid.in_([p.instrument_uid for p in response.positions])
        )
    )
    instruments = {str(i.uid): i for i in instruments.all()}

    portfolio = Portfolio(
        subaccount=subaccount,
        date_added=datetime.utcnow(),
        cost=[
            PortfolioCost(
                currency="rub",
                value=sum(
                    [
                        quotation_to_decimal(response.total_amount_bonds),
                        quotation_to_decimal(response.total_amount_bonds),
                        quotation_to_decimal(response.total_amount_etf),
                        quotation_to_decimal(response.total_amount_currencies),
                        quotation_to_decimal(response.total_amount_futures),
                    ]
                ),
            )
        ],
        positions=[
            PortfolioPosition(
                instrument_uid=p.instrument_uid,
                instrument=instruments[p.instrument_uid],
                quantity=quotation_to_decimal(p.quantity_lots),
                blocked=quotation_to_decimal(p.blocked_lots),
                average_price=quotation_to_decimal(p.average_position_price),
                expected_yield=quotation_to_decimal(p.expected_yield),
                current_price=quotation_to_decimal(p.current_price),
                var_margin=quotation_to_decimal(p.var_margin),
                current_nkd=quotation_to_decimal(p.current_nkd),
            )
            for p in response.positions
        ],
    )
    return portfolio


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
    last_cost = await get_latest_portfolio_cost(session, subaccount=subaccount)
    cost = await get_portfolio_cost(session, subaccount=subaccount, range="today")
    if last_cost is None:
        return {"cost": 0, "daily_gain": 0}
    return {"cost": last_cost, "daily_gain": last_cost / cost[0][0]}
