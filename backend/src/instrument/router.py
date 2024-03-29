from typing import Any

from fastapi import APIRouter, Depends
from fastapi_filter import FilterDepends
from sqlalchemy.ext.asyncio import AsyncSession

import src.instrument.service as instrument_service
from src.common.pagination import Page, PaginationOpts
from src.db.session import get_async_session
from src.instrument.schemas import (
    InstrumentFilter,
    InstrumentMetricsFilter,
    InstrumentMetricsScheme,
    InstrumentScheme,
)

router = APIRouter(prefix="/instruments", tags=["instruments"])


@router.get("", response_model=Page[InstrumentScheme])
async def list_instruments(
    filter: InstrumentFilter = FilterDepends(InstrumentFilter),
    pagination: PaginationOpts = Depends(),
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    items, count = await instrument_service.list_instruments(
        session, filter=filter, pagination=pagination
    )
    return {"items": items, "count": count, "page": pagination.page or 0}


@router.get("/metrics", response_model=Page[InstrumentMetricsScheme])
async def list_instrument_metrics(
    filter: InstrumentMetricsFilter = FilterDepends(InstrumentMetricsFilter),
    pagination: PaginationOpts = Depends(),
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    items, count = await instrument_service.list_instrument_metrics(
        session, filter=filter, pagination=pagination
    )
    return {"items": items, "count": count, "page": pagination.page or 0}
