import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Account(Base, IntegerIDPKMixin):
    __tablename__ = "accounts"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("users.id"), nullable=False
    )
    token: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    name: Mapped[Optional[str]]
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_sandbox: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="accounts")
    subaccounts: Mapped[list["Subaccount"]] = relationship(
        "Subaccount", back_populates="account", lazy="selectin"
    )


class Subaccount(Base, IntegerIDPKMixin):
    __tablename__ = "subaccounts"

    account_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False
    )
    broker_id: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    type: Mapped[Optional[str]]
    name: Mapped[Optional[str]]
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    opened_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    account: Mapped["Account"] = relationship(
        "Account", back_populates="subaccounts", lazy="selectin"
    )
    portfolio = relationship("Portfolio", back_populates="subaccount")
    operations = relationship("Operation", back_populates="subaccount")
