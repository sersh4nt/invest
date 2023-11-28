from typing import Sequence

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
) -> tuple[Sequence[Instrument], int]:
    stmt = select(Instrument).filter(
        Instrument.figi is not None, Instrument.is_tradable is True
    )
    if filter is not None:
        stmt = filter.filter(stmt)
        stmt = filter.sort(stmt)

    count = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    stmt = paginate_stmt(stmt, pagination)
    result = await session.scalars(stmt)
    return result.all(), count or 0


async def list_instrument_metrics(
    session: AsyncSession,
    *,
    filter: Filter | None = None,
    pagination: PaginationOpts | None = None
) -> tuple[Sequence[InstrumentMetrics], int]:
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
    return result.all(), count or 0
