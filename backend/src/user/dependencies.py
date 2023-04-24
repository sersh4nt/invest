from typing import Generator

from fastapi import Depends
from fastapi_users import BaseUserManager
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_async_session

from .service import UserManager


def get_user_db(
    session: AsyncSession = Depends(get_async_session),
) -> Generator[SQLAlchemyUserDatabase, None]:
    yield SQLAlchemyUserDatabase(session)


def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> Generator[BaseUserManager, None]:
    yield UserManager(user_db)
