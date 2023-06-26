/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { OperationTradeScheme } from './operationTradeScheme';
import type { InstrumentScheme } from './instrumentScheme';

export interface OperationScheme {
  broker_id: string;
  currency: string;
  payment: number;
  price: number;
  type: string;
  state: string;
  quantity: number;
  commission?: number;
  date: string;
  trades: OperationTradeScheme[];
  instrument?: InstrumentScheme;
}