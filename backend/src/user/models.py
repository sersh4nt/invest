from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from src.db.mixins import AuditMixin


class User(SQLAlchemyBaseUserTableUUID, Base, AuditMixin):
    __tablename__ = "users"

    accounts = relationship("Account", back_populates="user", lazy="selectin")
    workers = relationship("Worker", back_populates="user")

    def __str__(self) -> str:
        return self.email
