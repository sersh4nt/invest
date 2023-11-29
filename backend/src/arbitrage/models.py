from typing import Optional

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class ArbitrageDeltas(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "arbitrage_deltas"

    share_figi: Mapped[str] = mapped_column(String(length=12))
    future_figi: Mapped[str] = mapped_column(String(length=12))
    d_take_calculated: Mapped[Optional[float]]
    d_return_calculated: Mapped[Optional[float]]
    d_take: Mapped[Optional[float]]
    d_return: Mapped[Optional[float]]
    volume: Mapped[Optional[int]] = mapped_column(Integer, default=0)
    spread_required: Mapped[float] = mapped_column(Float, default=2.0)

    share = relationship(
        "Share",
        primaryjoin="Share.figi == foreign(ArbitrageDeltas.share_figi)",
        foreign_keys=[share_figi],
        lazy="selectin",
    )
    future = relationship(
        "Future",
        primaryjoin="Future.figi == foreign(ArbitrageDeltas.future_figi)",
        foreign_keys=[future_figi],
        lazy="selectin",
    )
