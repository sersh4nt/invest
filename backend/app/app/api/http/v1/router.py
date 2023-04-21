from uuid import UUID

from app import models, schemas
from app.api.deps import get_user_manager
from app.services.auth import auth_backend
from fastapi import APIRouter
from fastapi_users import FastAPIUsers

from .endpoints import *

fastapi_users = FastAPIUsers[models.User, UUID](get_user_manager, [auth_backend])

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(schemas.UserRead, schemas.UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_users_router(schemas.UserRead, schemas.UserUpdate),
    prefix="/users",
    tags=["users"],
)
