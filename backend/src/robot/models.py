from typing import Any
import uuid

from sqlalchemy import BigInteger, Boolean, Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class Robot(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "robots"

    creator_id: uuid.UUID = Column(UUID, ForeignKey("users.id"))
    image: str = Column(String, nullable=False)
    config: Any = Column(JSONB)
    name: str = Column(String)
    description: str = Column(Text)

    creator = relationship("User")
    backtests = relationship("BacktestResult", lazy="selectin")


class Worker(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "workers"

    robot_id: int = Column(BigInteger, ForeignKey("robots.id"))
    user_id: uuid.UUID = Column(UUID, ForeignKey("users.id"))
    subaccount_id: int = Column(BigInteger, ForeignKey("subaccounts.id"))
    config: Any = Column(JSONB)
    is_enabled: bool = Column(Boolean, default=False)
    container_name: str = Column(String)

    user = relationship("User", back_populates="workers")
    robot = relationship("Robot")
    subaccount = relationship("Subaccount")
