import json
import uuid
from copy import deepcopy
from datetime import datetime
from typing import Any, List, Tuple

from dateutil import parser
from docker.errors import APIError, ImageNotFound
from docker.models.containers import Container
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import src.account.service as account_service
import src.robot.docker as docker_service
from src.account.models import Subaccount
from src.backtest.models import BacktestResult
from src.common.pagination import PaginationOpts
from src.common.utils import paginate_stmt
from src.robot.exception import RobotNotFoundError, SubaccountNotFoundError
from src.robot.models import Robot, Worker
from src.robot.schemas import ContainerMessage, WorkerCreate
from src.user.models import User


async def get_worker_by_id(session: AsyncSession, *, worker_id: int) -> Worker | None:
    result = await session.scalars(
        select(Worker)
        .filter(Worker.id == worker_id)
        .options(selectinload(Worker.robot).selectinload(Robot.creator))
    )
    return result.one_or_none()


async def get_robot_by_id(session: AsyncSession, *, robot_id: int) -> Robot | None:
    result = await session.scalars(
        select(Robot).filter(Robot.id == robot_id).options(selectinload(Robot.creator))
    )
    return result.one_or_none()


async def list_robots(
    session: AsyncSession, *, pagination: PaginationOpts = None
) -> Tuple[Tuple[List[Robot], int, float], int]:
    stmt = (
        select(
            Robot,
            func.count(distinct(Worker.user_id)).label("used_by"),
            func.avg(
                BacktestResult.relative_yield
                * 31536000
                / (
                    func.extract("epoch", BacktestResult.date_to)
                    - func.extract("epoch", BacktestResult.date_from)
                )
            ).label("avg_yield"),
        )
        .join(Worker, isouter=True)
        .join(BacktestResult, isouter=True)
        .options(selectinload(Robot.creator))
        .group_by(Robot.id)
    )
    stmt = paginate_stmt(stmt, pagination)
    results = await session.execute(stmt)
    count = await session.scalar(select(func.count(Robot.id)))
    return results.all(), count


async def list_workers(
    session: AsyncSession, *, pagination: PaginationOpts = None, user: User
) -> Tuple[List[Worker], int]:
    stmt = (
        select(Worker)
        .filter(Worker.user_id == user.id)
        .options(selectinload(Worker.robot).selectinload(Robot.creator))
    )
    stmt = paginate_stmt(stmt, pagination)
    results = await session.scalars(stmt)
    count = await session.scalar(
        select(func.count(Worker.id)).filter(Worker.user_id == user.id)
    )
    return results.all(), count


def create_worker_env(configs: list[Any], strategy_name: str) -> list[Any]:
    result = []
    for config in configs:
        current = deepcopy(config)
        figi = current.pop("figi", None)
        if figi is None:
            continue
        result.append(
            {"figi": figi, "strategy": {"name": strategy_name, "parameters": current}}
        )
    return result


def create_container_env(
    broker_id: str, token: str, configs: list[Any], strategy_name: str
) -> dict:
    return {
        "INSTRUMENTS": json.dumps(create_worker_env(configs, strategy_name)),
        "ACCOUNT_ID": broker_id,
        "TOKEN": token,
    }


async def create_worker_from_robot(
    user: User, robot: Robot, subaccount: Subaccount, config: Any
) -> tuple[str, Container]:
    "returns status and container name"
    env = create_container_env(
        subaccount.broker_id, subaccount.account.token, config, robot.name
    )
    image = robot.image
    name = f"user_{str(user.id)}_worker_{str(uuid.uuid4())}"

    status = "created"
    try:
        container = await run_in_threadpool(
            docker_service.create_container, image, name, env
        )
    except ImageNotFound as e:
        print(e)
        status = "error"
        raise RobotNotFoundError()
    except APIError as e:
        status = "error"
        print("Got error during creating container")
        print(e)

    return status, container


async def create_worker(
    session: AsyncSession, *, data: WorkerCreate, user: User
) -> Tuple[Worker, str]:
    subaccount = await account_service.get_subaccount_by_id(
        session, subaccount_id=data.subaccount_id
    )
    if subaccount is None:
        raise SubaccountNotFoundError()

    robot = await get_robot_by_id(session, robot_id=data.robot_id)
    if robot is None:
        raise RobotNotFoundError()

    status, container = await create_worker_from_robot(
        user, robot, subaccount, data.config
    )

    if data.is_enabled:
        try:
            status = await run_in_threadpool(docker_service.start_container, container)
        except APIError:
            status = "error"

    worker = Worker(
        robot=robot,
        user=user,
        subaccount=subaccount,
        config=data.config,
        is_enabled=data.is_enabled,
        container_name=container.name,
    )
    session.add(worker)
    await session.commit()

    return worker, status


async def get_worker_status(worker: Worker) -> str:
    status = await run_in_threadpool(docker_service.get_status, worker.container_name)
    return status


async def get_worker_logs(
    worker: Worker, logs_since: datetime | None = None
) -> List[ContainerMessage]:
    logs = await run_in_threadpool(
        docker_service.get_logs, worker.container_name, logs_since
    )
    lines: List[ContainerMessage] = []
    if logs:
        for line in logs.decode().strip().split("\n"):
            date, message = line.split(" ", 1)
            lines.append({"date": parser.isoparse(date), "message": message})
    return lines


async def start_worker(worker: Worker):
    status = await run_in_threadpool(docker_service.start_worker, worker.container_name)
    return status


async def stop_worker(worker: Worker):
    status = await run_in_threadpool(docker_service.stop_worker, worker.container_name)
    return status


async def restart_worker(worker: Worker):
    status = await run_in_threadpool(
        docker_service.restart_worker, worker.container_name
    )
    return status


async def delete_worker(session: AsyncSession, *, worker: Worker):
    await run_in_threadpool(docker_service.remove_container, worker.container_name)
    await session.delete(worker)
    await session.commit()
    return worker


async def update_worker_config(
    session: AsyncSession, *, user: User, worker: Worker, config: Any
):
    subaccount = await account_service.get_subaccount_by_id(
        session, subaccount_id=worker.subaccount_id
    )
    if subaccount is None:
        raise SubaccountNotFoundError()

    robot = await get_robot_by_id(session, robot_id=worker.robot_id)
    if robot is None:
        raise RobotNotFoundError()

    status = await run_in_threadpool(docker_service.get_status, worker.container_name)

    await run_in_threadpool(docker_service.remove_container, worker.container_name)

    _, container = await create_worker_from_robot(user, robot, subaccount, config)
    worker.container_name = container.name
    worker.config = config
    session.add(worker)
    await session.commit()
    await session.refresh(worker)

    if status == "RUNNING":
        await run_in_threadpool(docker_service.start_container, container.name)
    return worker
