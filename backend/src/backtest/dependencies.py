from uuid import UUID

import src.backtest.service as backtest_service
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.common.exceptions import NotFound
from src.db.session import get_async_session


async def backtest_by_id(
    backtest_id: UUID, session: AsyncSession = Depends(get_async_session)
):
    backtest = await backtest_service.get_result_by_id(session, id=backtest_id)
    if backtest is None:
        raise NotFound()
    return backtest
