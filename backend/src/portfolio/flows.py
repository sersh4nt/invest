from typing import Any

from tinkoff.invest import Client
from tinkoff.invest.exceptions import RequestError

from src.account.models import Subaccount
from src.common.utils import quotation_to_decimal
from src.db.session import get_sync_session
from src.portfolio.models import Portfolio, PortfolioCost, PortfolioPosition


class StorePortfolioFlow:
    def run(
        self, subaccount_id: int, *args: tuple, **kwargs: dict[str, Any]
    ) -> int | None:
        session = next(get_sync_session())
        subaccount = session.get(Subaccount, subaccount_id)

        if subaccount is None:
            raise RuntimeError("subaccount not found!")

        with Client(subaccount.account.token) as client:
            try:
                portfolio_response = client.operations.get_portfolio(
                    account_id=subaccount.broker_id
                )
            except RequestError:
                print("Got exception getting portfolio, exit...")
                return None

        positions = [
            PortfolioPosition(
                instrument_uid=p.instrument_uid,
                quantity=quotation_to_decimal(p.quantity_lots),
                blocked=quotation_to_decimal(p.blocked_lots),
                average_price=quotation_to_decimal(p.average_position_price),
                expected_yield=quotation_to_decimal(p.expected_yield),
                current_price=quotation_to_decimal(p.current_price),
                var_margin=quotation_to_decimal(p.var_margin),
                current_nkd=quotation_to_decimal(p.current_nkd),
            )
            for p in portfolio_response.positions
        ]

        cost = [
            PortfolioCost(
                currency=portfolio_response.total_amount_portfolio.currency,
                value=quotation_to_decimal(portfolio_response.total_amount_portfolio),
            )
        ]

        portfolio = Portfolio(
            subaccount_id=subaccount.id, cost=cost, positions=positions
        )
        session.add(portfolio)
        session.commit()
        session.close()
        return portfolio.id
