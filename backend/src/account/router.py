from typing import List

import src.account.service as account_service
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_async_session
from src.user.dependencies import get_current_user
from src.user.models import User

from .dependencies import get_user_account
from .models import Account
from .schemas import AccountCreate, AccountScheme, SubaccountScheme

router = APIRouter(tags=["accounts"])


@router.post("/accounts", response_model=AccountScheme)
async def create_account(
    data: AccountCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
):
    account = await account_service.create_account(session, data=data, user=user)
    return account


@router.get("/accounts", response_model=List[AccountScheme])
async def get_accounts_list(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user),
):
    accounts = await account_service.list_user_accounts(session, user=user)
    return accounts


@router.get("/accounts/{account_id}", response_model=AccountScheme)
async def get_account(account: Account = Depends(get_user_account)):
    return account


@router.get("/accounts/{account_id}/subaccounts", response_model=List[SubaccountScheme])
async def get_subaccounts(account: Account = Depends(get_user_account)):
    return account.subaccounts
