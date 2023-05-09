from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import relationship
from src.db.base_class import Base
from src.db.mixins import AuditMixin


class User(SQLAlchemyBaseUserTableUUID, Base, AuditMixin):
    __tablename__ = "users"

    accounts = relationship("Account", back_populates="user")
    robots = relationship("Robot", secondary="workers", back_populates="users")
