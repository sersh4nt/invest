from typing import Optional

from pydantic import BaseModel, ValidationError, validator


class RobotBase(BaseModel):
    image: str
    name: str
    description: Optional[str]
    config: dict = {}


class RobotCreate(RobotBase):
    pass


class RobotScheme(RobotBase):
    id: int
    creator: str
    used_by: int = 0

    @validator("creator", pre=True)
    def set_creator(cls, v):
        try:
            return str(v)
        except Exception as e:
            raise ValidationError() from e

    class Config:
        orm_mode = True


class WorkerBase(BaseModel):
    subaccount_id: int
    config: dict


class WorkerCreate(WorkerBase):
    is_enabled: bool
    robot_id: int


class WorkerScheme(WorkerBase):
    id: int
    robot: RobotScheme
    container_name: str
    status: Optional[str]

    class Config:
        orm_mode = True
