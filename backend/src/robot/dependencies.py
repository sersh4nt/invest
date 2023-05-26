from typing import List

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

import src.robot.service as robot_service
from src.db.session import get_async_session
from src.common.exceptions import PermissionDenied
from src.robot.exception import WorkerNotFoundError
from src.robot.models import Worker
from src.user.dependencies import get_current_user
from src.user.models import User


async def get_user_worker_by_id(
    worker_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
) -> Worker:
    worker = await robot_service.get_worker_by_id(session, worker_id=worker_id)
    if worker is None:
        raise WorkerNotFoundError()

    if worker.user_id != user.id or not user.is_superuser:
        raise PermissionDenied()

    return worker


async def get_user_workers(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
) -> List[Worker]:
    workers, _ = await robot_service.list_workers(session, user=user)
    return workers
