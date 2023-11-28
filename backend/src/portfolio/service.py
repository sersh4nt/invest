from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from typing import Literal, Sequence, Tuple

from sqlalchemy import Row, extract, func, select
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
        scalars = await session.scalars(
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
        return scalars.first()

    instruments = await session.scalars(
        select(Instrument).filter(
            Instrument.uid.in_([p.instrument_uid for p in response.positions])
        )
    )
    instruments_dict: dict[str, Instrument] = {str(i.uid): i for i in instruments.all()}

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
                instrument=instruments_dict[p.instrument_uid],
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
) -> Sequence[Row[Tuple[Decimal, datetime]]]:
    def _get_date_grouper_from_params(range: str) -> tuple[datetime, int]:
        now = datetime.combine(date.today(), time.min, timezone.utc)
        if range == "today":
            return now, 1
        if range == "week":
            return now - timedelta(days=now.weekday()), 300
        if range == "month":
            return now.replace(day=1), 3600
        if range == "year":
            return now.replace(month=1, day=1), 24 * 3600
        return subaccount.opened_date, 24 * 3600 * 30

    dt_from, grouper = _get_date_grouper_from_params(range)

    stmt = (
        select(
            func.avg(PortfolioCost.value),
            func.to_timestamp(
                func.round(extract("epoch", Portfolio.date_added) / grouper) * grouper
            ).label("ts"),
        )
        .join(Portfolio)
        .join(Subaccount)
        .filter(
            Portfolio.subaccount_id == subaccount.id,
            PortfolioCost.currency == currency,
            Portfolio.date_added >= dt_from,
        )
        .group_by("ts")
        .order_by("ts")
    )

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
