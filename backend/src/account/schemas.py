from uuid import UUID

from pydantic import BaseModel


class SubaccountBase(BaseModel):
    name: str | None = None
    description: str | None = None
    is_enabled: bool = False


class SubaccountUpdate(SubaccountBase):
    pass


class SubaccountScheme(SubaccountBase):
    id: int
    broker_id: str
    type: str

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    name: str | None = None
    description: str | None = None
    is_sandbox: bool = False


class AccountCreate(AccountBase):
    token: str


class AccountUpdate(AccountBase):
    token: str


class AccountScheme(AccountBase):
    id: int
    user_id: UUID
    subaccounts: list[SubaccountScheme]

    class Config:
        orm_mode = True
