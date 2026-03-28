import { Database } from './database.types';

export type WaterLog = Database['public']['Tables']['water_logs']['Row'];
export type WaterLogInsert = Database['public']['Tables']['water_logs']['Insert'];
export type WaterLogUpdate = Database['public']['Tables']['water_logs']['Update'];

export interface WaterTarget {
  daily_goal_ml: number;
  consumed_ml: number;
  remaining_ml: number;
  progress_percentage: number;
  glasses_consumed: number; // 250ml = 1 glass
  glasses_remaining: number;
}

export interface WaterStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  average7Days: number;
}
