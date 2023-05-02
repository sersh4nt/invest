from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class SubaccountBase(BaseModel):
    name: Optional[str]
    description: Optional[str]
    is_enabled: Optional[bool] = False


class SubaccountUpdate(SubaccountBase):
    pass


class SubaccountScheme(SubaccountBase):
    id: int
    broker_id: str
    type: str

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
