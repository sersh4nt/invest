from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel

INTERVALS_AVAILABLE = ["1min", "5min", "15min", "hour", "day"]


class BacktestCreate(BaseModel):
    robot_id: int
    figi: str
    date_from: datetime
    date_to: datetime
    interval_raw: Literal["1min", "5min", "15min", "hour", "day"]
    broker_fee: float = 0.3
    initial_capital: int = 1_000_000
    robot_config: dict[str, Any]
