from typing import AsyncGenerator, Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import Session, sessionmaker

from src.config import settings

async_engine = create_async_engine(settings.DB_URI_ASYNC)
async_session = async_sessionmaker(async_engine, expire_on_commit=False)

sync_engine = create_engine(settings.DB_URI_SYNC)
SessionLocal = sessionmaker(sync_engine, expire_on_commit=False)


def get_sync_session() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
