import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Portfolio(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio"

    subaccount_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("subaccounts.id", ondelete="CASCADE")
    )
    date_added: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), default=datetime.utcnow()
    )

    subaccount = relationship("Subaccount", back_populates="portfolio")
    cost = relationship("PortfolioCost", back_populates="portfolio")
    positions = relationship("PortfolioPosition", back_populates="portfolio")


class PortfolioCost(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio_cost"

    portfolio_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("portfolio.id", ondelete="CASCADE")
    )
    currency: Mapped[Optional[str]] = mapped_column(String(length=3))
    value: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))

    portfolio = relationship("Portfolio", back_populates="cost")


class PortfolioPosition(Base, IntegerIDPKMixin):
    __tablename__ = "portfolio_positions"

    portfolio_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("portfolio.id", ondelete="CASCADE")
    )
    instrument_uid: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("instruments.uid")
    )
    quantity: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    blocked: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    average_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    expected_yield: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    current_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    var_margin: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))
    current_nkd: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 2))

    portfolio = relationship("Portfolio", back_populates="positions")
    instrument = relationship("Instrument")
