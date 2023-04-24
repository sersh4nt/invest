from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from src.config import settings

engine = create_async_engine(settings.DB_URI, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
