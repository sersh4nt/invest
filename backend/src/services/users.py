from uuid import UUID

from src import models
from src.core.config import settings
from fastapi_users import BaseUserManager, UUIDIDMixin


class UserManager(UUIDIDMixin, BaseUserManager[models.User, UUID]):
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY
