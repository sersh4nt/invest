from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from tinkoff.invest import AsyncClient
from tinkoff.invest.async_services import AsyncServices

import src.account.service as account_service
from src.db.session import get_async_session
from src.exceptions import NotFound
from src.user.dependencies import get_current_user
from src.user.models import User


async def get_tinkoff_client_from_token(
    token: str,
) -> AsyncGenerator[AsyncServices, None]:
    async with AsyncClient(token) as client:
        yield client


async def get_user_account(
    account_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
):
    account = await account_service.get_account_by_id(session, account_id=account_id)
    if account is None or account.user_id != user.id and not user.is_superuser:
        raise NotFound()
    return account
