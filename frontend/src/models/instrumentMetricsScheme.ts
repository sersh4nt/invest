/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { InstrumentScheme } from './instrumentScheme';

export interface InstrumentMetricsScheme {
  instrument?: InstrumentScheme;
  volatility: number;
  buy_volume: number;
  sell_volume: number;
  spread: number;
  last_price: number;
  relative_price: number;
  gain: number;
}
