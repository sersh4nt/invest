import uuid
from typing import List, Tuple

import src.account.service as account_service
import src.robot.docker as docker_service
from docker.errors import APIError, ImageNotFound
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.models import PaginationOpts
from src.robot.exception import RobotNotFoundError, SubaccountNotFoundError
from src.robot.models import Robot, Worker
from src.robot.schemas import WorkerCreate
from src.user.models import User
from src.utils import paginate_stmt


async def get_robot_by_id(session: AsyncSession, *, robot_id: int) -> Robot:
    result = await session.scalars(
        select(Robot).filter(Robot.id == robot_id).options(selectinload(Robot.creator))
    )
    return result.first()


async def list_robots(
    session: AsyncSession, *, pagination: PaginationOpts = None
) -> Tuple[Tuple[List[Robot], int], int]:
    stmt = (
        select(Robot, func.count(distinct(Worker.user_id)).label("used_by"))
        .join(Worker)
        .options(selectinload(Robot.creator))
        .group_by(Robot)
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

    env = {
        **robot.config,
        **data.config,
        "BROKER_ID": subaccount.broker_id,
        "TOKEN": subaccount.account.token,
    }
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
        container_name=name,
    )
    session.add(worker)
    await session.commit()

    return worker, status
