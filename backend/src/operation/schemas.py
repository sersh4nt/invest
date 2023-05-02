from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


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
    instrument_figi: Optional[str]
    commission: Optional[float]
    date: datetime
    trades: List[OperationTradeScheme]

    class Config:
        orm_mode = True


class ActiveOrderScheme(BaseModel):
    broker_id: str
    lots_requested: int
    lots_executed: int
    instrument_figi: str
    direction: str
    price: float
    type: str
    date: datetime
