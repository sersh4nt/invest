from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB

from src.db.base_class import Base
from src.db.mixins import AuditMixin, UUIDPKMixin


class BacktestResult(Base, UUIDPKMixin, AuditMixin):
    __tablename__ = "backtest_results"

    robot_id: int = Column(BigInteger, ForeignKey("robots.id"))
    initial_capital: int = Column(BigInteger, default=1_000_000)
    date_from: datetime = Column(DateTime(timezone=True))
    date_to: datetime = Column(DateTime(timezone=True))
    interval_raw: str = Column(String)
    broker_fee: float = Column(Float, default=0.3)
    figi: str = Column(String(length=12))
    is_started: bool = Column(Boolean, default=False)
    is_finished: bool = Column(Boolean, default=False)
    robot_config: dict = Column(JSONB, default={})
    results: dict = Column(JSONB, default={})
    relative_yield: float = Column(Float)
    absolute_yield: float = Column(Float)
    time_elapsed: float = Column(Float)
