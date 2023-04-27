from tinkoff.invest import Client

from src.account.models import Subaccount
from src.db.session import get_sync_session
from src.portfolio.models import Portfolio, PortfolioCost, PortfolioPosition
from src.utils import quotation_to_decimal


class StorePortfolioFlow:
    def run(self, subaccount_id: int, *args, **kwargs):
        session = next(get_sync_session())
        subaccount = session.get(Subaccount, subaccount_id)

        with Client(subaccount.account.token) as client:
            portfolio_response = client.operations.get_portfolio(
                account_id=subaccount.broker_id
            )

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
        return portfolio.id
