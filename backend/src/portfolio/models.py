from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Portfolio(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio"

    subaccount_id: int = Column(BigInteger, ForeignKey("subaccounts.id"))
    date_added: datetime = Column(DateTime(timezone=True), server_default=func.now())

    subaccount = relationship("Subaccount", back_populates="portfolio")
    cost = relationship("PortfolioCost", back_populates="portfolio")
    positions = relationship("PortfolioPosition", back_populates="portfolio")


class PortfolioCost(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio_cost"

    portfolio_id: int = Column(BigInteger, ForeignKey("portfolio.id"))
    currency: str = Column(String(length=3))
    value: Decimal = Column(Numeric(11, 2))

    portfolio = relationship("Portfolio", back_populates="cost")


class PortfolioPosition(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio_positions"

    portfolio_id: int = Column(BigInteger, ForeignKey("portfolio.id"))
    instrument_uid: UUID = Column(postgresql.UUID, ForeignKey("instruments.uid"))
    quantity: Decimal = Column(Numeric(11, 2))
    blocked: Decimal = Column(Numeric(11, 2))
    average_price: Decimal = Column(Numeric(11, 2))
    expected_yield: Decimal = Column(Numeric(11, 2))
    current_price: Decimal = Column(Numeric(11, 2))
    var_margin: Decimal = Column(Numeric(11, 2))
    current_nkd: Decimal = Column(Numeric(11, 2))

    portfolio = relationship("Portfolio", back_populates="positions")
    instrument = relationship("Instrument")
