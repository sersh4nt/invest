import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from sqlalchemy import ColumnElement, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class Instrument(Base):
    __tablename__ = "instruments"

    uid: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    figi: Mapped[Optional[str]] = mapped_column(String(length=12))
    ticker: Mapped[Optional[str]]
    lot: Mapped[Optional[int]]
    currency: Mapped[str] = mapped_column(String(length=3), default="rub")
    name: Mapped[Optional[str]] = mapped_column(Text)
    min_price_increment: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))
    image_link: Mapped[Optional[str]]
    position_uid: Mapped[Optional[uuid.UUID]] = mapped_column(UUID, index=True)
    is_tradable: Mapped[Optional[bool]]

    __mapper_args__ = {
        "polymorphic_identity": "instrument",
        "polymorphic_on": "type",
    }


class Currency(Instrument):
    __tablename__ = "currencies"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )
    iso: Mapped[str] = mapped_column(String(length=3))

    __mapper_args__ = {"polymorphic_identity": "currency"}


class Share(Instrument):
    __tablename__ = "shares"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )

    __mapper_args__ = {"polymorphic_identity": "share"}


class ETF(Instrument):
    __tablename__ = "etfs"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )
    fixed_commission: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "etf"}


class Bond(Instrument):
    __tablename__ = "bonds"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )
    coupon_quantity_per_year: Mapped[Optional[int]]
    maturity_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    nominal: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))
    initial_nominal: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))
    issue_size: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "bond"}


class Future(Instrument):
    __tablename__ = "futures"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )
    futures_type: Mapped[Optional[str]]
    asset_type: Mapped[Optional[str]]
    basic_asset: Mapped[Optional[uuid.UUID]] = mapped_column(UUID)
    basic_asset_size: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))
    expiration_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    def is_expired(self) -> bool:
        now = datetime.utcnow().replace(tzinfo=timezone.utc)
        return self.expiration_date >= now

    __mapper_args__ = {"polymorphic_identity": "future"}


class Option(Instrument):
    __tablename__ = "options"

    uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid"), primary_key=True
    )
    direction: Mapped[Optional[str]]
    payment_type: Mapped[Optional[str]]
    style: Mapped[Optional[str]]
    settlement_style: Mapped[Optional[str]]
    settlement_currency: Mapped[Optional[str]] = mapped_column(String(length=3))
    asset_type: Mapped[Optional[str]]
    basic_asset: Mapped[Optional[uuid.UUID]] = mapped_column(UUID)
    basic_asset_size: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))
    strike_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(28, 9))

    __mapper_args__ = {"polymorphic_identity": "option"}


class InstrumentMetrics(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "instrument_metrics"

    figi: Mapped[str] = mapped_column(String(length=12))
    volatility: Mapped[Optional[float]]
    buy_volume: Mapped[Optional[float]]
    sell_volume: Mapped[Optional[float]]
    spread: Mapped[Optional[float]]
    last_price: Mapped[Optional[float]]
    relative_price: Mapped[Optional[float]]
    gain: Mapped[Optional[float]]

    @hybrid_property
    def volume(self) -> float:
        return (self.buy_volume or 0) + (self.sell_volume or 0)

    @volume.inplace.expression
    @classmethod
    def _volume_expression(cls) -> ColumnElement[float | None]:
        return cls.buy_volume + cls.sell_volume

    @hybrid_property
    def vv(self) -> float:
        return (self.volatility or 0) * (
            (self.buy_volume or 0) + (self.sell_volume or 0)
        )

    @vv.inplace.expression
    @classmethod
    def _vv_expression(cls) -> ColumnElement[float | None]:
        return cls.volatility * (cls.buy_volume + cls.sell_volume)

    instrument: Mapped["Instrument"] = relationship(
        "Instrument",
        primaryjoin="Instrument.figi==InstrumentMetrics.figi",
        foreign_keys=[figi],
    )
