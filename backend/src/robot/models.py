import uuid

from sqlalchemy import BigInteger, Boolean, Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from src.db.base_class import Base
from src.db.mixins import AuditMixin, IntegerIDPKMixin


class Robot(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "robots"

    creator_ud: uuid.UUID = Column(UUID, ForeignKey("users.id"))
    image: str = Column(String, nullable=False)
    config: dict = Column(JSONB, default={})
    name: str = Column(String)
    description: str = Column(Text)

    users = relationship("User", secondary="workers", back_populates="robots")
    creator = relationship("User")


class Worker(Base, IntegerIDPKMixin, AuditMixin):
    __tablename__ = "workers"

    robot_id: int = Column(BigInteger, ForeignKey("robots.id"))
    user_id: uuid.UUID = Column(UUID, ForeignKey("users.id"))
    config: dict = Column(JSONB, default={})
    is_enabled: bool = Column(Boolean, default=False)


class RobotBacktestResult(Base, IntegerIDPKMixin):
    robot_id: int = Column(BigInteger, ForeignKey("robots.id"))
