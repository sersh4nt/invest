import asyncio

from src.api.deps import get_async_session, get_user_db, get_user_manager
from src.db.session import init_db


async def main():
    session = await get_async_session().__anext__()
    user_db = await get_user_db(session).__anext__()
    manager = await get_user_manager(user_db).__anext__()
    await init_db(manager)


if __name__ == "__main__":
    asyncio.run(main())
