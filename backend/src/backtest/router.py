from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

import src.backtest.service as backtest_service
from src.backtest.dependencies import backtest_by_id
from src.backtest.models import BacktestResult
from src.backtest.schemas import BacktestCreate, BacktestRead
from src.db.session import get_async_session
from src.user.dependencies import get_current_user
from src.user.models import User

router = APIRouter(prefix="/backtest", tags=["backtest"])


@router.post("")
async def init_backtest_task(
    data: BacktestCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    response = await backtest_service.create_result(session, data=data, user=user)
    return response


@router.get("/{backtest_id}", response_model=BacktestRead)
async def read_backtest(backtest: BacktestResult = Depends(backtest_by_id)) -> Any:
    return backtest
