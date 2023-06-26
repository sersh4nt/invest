import asyncio
from collections import Counter
from datetime import datetime
from statistics import mean
from typing import Annotated, Any, List

from fastapi import APIRouter, Body, Depends, Query
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
    ContainerMessage,
    RobotBacktestScheme,
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
    for robot, cnt, avg_yield in robots:
        robot.used_by = cnt
        robot.avg_yield = avg_yield
        items.append(robot)
    return {"count": count, "page": pagination.page or 0, "items": items}


@router.get("/robots/{robot_id}/backtests", response_model=RobotBacktestScheme)
async def list_robot_backtests(robot: Robot = Depends(get_robot_by_id)):
    backtests = robot.backtests
    vals = [b.relative_yield for b in backtests if b.relative_yield is not None]
    avg_yield = mean(vals) if len(vals) > 1 else 0
    return {"backtests": robot.backtests, "avg_yield": avg_yield}


@router.get("/workers", response_model=Page[WorkerScheme])
async def list_workers(
    session: AsyncSession = Depends(get_async_session),
    pagination: PaginationOpts = Depends(),
    user: User = Depends(get_current_user),
):
    workers, count = await robot_service.list_workers(
        session, pagination=pagination, user=user
    )
    tasks = [robot_service.get_worker_status(w) for w in workers]
    statuses = await asyncio.gather(*tasks)
    for worker, status in zip(workers, statuses):
        worker.status = status
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


@router.delete("/workers/{worker_id}", response_model=WorkerScheme)
async def delete_worker(
    worker: Worker = Depends(get_user_worker_by_id),
    session: AsyncSession = Depends(get_async_session),
):
    return await robot_service.delete_worker(session, worker=worker)


@router.put("/workers/{worker_id}/settings", response_model=WorkerScheme)
async def update_worker_settings(
    config: Any = Body(...),
    worker: Worker = Depends(get_user_worker_by_id),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
):
    return await robot_service.update_worker_config(
        session, user=user, worker=worker, config=config
    )


@router.get("/workers/{worker_id}/status", response_model=str)
async def get_worker_status(worker: Worker = Depends(get_user_worker_by_id)):
    return await robot_service.get_worker_status(worker)


@router.get("/workers/{worker_id}/logs", response_model=list[ContainerMessage])
async def get_worker_logs(
    worker: Worker = Depends(get_user_worker_by_id),
    logs_since: Annotated[datetime | None, Query(alias="logsSince")] = None,
):
    return await robot_service.get_worker_logs(worker, logs_since)


@router.post("/workers/{worker_id}/start", response_model=str)
async def start_worker(
    worker: Worker = Depends(get_user_worker_by_id),
):
    return await robot_service.start_worker(worker)


@router.post("/workers/{worker_id}/stop", response_model=str)
async def stop_worker(
    worker: Worker = Depends(get_user_worker_by_id),
):
    return await robot_service.stop_worker(worker)


@router.post("/workers/{worker_id}/restart", response_model=str)
async def restart_worker(
    worker: Worker = Depends(get_user_worker_by_id),
):
    return await robot_service.restart_worker(worker)
