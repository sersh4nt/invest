from sqlalchemy import BigInteger, Boolean, Column, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import IntegerIDPKMixin


class Account(Base, IntegerIDPKMixin):
    __tablename__ = "accounts"

    user_id: UUID = Column(UUID, ForeignKey("users.id"))
    token: str = Column(String, nullable=False)
    name: str = Column(String)
    description: str = Column(Text)

    user = relationship("User", back_populates="accounts")
    subaccounts = relationship("Subaccount", back_populates="account")


class Subaccount(Base, IntegerIDPKMixin):
    __tablename__ = "subaccounts"

    account_id: int = Column(BigInteger, ForeignKey("accounts.id"))
    broker_id: str = Column(String, nullable=False)
    type: str = Column(String)
    name: str = Column(String)
    description: str = Column(Text)
    is_enabled: bool = Column(Boolean, server_default=text("FALSE"))

    account = relationship("Account", back_populates="subaccounts")
    portfolio = relationship("Portfolio", back_populates="subaccount")
