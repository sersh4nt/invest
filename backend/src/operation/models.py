from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Operation(Base, IntegerIDPKMixin):
    __tablename__ = "operations"

    subaccount_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("subaccounts.id", ondelete="CASCADE")
    )
    broker_id: Mapped[Optional[str]]
    currency: Mapped[Optional[str]] = mapped_column(String(length=3))
    payment: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 9))
    price: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 9))
    type: Mapped[Optional[str]]
    state: Mapped[Optional[str]]
    quantity: Mapped[Optional[int]] = mapped_column(BigInteger)
    instrument_figi: Mapped[Optional[str]] = mapped_column(String(length=12))
    commission: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 9))
    date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    subaccount = relationship("Subaccount", back_populates="operations")
    instrument = relationship(
        "Instrument",
        primaryjoin="Instrument.figi==Operation.instrument_figi",
        foreign_keys=[instrument_figi],
    )
    trades = relationship("OperationTrade", back_populates="operation")


class OperationTrade(Base, IntegerIDPKMixin):
    __tablename__ = "operation_trades"

    operation_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("operations.id", ondelete="CASCADE")
    )
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    quantity: Mapped[int] = mapped_column(BigInteger, default=0)
    price: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 9))

    operation = relationship("Operation", back_populates="trades")
