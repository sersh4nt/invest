/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { InstrumentScheme } from "./instrumentScheme";

export interface ActiveOrderScheme {
  broker_id: string;
  date: string;
  direction: string;
  instrument: InstrumentScheme;
  lots_executed: number;
  lots_requested: number;
  price: number;
  type: string;
}
