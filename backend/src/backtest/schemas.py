from datetime import datetime
from typing import Any, Literal
from uuid import UUID, uuid4

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
    time_elapsed: float
    is_started: bool
    is_finished: bool
    results: dict
    relative_yield: float
    absolute_yield: float

    class Config:
        orm_mode = True
