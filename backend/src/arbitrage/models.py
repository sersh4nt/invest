from sqlalchemy import Integer, Column, String, Float
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin, AuditMixin


class ArbitrageDeltas(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "arbitrage_deltas"

    share_figi: str = Column(String(length=12))
    future_figi: str = Column(String(length=12))
    d_take_calculated: float = Column(Float)
    d_return_calculated: float = Column(Float)
    d_take: float = Column(Float)
    d_return: float = Column(Float)
    volume: int = Column(Integer, default=0)
    spread_required: float = Column(Float, default=2.0)

    share = relationship(
        "Share",
        primaryjoin="Share.figi==ArbitrageDeltas.share_figi",
        foreign_keys=[share_figi],
        lazy="selectin",
    )
    future = relationship(
        "Future",
        primaryjoin="Future.figi==ArbitrageDeltas.share_figi",
        foreign_keys=[future_figi],
        lazy="selectin",
    )
