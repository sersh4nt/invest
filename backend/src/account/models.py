from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Account(Base, IntegerIDPKMixin):
    __tablename__ = "accounts"

    user_id: UUID = Column(UUID, ForeignKey("users.id"), nullable=False)
    token: str = Column(String, nullable=False, unique=True)
    name: str = Column(String)
    description: str = Column(Text)

    user = relationship("User", back_populates="accounts")
    subaccounts = relationship("Subaccount", back_populates="account")


class Subaccount(Base, IntegerIDPKMixin):
    __tablename__ = "subaccounts"

    account_id: int = Column(BigInteger, ForeignKey("accounts.id"), nullable=False)
    broker_id: str = Column(String, nullable=False, unique=True)
    type: str = Column(String)
    name: str = Column(String)
    description: str = Column(Text)
    is_enabled: bool = Column(Boolean, default=False, nullable=False)
    opened_date: datetime = Column(DateTime(timezone=True))

    account = relationship("Account", back_populates="subaccounts")
    portfolio = relationship("Portfolio", back_populates="subaccount")
    operations = relationship("Operation", back_populates="subaccount")
