from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from src.instrument.schemas import InstrumentScheme


class OperationTradeScheme(BaseModel):
    date: datetime
    quantity: int
    price: float

    class Config:
        orm_mode = True


class OperationScheme(BaseModel):
    broker_id: str
    currency: str
    payment: float
    price: float
    type: str
    state: str
    quantity: int
    commission: Optional[float]
    date: datetime
    trades: List[OperationTradeScheme]
    instrument: Optional[InstrumentScheme]

    class Config:
        orm_mode = True


class ActiveOrderScheme(BaseModel):
    broker_id: str
    lots_requested: int
    lots_executed: int
    instrument: InstrumentScheme
    direction: str
    price: float
    type: str
    date: datetime


class OperationStats(BaseModel):
    daily_count: int
    total_commission: float


class RevenueStats(BaseModel):
    daily_volume: float
    profit: float
