import asyncio

from fastapi_users.db import SQLAlchemyUserDatabase

from src.db.init_db import init_db
from src.db.session import async_session
from src.user.dependencies import UserManager
from src.user.models import User


async def main() -> None:
    async with async_session() as session:
        user_db = SQLAlchemyUserDatabase(session, User)
        manager = UserManager(user_db)
        await init_db(manager)


if __name__ == "__main__":
    asyncio.run(main())
