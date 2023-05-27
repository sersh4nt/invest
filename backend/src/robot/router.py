import asyncio
from collections import Counter
from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

import src.robot.service as robot_service
from src.common.pagination import Page, PaginationOpts
from src.db.session import get_async_session
from src.robot.dependencies import (
    get_robot_by_id,
    get_user_worker_by_id,
    get_user_workers,
)
from src.robot.models import Robot, Worker
from src.robot.schemas import (
    ContainerStatus,
    RobotScheme,
    WorkerCreate,
    WorkerScheme,
    WorkersStats,
)
from src.user.dependencies import get_current_user
from src.user.models import User

router = APIRouter(tags=["robots"], dependencies=[Depends(get_current_user)])


@router.get("/robots", response_model=Page[RobotScheme])
async def list_robots(
    session: AsyncSession = Depends(get_async_session),
    pagination: PaginationOpts = Depends(),
):
    robots, count = await robot_service.list_robots(session, pagination=pagination)
    items = []
    for robot, cnt in robots:
        robot.used_by = cnt
        items.append(robot)
    return {"count": count, "page": pagination.page or 0, "items": items}


@router.get("/robots/{robot_id}/backtests")
async def list_robot_backtests(robot: Robot = Depends(get_robot_by_id)):
    return robot.backtests


@router.get("/workers", response_model=Page[WorkerScheme])
async def list_workers(
    session: AsyncSession = Depends(get_async_session),
    pagination: PaginationOpts = Depends(),
    user: User = Depends(get_current_user),
):
    workers, count = await robot_service.list_workers(
        session, pagination=pagination, user=user
    )
    return {"count": count, "page": pagination.page or 0, "items": workers}


@router.post("/workers", response_model=WorkerScheme)
async def create_worker(
    data: WorkerCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
):
    worker, status = await robot_service.create_worker(session, data=data, user=user)
    worker.status = status
    return worker


@router.get("/workers/stats/active", tags=["stats"], response_model=WorkersStats)
async def get_active_workers_count(workers: List[Worker] = Depends(get_user_workers)):
    tasks = [robot_service.get_worker_status(worker) for worker in workers]
    results = await asyncio.gather(*tasks)
    return Counter(results)


@router.get("/workers/{worker_id}", response_model=WorkerScheme)
async def read_worker(worker: Worker = Depends(get_user_worker_by_id)):
    return worker


@router.get("/workers/{worker_id}/status", response_model=ContainerStatus)
async def get_worker_status(
    worker: Worker = Depends(get_user_worker_by_id),
    logs_since: Annotated[datetime | None, Query(alias="logsSince")] = None,
):
    status, logs = await asyncio.gather(
        robot_service.get_worker_status(worker),
        robot_service.get_worker_logs(worker, logs_since),
    )
    return {"status": status, "logs": logs}
