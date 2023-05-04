from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)

from src.config import settings

bearer_transport = BearerTransport(tokenUrl="api/v1/auth/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.JWT_SECRET, lifetime_seconds=settings.JWT_LIFETIME
    )


auth_backend = AuthenticationBackend(
    name="jwt", transport=bearer_transport, get_strategy=get_jwt_strategy
)
