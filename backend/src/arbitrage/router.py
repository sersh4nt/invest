import src.arbitrage.service as arbitrage_service
from fastapi import APIRouter, Query
from src.arbitrage.schemas import ArbitrageResult

router = APIRouter(tags=["arbitrage"])


@router.get("/arbitrage-rate", response_model=list[ArbitrageResult])
async def get_arbitrage_deals(
    symbols: list[str] = Query(),
    deals: int = Query(),
    initial_amount: int = Query(..., alias="initialAmount"),
    payment_methods: list[str] = Query(..., alias="paymentMethods"),
    buy_taker: bool = Query(True, alias="buyTaker"),
    sell_taker: bool = Query(False, alias="buyTaker"),
):
    results = await arbitrage_service.calculate_results(
        symbols=symbols,
        initial_amount=initial_amount,
        deals=deals,
        payment_methods=payment_methods,
        buy_taker=buy_taker,
        sell_taker=sell_taker,
    )
    return results
