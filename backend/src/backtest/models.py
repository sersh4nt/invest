from datetime import datetime
from typing import Any, Optional

from sqlalchemy import BigInteger, Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, UUIDPKMixin


class BacktestResult(Base, UUIDPKMixin, AuditMixin):
    __tablename__ = "backtest_results"

    robot_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("robots.id"))
    initial_capital: Mapped[Optional[int]] = mapped_column(
        BigInteger, default=1_000_000
    )
    date_from: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    date_to: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    interval_raw: Mapped[Optional[str]]
    broker_fee: Mapped[Optional[float]] = mapped_column(Float, default=0.3)
    figi: Mapped[Optional[str]] = mapped_column(String(length=12))
    is_started: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    is_finished: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    robot_config: Mapped[Any] = mapped_column(JSONB, default={})
    results: Mapped[Any] = mapped_column(JSONB, default={})
    relative_yield: Mapped[Optional[float]]
    absolute_yield: Mapped[Optional[float]]
    time_elapsed: Mapped[Optional[float]]

    instrument = relationship(
        "Instrument",
        primaryjoin="Instrument.figi==BacktestResult.figi",
        foreign_keys=[figi],
        lazy="selectin",
    )
