from typing import AsyncGenerator

from src import models
from src.db.session import async_session
from src.services.users import UserManager
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, models.User)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
