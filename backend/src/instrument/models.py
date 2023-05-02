from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


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

    __mapper_args__ = {
        "polymorphic_identity": "instrument",
        "polymorphic_on": "type",
    }

    candles = relationship("Candle")


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


class Candle(Base, IntegerIDPKMixin):
    __tablename__ = "candles"

    instrument_uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"))
    high: Decimal = Column(Numeric(18, 9))
    low: Decimal = Column(Numeric(18, 9))
    open: Decimal = Column(Numeric(18, 9))
    close: Decimal = Column(Numeric(18, 9))
    volume: int = Column(Integer)
    date: datetime = Column(DateTime(timezone=True))
    resolution: str = Column(String)
