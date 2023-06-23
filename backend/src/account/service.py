from typing import List

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tinkoff.invest import AccessLevel, AsyncClient

from src.account.models import Account, Subaccount
from src.account.schemas import AccountCreate, AccountUpdate, SubaccountUpdate
from src.account.tinkoff import get_account_subaccounts
from src.common.exceptions import ObjectAlreadyExists
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
        .order_by(Account.id)
    )
    return accounts.all()


async def create_account(
    session: AsyncSession, *, data: AccountCreate, user: User
) -> Account:
    async with AsyncClient(data.token) as client:
        subaccounts = await get_account_subaccounts(client)

    subaccounts = [
        s
        for s in subaccounts
        if s.access_level == AccessLevel.ACCOUNT_ACCESS_LEVEL_FULL_ACCESS
    ]

    obj = await session.scalars(
        select(Account)
        .filter(Account.user_id == user.id, Account.token == data.token)
        .options(selectinload(Account.subaccounts))
    )
    obj = obj.first()

    if obj is None:
        obj = Account(
            **data.dict(),
            user_id=user.id,
            subaccounts=[
                Subaccount(
                    broker_id=subaccount.id,
                    type=subaccount.type.name,
                    opened_date=subaccount.opened_date,
                    name=subaccount.name,
                )
                for subaccount in subaccounts
            ]
        )
    else:
        obj.name = data.name
        obj.description = data.description
        for subaccount in subaccounts:
            if any(acc.broker_id == subaccount.id for acc in obj.subaccounts):
                continue
            obj.subaccounts.append(
                Subaccount(
                    broker_id=subaccount.id,
                    type=subaccount.type.name,
                    opened_date=subaccount.opened_date,
                    name=subaccount.name,
                )
            )
    session.add(obj)
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        raise ObjectAlreadyExists() from e
    return obj


async def update_account(
    session: AsyncSession, *, data: AccountUpdate, account: Account
) -> Account:
    for k, v in data.dict(exclude_unset=True).items():
        setattr(account, k, v)
    session.add(account)
    await session.commit()
    await session.refresh(account)
    return account


async def update_subaccount(
    session: AsyncSession, *, subaccount: Subaccount, data: SubaccountUpdate
) -> Subaccount:
    for k, v in data.dict(exclude_unset=True).items():
        setattr(subaccount, k, v)
    session.add(subaccount)
    await session.commit()
    await session.refresh(subaccount)
    return subaccount


async def cancel_all_orders(subaccount: Subaccount):
    async with AsyncClient(subaccount.account.token) as client:
        await client.cancel_all_orders(account_id=subaccount.broker_id)
