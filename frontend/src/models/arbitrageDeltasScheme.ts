/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { InstrumentScheme } from "./instrumentScheme";

export interface ArbitrageDeltasScheme {
  d_return?: number;
  d_return_calculated?: number;
  d_take?: number;
  d_take_calculated?: number;
  future?: InstrumentScheme;
  future_figi: string;
  is_active?: boolean;
  multiplier?: number;
  share?: InstrumentScheme;
  share_figi: string;
  spread_required: number;
  volume?: number;
}
