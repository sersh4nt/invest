from datetime import datetime
from typing import List

from pydantic import BaseModel
from src.instrument.schemas import InstrumentScheme


class PortfolioCostTimestampted(BaseModel):
    value: float
    ts: datetime

    class Config:
        orm_mode = True


class PortfolioCostList(BaseModel):
    currency: str
    values: List[PortfolioCostTimestampted]

    class Config:
        orm_mode = True


class PortfolioCostScheme(BaseModel):
    currency: str
    value: float

    class Config:
        orm_mode = True


class PortfolioPositionScheme(BaseModel):
    instrument: InstrumentScheme
    quantity: float
    blocked: float
    average_price: float
    expected_yield: float
    current_price: float
    var_margin: float
    current_nkd: float

    class Config:
        orm_mode = True


class PortfolioScheme(BaseModel):
    cost: List[PortfolioCostScheme] = []
    date_added: datetime
    positions: List[PortfolioPositionScheme] = []

    class Config:
        orm_mode = True
