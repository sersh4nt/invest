from uuid import UUID

from fastapi import APIRouter
from fastapi_users import FastAPIUsers

from src.auth.service import auth_backend

from .dependencies import get_user_manager
from .models import User
from .schemas import UserCreate, UserRead, UserUpdate

fastapi_users = FastAPIUsers[User, UUID](get_user_manager, [auth_backend])

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
