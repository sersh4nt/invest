from typing import Sequence

from fastapi_filter.contrib.sqlalchemy import Filter
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.arbitrage.models import ArbitrageDeltas
from src.common.pagination import PaginationOpts
from src.common.utils import paginate_stmt


async def list_arbitrage_deltas(
    session: AsyncSession,
    *,
    filter: Filter | None = None,
    pagination: PaginationOpts | None = None
) -> tuple[Sequence[ArbitrageDeltas], int]:
    stmt = select(ArbitrageDeltas)

    if filter is not None:
        stmt = filter.filter(stmt)
        stmt = filter.sort(stmt)

    count = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    stmt = paginate_stmt(stmt, pagination)
    result = await session.scalars(stmt)
    return result.all(), count or 0
