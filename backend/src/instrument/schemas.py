from typing import Optional
from uuid import UUID

from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import BaseModel

from src.instrument.models import Instrument


class InstrumentFilter(Filter):
    type: str | None
    q: str | None
    order_by: str | None

    class Constants(Filter.Constants):
        model = Instrument
        search_field_name = "q"
        search_model_fields = ["name", "ticker", "figi"]


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
