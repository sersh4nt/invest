import src.robot.service as robot_service
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_async_session
from src.models import Page, PaginationOpts
from src.robot.schemas import RobotScheme, WorkerCreate, WorkerScheme
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
