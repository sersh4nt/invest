/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { BacktestCreateIntervalRaw } from './backtestCreateIntervalRaw';
import type { BacktestCreateRobotConfig } from './backtestCreateRobotConfig';

export interface BacktestCreate {
  id?: string;
  robot_id: number;
  figi: string;
  date_from: string;
  date_to: string;
  interval_raw: BacktestCreateIntervalRaw;
  broker_fee?: number;
  initial_capital?: number;
  robot_config: BacktestCreateRobotConfig;
}
