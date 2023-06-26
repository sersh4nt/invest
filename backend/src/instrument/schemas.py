from typing import Optional
from uuid import UUID

from fastapi_filter import FilterDepends, with_prefix
from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import BaseModel

from src.instrument.models import Instrument, InstrumentMetrics


class InstrumentFilter(Filter):
    type: str | None
    q: str | None
    order_by: list[str] | None
    ticker: str | None

    class Constants(Filter.Constants):
        model = Instrument
        search_field_name = "q"
        search_model_fields = ["name", "ticker", "figi"]


class InstrumentMetricsFilter(Filter):
    order_by: list[str] | None
    instrument: InstrumentFilter | None = FilterDepends(
        with_prefix("instrument", InstrumentFilter)
    )

    class Constants(Filter.Constants):
        model = InstrumentMetrics


class InstrumentScheme(BaseModel):
    uid: UUID
    type: str
    figi: str
    ticker: str
    currency: str
    name: str
    lot: int
    image_link: Optional[str] = None

    class Config:
        orm_mode = True


class InstrumentMetricsScheme(BaseModel):
    instrument: InstrumentScheme | None
    volatility: float
    buy_volume: float
    sell_volume: float
    spread: float
    last_price: float
    relative_price: float
    gain: float

    class Config:
        orm_mode = True
