from fastapi import APIRouter, Depends
from src.backtest.schemas import BacktestCreate
from src.exceptions import BadRequest
from src.user.dependencies import get_current_user
from src.user.models import User
from src.worker import backtest_strategy

router = APIRouter(prefix="/backtest")


@router.post("")
def init_backtest_task(data: BacktestCreate, user: User = Depends(get_current_user)):
    if len(user.accounts) == 0:
        raise BadRequest()
    task = backtest_strategy.s(data.dict(), user.id)
    return {"task_id": task.task_id}
