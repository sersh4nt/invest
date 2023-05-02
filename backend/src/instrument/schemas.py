from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class InstrumentScheme(BaseModel):
    uid: UUID
    type: str
    figi: str
    ticker: str
    currency: str
    name: str
    image_link: Optional[str] = None

    class Config:
        orm_mode = True
