from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import BaseModel
from src.arbitrage.models import ArbitrageDeltas
from src.instrument.schemas import InstrumentScheme


class ArbitrageDeltasBase(BaseModel):
    share_figi: str
    future_figi: str
    d_take_calculated: float | None
    d_return_calculated: float | None
    d_take: float | None
    d_return: float | None
    volume: int | None
    spread_required: float
    is_active: bool | None
    multiplier: int | None


class ArbitrageDeltasScheme(ArbitrageDeltasBase):
    share: InstrumentScheme | None
    future: InstrumentScheme | None

    class Config:
        orm_mode = True


class ArbitrageDeltasFilter(Filter):
    order_by: list[str] | None
    is_active: bool | None

    class Constants(Filter.Constants):
        model = ArbitrageDeltas
