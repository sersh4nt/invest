/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { InstrumentScheme } from './instrumentScheme';

export interface ActiveOrderScheme {
  broker_id: string;
  lots_requested: number;
  lots_executed: number;
  instrument: InstrumentScheme;
  direction: string;
  price: number;
  type: string;
  date: string;
}
