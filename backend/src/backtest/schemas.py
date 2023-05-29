from datetime import datetime
from typing import Any, Literal
from uuid import UUID, uuid4

from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import BaseModel, Field

from src.backtest.models import BacktestResult
from src.instrument.schemas import InstrumentScheme

INTERVALS_AVAILABLE = ["1min", "5min", "15min", "hour", "day"]


class BacktestFilter(Filter):
    date_from: datetime | None
    date_to: datetime | None
    interval_raw: str | None
    order_by: str | None

    class Constants(Filter.Constants):
        model = BacktestResult


class BacktestCreate(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    robot_id: int
    figi: str
    date_from: datetime
    date_to: datetime
    interval_raw: Literal["1min", "5min", "15min", "hour", "day"]
    broker_fee: float = 0.3
    initial_capital: int = 1_000_000
    robot_config: dict[str, Any]


class BacktestRead(BacktestCreate):
    created_at: datetime
    updated_at: datetime
    time_elapsed: float | None = None
    is_started: bool
    is_finished: bool
    results: dict
    relative_yield: float | None = None
    absolute_yield: float | None = None
    instrument: InstrumentScheme | None = None

    class Config:
        orm_mode = True
