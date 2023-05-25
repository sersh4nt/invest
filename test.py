import asyncio
import json
from datetime import datetime, timedelta

import grpc
from tinkoff.invest import AsyncClient, CandleInterval
from tinkoff.invest.async_services import AsyncServices

TOKEN = "t.CL1FslEmCj6lx17aME9M0QUKg62FQw6PcDJsNIcGMSmeFqa6yrvzwfFvPkKjiJdKa_M2bHEVNBNamKDgLn5XpA"
TARGET = "localhost:8080"


class BrokerClient:
    def __init__(self):
        self.client: AsyncServices | None = None

    async def ainit(self):
        client = AsyncClient(token=TOKEN, target=TARGET)
        client._channel = grpc.aio.insecure_channel(TARGET)
        self.client = await client.__aenter__()

    async def configure_broker(
        self, from_: datetime, to: datetime, interval: CandleInterval
    ):
        data = {
            "from": from_.isoformat(),
            "to": to.isoformat(),
            "candleInterval": interval,
        }
        await self.client.orders.post_order(
            account_id="config",
            figi=json.dumps(data),
            quantity=0,
            direction=0,
            order_type=0,
            order_id="",
        )

    async def tick(self) -> bool:
        response = await self.client.orders.post_order(
            account_id="tick",
            figi="",
            quantity=0,
            direction=0,
            order_type=0,
            order_id="",
        )
        if response.message:
            return True
        return False


client = BrokerClient()


async def init():
    await client.ainit()
    to = datetime.utcnow() - timedelta(days=1)
    from_ = to - timedelta(days=1)
    await client.configure_broker(from_, to, CandleInterval.CANDLE_INTERVAL_5_MIN)
    await main()


async def main():
    while await client.tick():
        print("tick")
    return


if __name__ == "__main__":
    asyncio.run(init())
