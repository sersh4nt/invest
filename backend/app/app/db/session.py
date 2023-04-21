from app.core.config import settings
from app.schemas.user import UserCreate, UserUpdate
from app.services.users import UserManager
from fastapi_users.exceptions import UserAlreadyExists
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

engine = create_async_engine(settings.DB_URI, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def init_db(manager: UserManager) -> None:
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
        user = await manager.update(UserUpdate(**data.dict()), user)
    finally:
        return user
