from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class Instrument(Base):
    __tablename__ = "instruments"

    uid: UUID = Column(postgresql.UUID, primary_key=True, index=True)
    type: str = Column(String, nullable=False)
    figi: str = Column(String(length=12))
    ticker: str = Column(String)
    lot: int = Column(Integer)
    currency: str = Column(String(length=3), default="rub")
    name: str = Column(Text)
    min_price_increment: Decimal = Column(Numeric(28, 9))
    image_link: str = Column(String)
    position_uid: UUID = Column(postgresql.UUID, index=True)
    is_tradable: bool = Column(Boolean)

    __mapper_args__ = {
        "polymorphic_identity": "instrument",
        "polymorphic_on": "type",
    }


class Currency(Instrument):
    __tablename__ = "currencies"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)
    iso: str = Column(String(length=3))

    __mapper_args__ = {"polymorphic_identity": "currency"}


class Share(Instrument):
    __tablename__ = "shares"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "share"}


class ETF(Instrument):
    __tablename__ = "etfs"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)
    fixed_commission: Decimal = Column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "etf"}


class Bond(Instrument):
    __tablename__ = "bonds"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)
    coupon_quantity_per_year: int = Column(Integer)
    maturity_date: datetime = Column(DateTime(timezone=True))
    nominal: Decimal = Column(Numeric(28, 9))
    initial_nominal: Decimal = Column(Numeric(28, 9))
    issue_size: Decimal = Column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "bond"}


class Future(Instrument):
    __tablename__ = "futures"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)
    futures_type: str = Column(String)
    asset_type: str = Column(String)
    basic_asset: UUID = Column(postgresql.UUID)
    basic_asset_size: Decimal = Column(Numeric(28, 9))
    expiration_date: datetime = Column(DateTime(timezone=True))

    def is_expired(self):
        now = datetime.utcnow().replace(tzinfo=timezone.utc)
        return self.expiration_date >= now

    __mapper_args__ = {"polymorphic_identity": "future"}


class Option(Instrument):
    __tablename__ = "options"

    uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"), primary_key=True)
    direction: str = Column(String)
    payment_type: str = Column(String)
    style: str = Column(String)
    settlement_style: str = Column(String)
    settlement_currency: str = Column(String(length=3))
    asset_type: str = Column(String)
    basic_asset: UUID = Column(postgresql.UUID)
    basic_asset_size: Decimal = Column(Numeric(28, 9))
    strike_price: Decimal = Column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "option"}


class InstrumentMetrics(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "instrument_metrics"

    figi: str = Column(String)
    volatility: float = Column(Float)
    buy_volume: float = Column(Float)
    sell_volume: float = Column(Float)
    spread: float = Column(Float)
    last_price: float = Column(Float)
    relative_price: float = Column(Float)
    gain: float = Column(Float)

    @hybrid_property
    def volume(self) -> float:
        return self.buy_volume + self.sell_volume

    @volume.inplace.expression
    @classmethod
    def _volume_expression(cls):
        return cls.buy_volume + cls.sell_volume

    @hybrid_property
    def vv(self) -> float:
        return self.volatility * (self.buy_volume + self.sell_volume)

    @vv.inplace.expression
    @classmethod
    def _vv_expression(cls):
        return cls.volatility * (cls.buy_volume + cls.sell_volume)

    instrument = relationship(
        "Instrument",
        primaryjoin="Instrument.figi==InstrumentMetrics.figi",
        foreign_keys=[figi],
    )
