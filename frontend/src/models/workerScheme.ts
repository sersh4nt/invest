/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import type { RobotScheme } from './robotScheme';

export interface WorkerScheme {
  subaccount_id: number;
  config?: unknown;
  id: number;
  robot: RobotScheme;
  container_name: string;
  status?: string;
}