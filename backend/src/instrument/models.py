from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Currency(Base):
    __tablename__ = "currencies"

    iso: str = Column(String(length=3), primary_key=True, index=True)
    figi: str = Column(String(length=12))
    ticker: str = Column(String)
    lot: int = Column(Integer)
    name: str = Column(Text)


class Instrument(Base, IntegerIDPKMixin):
    __tablename__ = "instruments"

    type: str = Column(String, nullable=False)
    figi: str = Column(String(length=12))
    ticker: str = Column(String)
    lot: int = Column(Integer)
    currency: str = Column(String(length=3), ForeignKey("currencies.iso"))
    name: str = Column(Text)
    min_price_increment: Decimal = Column(Numeric(18, 9))
    image_link: str = Column(String)

    __mapper_args__ = {
        "polymorphic_identity": "instrument",
        "polymorphic_on": "type",
    }

    candles = relationship("Candle")


class Share(Instrument):
    __tablename__ = "shares"

    id: int = Column(BigInteger, ForeignKey("instruments.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "share",
    }


class ETF(Instrument):
    __tablename__ = "etfs"

    id: int = Column(BigInteger, ForeignKey("instruments.id"), primary_key=True)
    fixed_commission: Decimal = Column(Numeric(18, 9))

    __mapper_args__ = {
        "polymorphic_identity": "etf",
    }


class Bond(Instrument):
    __tablename__ = "bonds"

    id: int = Column(BigInteger, ForeignKey("instruments.id"), primary_key=True)
    coupon_quantity_per_year: int = Column(Integer)
    maturity_date: datetime = Column(DateTime(timezone=True))
    nominal: Decimal = Column(Numeric(18, 9))
    initial_nominal: Decimal = Column(Numeric(18, 9))
    issue_size: Decimal = Column(Numeric(18, 9))

    __mapper_args__ = {
        "polymorphic_identity": "bond",
    }


class Futures(Instrument):
    __tablename__ = "futures"

    id: int = Column(BigInteger, ForeignKey("instruments.id"), primary_key=True)
    futures_type: str = Column(String)
    asset_type: str = Column(String)
    basic_asset: int = Column(BigInteger, ForeignKey("instruments.id"))
    basic_asset_size: Decimal = Column(Numeric(18, 9))
    expiration_date: datetime = Column(DateTime(timezone=True))

    def is_expired(self):
        now = datetime.utcnow().replace(tzinfo=timezone.utc)
        return self.expiration_date >= now

    __mapper_args__ = {
        "polymorphic_identity": "futures",
        "inherit_condition": (id == Instrument.id),
    }


class Option(Instrument):
    __tablename__ = "options"

    id: int = Column(BigInteger, ForeignKey("instruments.id"), primary_key=True)
    direction: str = Column(String)
    payment_type: str = Column(String)
    style: str = Column(String)
    settlement_style: str = Column(String)
    basic_asset: int = Column(BigInteger, ForeignKey("instruments.id"))
    basic_asset_size: Decimal = Column(Numeric(18, 9))
    strike_price: Decimal = Column(Numeric(18, 9))

    __mapper_args__ = {
        "polymorphic_identity": "option",
        "inherit_condition": (id == Instrument.id),
    }


class Candle(Base, IntegerIDPKMixin):
    __tablename__ = "candles"

    instrument_id = Column(BigInteger, ForeignKey("instruments.id"))
    high = Column(Numeric(18, 9))
    low = Column(Numeric(18, 9))
    open = Column(Numeric(18, 9))
    close = Column(Numeric(18, 9))
    volume = Column(Integer)
    date = Column(DateTime(timezone=True))
    resolution = Column(String)
