from typing import Any

import src.arbitrage.service as arbitrage_service
from fastapi import APIRouter, Depends
from fastapi_filter import FilterDepends
from sqlalchemy.ext.asyncio import AsyncSession
from src.arbitrage.schemas import ArbitrageDeltasFilter, ArbitrageDeltasScheme
from src.common.pagination import Page, PaginationOpts
from src.db.session import get_async_session

router = APIRouter(prefix="/arbitrage", tags=["arbitrage"])


@router.get("/deltas", response_model=Page[ArbitrageDeltasScheme])
async def list_arbitrage_deltas(
    filter: ArbitrageDeltasFilter = FilterDepends(ArbitrageDeltasFilter),
    session: AsyncSession = Depends(get_async_session),
    pagination: PaginationOpts = Depends(),
) -> Any:
    deltas, count = await arbitrage_service.list_arbitrage_deltas(
        session, filter=filter, pagination=pagination
    )
    return {"items": deltas, "count": count, "page": pagination.page or 0}
