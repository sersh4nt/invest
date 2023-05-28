from datetime import datetime
from typing import Any, Literal
from uuid import UUID, uuid4
from src.instrument.schemas import InstrumentScheme

from pydantic import BaseModel

INTERVALS_AVAILABLE = ["1min", "5min", "15min", "hour", "day"]


class BacktestCreate(BaseModel):
    id: UUID | None = uuid4()
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
