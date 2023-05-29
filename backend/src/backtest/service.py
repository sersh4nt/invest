from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import src.robot.service as robot_service
from src.backtest.models import BacktestResult
from src.backtest.schemas import BacktestCreate
from src.common.exceptions import BadRequest
from src.robot.exception import RobotNotFoundError
from src.user.models import User
from src.worker import backtest_strategy


async def get_result_by_id(session: AsyncSession, *, id: UUID) -> BacktestResult | None:
    stmt = (
        select(BacktestResult)
        .filter(BacktestResult.id == id)
        .options(selectinload(BacktestResult.instrument))
    )
    return (await session.scalars(stmt)).one_or_none()


async def create_result(
    session: AsyncSession, *, data: BacktestCreate, user: User
) -> BacktestResult:
    if len(user.accounts) == 0:
        raise BadRequest()

    if len(user.accounts) == 0:
        raise BadRequest()

    robot = await robot_service.get_robot_by_id(session, robot_id=data.robot_id)
    if robot is None:
        raise RobotNotFoundError()

    results = BacktestResult(**data.dict())
    session.add(results)
    await session.commit()
    await session.refresh(results)

    task = backtest_strategy.delay(data.dict(), user.id, robot.name)
    return {"task_id": task.task_id, "result_id": results.id}
