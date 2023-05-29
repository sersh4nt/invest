import asyncio
from collections import defaultdict
from decimal import Decimal
from itertools import permutations

import httpx

from src.arbitrage.schemas import ArbitrageResult

PAIRS = [
    "BTC/USDT",
    "BUSD/USDT",
    "BNB/USDT",
    "ETH/USDT",
    "USDT/RUB",
    "BTC/BUSD",
    "BNB/BTC",
    "ETH/BTC",
    "BTC/RUB",
    "BNB/BUSD",
    "ETH/BUSD",
    "BUSD/RUB",
    "BNB/ETH",
    "BNB/RUB",
    "ETH/RUB",
]


def generate_payload(asset, pay_type, rows, direction, trans_amount) -> dict:
    return {
        "asset": asset,
        "countries": [],
        "fiat": "RUB",
        "page": 1,
        "payTypes": [pay_type],
        "proMerchantAds": False,
        "publisherType": None,
        "rows": rows,
        "tradeType": direction,
        "transAmount": trans_amount,
    }


async def get_orderbook(symbol: str, limit: int = 1):
    async with httpx.AsyncClient() as client:
        return await client.get(
            "https://api.binance.com/api/v3/depth",
            params={"symbol": symbol, "limit": limit},
        )


async def get_p2p_orderbook(
    direction: str,
    asset: str,
    pay_type: str,
    trans_amount: int = 50000,
    rows: int = 10,
):
    data = {
        "asset": asset,
        "countries": [],
        "fiat": "RUB",
        "page": 1,
        "payTypes": [pay_type],
        "proMerchantAds": False,
        "publisherType": None,
        "rows": rows,
        "tradeType": direction,
        "transAmount": trans_amount,
    }
    async with httpx.AsyncClient() as client:
        return await client.post(
            "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", json=data
        )


async def get_p2p_rate(
    initial_amount: int, symbols: list[str], payment_methods: list[str]
) -> dict:
    directions = ["BUY", "SELL"]

    tasks = [
        get_p2p_orderbook(d, s, p, initial_amount)
        for d in directions
        for s in symbols
        for p in payment_methods
    ]
    r = await asyncio.gather(*tasks)
    result = defaultdict(dict)
    for i, orderbook in enumerate(r):
        direction = directions[i // (len(payment_methods) * len(symbols))]
        symbol = symbols[(i // len(payment_methods)) % len(symbols)]
        payment = payment_methods[i % len(payment_methods)]
        orderbook = orderbook.json()["data"][0]
        result[direction][(symbol, payment)] = Decimal(orderbook["adv"]["price"])
    return result


async def get_convert_rate(symbols: list[str]) -> dict[tuple[str, str], int]:
    tasks = [get_orderbook(s.replace("/", ""), 1) for s in PAIRS]
    r = await asyncio.gather(*tasks)
    result = {(s, s): Decimal(1) for s in symbols}
    for i, rate in enumerate(r):
        c1, c2 = PAIRS[i].split("/")
        rate = rate.json()
        rate = Decimal(rate["bids"][0][0])
        result[(c1, c2)] = rate
        result[(c2, c1)] = Decimal(1) / rate
    return result


async def calculate_results(
    *,
    initial_amount: int = 5000,
    deals: int = 1,
    symbols: list[str] = [],
    payment_methods: list[str] = [],
    buy_taker: bool = True,
    sell_taker: bool = False
) -> list[ArbitrageResult]:
    convert_rate, p2p_rate = await asyncio.gather(
        get_convert_rate(symbols),
        get_p2p_rate(initial_amount, symbols, payment_methods),
    )

    results: list[ArbitrageResult] = []

    for depth in range(2, deals + 2):
        for permutation in permutations(symbols, r=depth):
            for payment_from in payment_methods:
                for payment_to in payment_methods:
                    result = (
                        Decimal(initial_amount)
                        / p2p_rate["BUY" if buy_taker else "SELL"][
                            (permutation[0], payment_from)
                        ]
                        * p2p_rate["SELL" if sell_taker else "BUY"][
                            (permutation[-1], payment_to)
                        ]
                    )

                    for i in range(1, depth):
                        result *= convert_rate[(permutation[i - 1], permutation[i])]

                    revenue = result - initial_amount
                    revenue_relative = revenue / initial_amount

                    if revenue <= 0:
                        continue

                    results.append(
                        ArbitrageResult(
                            initial_amount=initial_amount,
                            final_amount=float(result),
                            revenue=revenue,
                            revenue_relative=revenue_relative,
                            payment_method_from=payment_from,
                            payment_method_to=payment_to,
                            symbols=permutation,
                        )
                    )

    results = sorted(results, key=lambda x: x.revenue_relative, reverse=True)
    return results
