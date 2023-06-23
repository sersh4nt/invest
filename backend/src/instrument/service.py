from fastapi_filter.contrib.sqlalchemy import Filter
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.common.pagination import PaginationOpts
from src.common.utils import paginate_stmt
from src.instrument.models import Instrument, InstrumentMetrics


async def list_instruments(
    session: AsyncSession,
    *,
    filter: Filter | None = None,
    pagination: PaginationOpts | None = None
) -> tuple[list[Instrument], int]:
    stmt = select(Instrument).filter(
        Instrument.figi != None, Instrument.is_tradable == True
    )
    if filter is not None:
        stmt = filter.filter(stmt)
        stmt = filter.sort(stmt)

    count = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    stmt = paginate_stmt(stmt, pagination)
    result = await session.scalars(stmt)
    return result.all(), count


async def list_instrument_metrics(
    session: AsyncSession,
    *,
    filter: Filter | None = None,
    pagination: PaginationOpts | None = None
) -> tuple[list[InstrumentMetrics], int]:
    stmt = select(
        InstrumentMetrics,
        (InstrumentMetrics.buy_volume + InstrumentMetrics.sell_volume).label("volume"),
        (
            InstrumentMetrics.volatility
            * (InstrumentMetrics.buy_volume + InstrumentMetrics.sell_volume)
        ).label("v-v"),
    ).options(selectinload(InstrumentMetrics.instrument))
    if filter is not None:
        stmt = filter.filter(stmt)
        stmt = filter.sort(stmt)

    count = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    stmt = paginate_stmt(stmt, pagination)
    result = await session.scalars(stmt)
    return result.all(), count
