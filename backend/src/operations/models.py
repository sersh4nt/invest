from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship
from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Operation(Base, IntegerIDPKMixin):
    __tablename__ = "operations"

    subaccount_id: int = Column(
        BigInteger, ForeignKey("subaccounts.id", ondelete="CASCADE")
    )
    broker_id: str = Column(String)
    currency: str = Column(String(length=3))
    payment: Decimal = Column(Numeric(18, 9))
    price: Decimal = Column(Numeric(18, 9))
    type: str = Column(String)
    state: str = Column(String)
    quantity: int = Column(BigInteger)
    instrument_figi: str = Column(String(length=12))
    commission: Decimal = Column(Numeric(18, 9))
    date: datetime = Column(DateTime(timezone=True))

    subaccount = relationship("Subaccount", back_populates="operations")
    trades = relationship("OperationTrade", back_populates="operation")


class OperationTrade(Base, IntegerIDPKMixin):
    __tablename__ = "operation_trades"

    operation_id: int = Column(
        BigInteger, ForeignKey("operations.id", ondelete="CASCADE")
    )
    date: datetime = Column(DateTime(timezone=True))
    quantity: int = Column(BigInteger)
    price: Decimal = Column(Numeric(18, 9))

    operation = relationship("Operation", back_populates="trades")
