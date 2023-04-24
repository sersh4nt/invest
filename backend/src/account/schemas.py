from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class SubaccountScheme(BaseModel):
    id: int
    broker_id: str
    type: str
    name: Optional[str]
    description: Optional[str]
    is_enabled: bool

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    token: str
    name: Optional[str] = None
    description: Optional[str] = None


class AccountCreate(AccountBase):
    pass


class AccountUpdate(AccountBase):
    pass


class AccountScheme(AccountBase):
    id: int
    user_id: UUID
    subaccounts: List[SubaccountScheme]

    class Config:
        orm_mode = True
