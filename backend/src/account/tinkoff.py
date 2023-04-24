from typing import List

from src.decorators import tinkoff_validates
from tinkoff.invest import Account as TinkoffAccount
from tinkoff.invest.async_services import AsyncServices


@tinkoff_validates
async def get_account_subaccounts(client: AsyncServices) -> List[TinkoffAccount]:
    subaccounts = await client.users.get_accounts()
    return subaccounts.accounts
