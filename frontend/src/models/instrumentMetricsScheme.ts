/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { InstrumentScheme } from "./instrumentScheme";

export interface InstrumentMetricsScheme {
  buy_volume: number;
  gain: number;
  instrument?: InstrumentScheme;
  last_price: number;
  relative_price: number;
  sell_volume: number;
  spread: number;
  volatility: number;
}
