import { Database } from './database.types';

export type FoodLog = Database['public']['Tables']['food_logs']['Row'];
export type FoodLogInsert = Database['public']['Tables']['food_logs']['Insert'];
export type FoodLogUpdate = Database['public']['Tables']['food_logs']['Update'];

export type WeightLog = Database['public']['Tables']['weight_logs']['Row'];
export type WeightLogInsert = Database['public']['Tables']['weight_logs']['Insert'];
export type WeightLogUpdate = Database['public']['Tables']['weight_logs']['Update'];

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionProgress {
  calories: {
    consumed: number;
    target: number;
    remaining: number;
    percentage: number;
  };
  protein: {
    consumed: number;
    target: number;
    remaining: number;
    percentage: number;
  };
  carbs: {
    consumed: number;
    target: number;
    remaining: number;
    percentage: number;
  };
  fats: {
    consumed: number;
    target: number;
    remaining: number;
    percentage: number;
  };
}
