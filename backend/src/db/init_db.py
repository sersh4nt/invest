from fastapi_users import BaseUserManager
from fastapi_users.exceptions import UserAlreadyExists

from src.config import settings
from src.db import base  # noqa: F401
from src.user.schemas import UserCreate, UserUpdate


async def init_db(manager: BaseUserManager) -> None:
    data = UserCreate(
        email=settings.ADMIN_EMAIL,
        password=settings.ADMIN_PASSWORD,
        is_active=True,
        is_superuser=True,
        is_verified=True,
    )
    try:
        user = await manager.create(data)
    except UserAlreadyExists:
        user = await manager.get_by_email(data.email)
        user = await manager.update(UserUpdate(**data.dict()), user)
    return user
