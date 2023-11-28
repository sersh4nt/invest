from datetime import datetime
from typing import Any, Optional, Type

from pydantic import BaseModel, validator

from src.backtest.schemas import BacktestRead


class RobotBase(BaseModel):
    image: str
    name: str
    description: Optional[str]
    config: Any


class RobotCreate(RobotBase):
    pass


class RobotScheme(RobotBase):
    id: int
    creator: str
    used_by: int = 0
    avg_yield: float | None = None

    @validator("creator", pre=True)
    def set_creator(cls: Type["RobotScheme"], v: Any) -> str:  # noqa: N805
        try:
            return str(v)
        except Exception as e:
            raise ValueError("unable to parse string") from e

    class Config:
        orm_mode = True


class WorkerBase(BaseModel):
    subaccount_id: int
    config: Any


class WorkerCreate(WorkerBase):
    is_enabled: bool
    robot_id: int


class WorkerScheme(WorkerBase):
    id: int
    robot: RobotScheme
    container_name: str
    status: Optional[str]

    class Config:
        orm_mode = True


class ContainerMessage(BaseModel):
    date: datetime
    message: str


class WorkersStats(BaseModel):
    active: Optional[int]
    created: Optional[int]
    running: Optional[int]
    restarting: Optional[int]
    exited: Optional[int]
    paused: Optional[int]
    dead: Optional[int]


class RobotBacktestScheme(BaseModel):
    backtests: list[BacktestRead]
    avg_yield: float | None
