from uuid import UUID

from fastapi_users import BaseUserManager, UUIDIDMixin
from src.config import settings

from .models import User


class UserManager(UUIDIDMixin, BaseUserManager[User, UUID]):
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY
