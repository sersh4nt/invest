import uuid
from typing import Any, Optional

from sqlalchemy import BigInteger, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class Robot(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "robots"

    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("users.id", ondelete="SET NULL")
    )
    image: Mapped[str]
    config: Mapped[Optional[Any]] = mapped_column(JSONB)
    name: Mapped[Optional[str]]
    description: Mapped[Optional[str]] = mapped_column(Text)

    creator = relationship("User")
    backtests = relationship("BacktestResult", lazy="selectin")


class Worker(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "workers"

    robot_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("robots.id", ondelete="CASCADE")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("users.id", ondelete="CASCADE")
    )
    subaccount_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("subaccounts.id", ondelete="CASCADE")
    )
    config: Mapped[Any] = mapped_column(JSONB)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    container_name: Mapped[Optional[str]]

    user = relationship("User", back_populates="workers")
    robot = relationship("Robot")
    subaccount = relationship("Subaccount")
