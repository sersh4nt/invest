from typing import AsyncGenerator
from uuid import UUID

from fastapi import Depends
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.service import auth_backend
from src.config import settings
from src.db.session import get_async_session

from .models import User


class UserManager(UUIDIDMixin, BaseUserManager[User, UUID]):
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY


async def get_user_db(
    session: AsyncSession = Depends(get_async_session),
) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> AsyncGenerator[BaseUserManager, None]:
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, UUID](get_user_manager, [auth_backend])


get_current_user = fastapi_users.current_user()
get_current_active_user = fastapi_users.current_user(active=True)
