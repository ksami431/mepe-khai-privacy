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
  sugar: number;
  sodium: number;
  potassium: number;
  fiber: number;
  cholesterol: number;
  saturated_fat: number;
  unsaturated_fat: number;
  calcium: number;
  iron: number;
  vitamin_c: number;
  vitamin_a: number;
  vitamin_d: number;
}

export interface MicronutrientLimits {
  sugar_limit: number;
  sodium_limit: number;
  potassium_min: number;
  fiber_min: number;
  cholesterol_limit: number;
  saturated_fat_limit: number;
  unsaturated_fat_min: number;
  calcium_min: number;
  iron_min: number;
  vitamin_c_min: number;
  vitamin_a_min: number;
  vitamin_d_min: number;
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
