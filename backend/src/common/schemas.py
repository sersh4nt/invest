from pydantic import BaseModel


class DefaultResponse(BaseModel):
    status: bool
    msg: str
