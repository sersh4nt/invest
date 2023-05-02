from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import AsyncClient

from src.account.models import Account, Subaccount
from src.account.schemas import AccountCreate, SubaccountUpdate
from src.account.tinkoff import get_account_subaccounts
from src.exceptions import ObjectAlreadyExists
from src.user.models import User


async def get_account_by_id(
    session: AsyncSession, *, account_id: int
) -> Account | None:
    account = await session.scalars(
        select(Account)
        .filter(Account.id == account_id)
        .options(selectinload(Account.subaccounts))
    )
    return account.first()


async def get_subaccount_by_id(
    session: AsyncSession, *, subaccount_id: int
) -> Subaccount | None:
    subaccount = await session.scalars(
        select(Subaccount)
        .filter(Subaccount.id == subaccount_id)
        .options(selectinload(Subaccount.account))
    )
    return subaccount.first()


async def list_user_accounts(session: AsyncSession, *, user: User) -> List[Account]:
    accounts = await session.scalars(
        select(Account)
        .filter(Account.user_id == user.id)
        .options(selectinload(Account.subaccounts))
    )
    return accounts.all()


async def create_account(
    session: AsyncSession, *, data: AccountCreate, user: User
) -> Account:
    async with AsyncClient(data.token) as client:
        subaccounts = await get_account_subaccounts(client)

    account = Account(
        **data.dict(),
        user_id=user.id,
        subaccounts=[
            Subaccount(
                broker_id=subaccount.id,
                type=subaccount.type.name,
                opened_date=subaccount.opened_date,
            )
            for subaccount in subaccounts
        ]
    )
    session.add(account)
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        raise ObjectAlreadyExists() from e
    return account


async def update_subaccount(
    session: AsyncSession, *, subaccount: Subaccount, data: SubaccountUpdate
) -> Subaccount:
    data_dict = data.json(exclude_unset=True)
    for field in jsonable_encoder(subaccount):
        if field in data_dict:
            setattr(subaccount, field, data_dict[field])

    session.add(subaccount)
    await session.commit()
    await session.refresh(subaccount)
    return subaccount
