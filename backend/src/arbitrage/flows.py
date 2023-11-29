from bisect import bisect_left
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from typing import Any

import requests
from bs4 import BeautifulSoup
from tinkoff.invest import CandleInterval, Client, HistoricCandle

from src.arbitrage.models import ArbitrageDeltas
from src.common.utils import quotation_to_decimal
from src.config import settings
from src.db.session import get_sync_session


class UpdateArbitrageDeltaFlow:
    CBR_URL = "https://www.cbr.ru/hd_base/KeyRate/"
    cbr_rate: Decimal | None = None

    def _get_cbr_rate(self) -> Decimal:
        if self.cbr_rate is not None:
            return self.cbr_rate

        with requests.session() as session:
            response = session.get(self.CBR_URL)
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table", class_="data")
        last_day = table.findChildren("tr")[1]
        value = last_day.findChildren("td")[-1]
        value = value.text.replace(",", ".")
        value = Decimal(value)
        self.cbr_rate = value
        return value

    @staticmethod
    def _get_min_max_deltas(
        share_candles: list[HistoricCandle],
        future_candles: list[HistoricCandle],
        multiplier: int,
    ) -> tuple[Decimal, Decimal, int]:
        deltas = []

        for candle in future_candles:
            if candle.volume == 0:
                continue

            l, h = quotation_to_decimal(candle.low), quotation_to_decimal(candle.high)
            mid = (l + h) / 2

            s_candle_idx = bisect_left([c.time for c in share_candles], candle.time)
            if s_candle_idx >= len(share_candles):
                continue

            s_candle = share_candles[s_candle_idx]
            s_l, s_h = quotation_to_decimal(s_candle.low), quotation_to_decimal(
                s_candle.high
            )
            s_mid = (s_l + s_h) * multiplier / 2

            deltas.append((mid / s_mid - 1) * 100)

        if len(deltas) == 0:
            return None, None, 0

        return min(deltas), max(deltas), len(deltas)

    def run(self, record_id: int, *args: tuple, **kwargs: dict[str, Any]) -> None:
        session = next(get_sync_session())

        delta = session.get(ArbitrageDeltas, record_id)
        if delta is None:
            raise RuntimeError("unable to fetch delta")

        dt_from = datetime.combine(date.today(), time.min, timezone.utc)
        dt_to = dt_from + timedelta(days=1, minutes=-1)

        with Client(settings.TINKOFF_TOKEN) as client:
            future_candles = client.market_data.get_candles(
                figi=delta.future_figi,
                from_=dt_from,
                to=dt_to,
                interval=CandleInterval.CANDLE_INTERVAL_1_MIN,
            ).candles

            share_candles = client.market_data.get_candles(
                figi=delta.share_figi,
                from_=dt_from,
                to=dt_to,
                interval=CandleInterval.CANDLE_INTERVAL_1_MIN,
            ).candles

        mn, mx, volume = self._get_min_max_deltas(
            share_candles, future_candles, delta.future.basic_asset_size
        )

        now = datetime.now(timezone.utc)
        expiration = (
            Decimal((delta.future.expiration_date - now).total_seconds()) / 86400
        )
        cbr_rate = self._get_cbr_rate()

        delta.volume = volume
        delta.d_take_calculated = (
            expiration * (cbr_rate / 365 + Decimal("0.01"))
            + Decimal(delta.spread_required) / 2
        )
        delta.d_return_calculated = (
            expiration * (cbr_rate / 365 - Decimal("0.01"))
            - Decimal(delta.spread_required) / 2
        )

        if volume > 0:
            delta.d_take = (delta.d_take_calculated + 9 * mx) / 10
            delta.d_return = (delta.d_return_calculated + 9 * mn) / 10
        else:
            delta.d_take = delta.d_take_calculated
            delta.d_return = delta.d_return_calculated

        session.add(delta)
        session.commit()
        session.close()
