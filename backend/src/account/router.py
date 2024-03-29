from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

import src.account.service as account_service
from src.account.dependencies import get_user_account, get_user_subaccount
from src.account.models import Account, Subaccount
from src.account.schemas import (
    AccountCreate,
    AccountScheme,
    AccountUpdate,
    SubaccountScheme,
    SubaccountUpdate,
)
from src.db.session import get_async_session
from src.user.dependencies import get_current_user
from src.user.models import User

router = APIRouter(tags=["accounts"])


@router.post("/accounts", response_model=AccountScheme)
async def create_account(
    data: AccountCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
) -> Any:
    account = await account_service.create_account(session, data=data, user=user)
    return account


@router.get("/accounts", response_model=list[AccountScheme])
async def get_accounts_list(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
) -> Any:
    accounts = await account_service.list_user_accounts(session, user=user)
    return accounts


@router.put("/accounts/{account_id}", response_model=AccountScheme)
async def edit_account(
    data: AccountUpdate,
    account: Account = Depends(get_user_account),
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    account = await account_service.update_account(session, data=data, account=account)
    return account


@router.get("/accounts/{account_id}", response_model=AccountScheme)
async def get_account(account: Account = Depends(get_user_account)) -> Any:
    return account


@router.get("/accounts/{account_id}/subaccounts", response_model=list[SubaccountScheme])
async def get_subaccounts(account: Account = Depends(get_user_account)) -> Any:
    return account.subaccounts


@router.put("/subaccounts/{subaccount_id}", response_model=SubaccountScheme)
async def edit_subaccount(
    data: SubaccountUpdate,
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    subaccount = await account_service.update_subaccount(
        session, subaccount=subaccount, data=data
    )
    return subaccount


@router.post("/subaccounts/{subaccount_id}")
async def cancel_all_orders(
    subaccount: Subaccount = Depends(get_user_subaccount),
) -> Any:
    return await account_service.cancel_all_orders(subaccount)
