export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          age: number | null
          gender: 'male' | 'female' | 'other' | null
          height_cm: number | null
          weight_kg: number | null
          goal_weight_kg: number | null
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
          goal: 'lose' | 'maintain' | 'gain' | null
          daily_calorie_target: number | null
          daily_protein_target: number | null
          daily_carbs_target: number | null
          daily_fats_target: number | null
          daily_sugar_limit_g: number | null
          daily_sodium_limit_mg: number | null
          daily_potassium_min_mg: number | null
          daily_fiber_min_g: number | null
          daily_cholesterol_limit_mg: number | null
          daily_saturated_fat_limit_g: number | null
          daily_unsaturated_fat_min_g: number | null
          daily_calcium_min_mg: number | null
          daily_iron_min_mg: number | null
          daily_vitamin_c_min_mg: number | null
          daily_vitamin_a_min_mcg: number | null
          daily_vitamin_d_min_mcg: number | null
          daily_water_goal_ml: number | null
          water_reminder_enabled: boolean
          water_reminder_interval_hours: number | null
          notifications_enabled: boolean
          breakfast_reminder_time: string | null
          lunch_reminder_time: string | null
          dinner_reminder_time: string | null
          snack_reminder_time: string | null
          log_reminder_enabled: boolean
          daily_summary_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          height_cm?: number | null
          weight_kg?: number | null
          goal_weight_kg?: number | null
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
          goal?: 'lose' | 'maintain' | 'gain' | null
          daily_calorie_target?: number | null
          daily_protein_target?: number | null
          daily_carbs_target?: number | null
          daily_fats_target?: number | null
          daily_sugar_limit_g?: number | null
          daily_sodium_limit_mg?: number | null
          daily_potassium_min_mg?: number | null
          daily_fiber_min_g?: number | null
          daily_cholesterol_limit_mg?: number | null
          daily_saturated_fat_limit_g?: number | null
          daily_unsaturated_fat_min_g?: number | null
          daily_calcium_min_mg?: number | null
          daily_iron_min_mg?: number | null
          daily_vitamin_c_min_mg?: number | null
          daily_vitamin_a_min_mcg?: number | null
          daily_vitamin_d_min_mcg?: number | null
          daily_water_goal_ml?: number | null
          water_reminder_enabled?: boolean
          water_reminder_interval_hours?: number | null
          notifications_enabled?: boolean
          breakfast_reminder_time?: string | null
          lunch_reminder_time?: string | null
          dinner_reminder_time?: string | null
          snack_reminder_time?: string | null
          log_reminder_enabled?: boolean
          daily_summary_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          height_cm?: number | null
          weight_kg?: number | null
          goal_weight_kg?: number | null
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
          goal?: 'lose' | 'maintain' | 'gain' | null
          daily_calorie_target?: number | null
          daily_protein_target?: number | null
          daily_carbs_target?: number | null
          daily_fats_target?: number | null
          daily_sugar_limit_g?: number | null
          daily_sodium_limit_mg?: number | null
          daily_potassium_min_mg?: number | null
          daily_fiber_min_g?: number | null
          daily_cholesterol_limit_mg?: number | null
          daily_saturated_fat_limit_g?: number | null
          daily_unsaturated_fat_min_g?: number | null
          daily_calcium_min_mg?: number | null
          daily_iron_min_mg?: number | null
          daily_vitamin_c_min_mg?: number | null
          daily_vitamin_a_min_mcg?: number | null
          daily_vitamin_d_min_mcg?: number | null
          daily_water_goal_ml?: number | null
          water_reminder_enabled?: boolean
          water_reminder_interval_hours?: number | null
          notifications_enabled?: boolean
          breakfast_reminder_time?: string | null
          lunch_reminder_time?: string | null
          dinner_reminder_time?: string | null
          snack_reminder_time?: string | null
          log_reminder_enabled?: boolean
          daily_summary_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          meal_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          sugar_g: number | null
          sodium_mg: number | null
          potassium_mg: number | null
          fiber_g: number | null
          cholesterol_mg: number | null
          saturated_fat_g: number | null
          unsaturated_fat_g: number | null
          calcium_mg: number | null
          iron_mg: number | null
          vitamin_c_mg: number | null
          vitamin_a_mcg: number | null
          vitamin_d_mcg: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          logged_at: string
          image_url: string | null
          ai_analyzed: boolean
          weight_grams: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_name: string
          calories: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          logged_at?: string
          image_url?: string | null
          ai_analyzed?: boolean
          weight_grams?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          logged_at?: string
          image_url?: string | null
          ai_analyzed?: boolean
          weight_grams?: number | null
          created_at?: string
        }
      }
      weight_logs: {
        Row: {
          id: string
          user_id: string
          weight_kg: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight_kg: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight_kg?: number
          logged_at?: string
          created_at?: string
        }
      }
      favorite_foods: {
        Row: {
          id: string
          user_id: string
          meal_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          sugar_g: number | null
          sodium_mg: number | null
          potassium_mg: number | null
          fiber_g: number | null
          cholesterol_mg: number | null
          saturated_fat_g: number | null
          unsaturated_fat_g: number | null
          calcium_mg: number | null
          iron_mg: number | null
          vitamin_c_mg: number | null
          vitamin_a_mcg: number | null
          vitamin_d_mcg: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          weight_grams: number | null
          created_at: string
          last_used_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_name: string
          calories: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          weight_grams?: number | null
          created_at?: string
          last_used_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          weight_grams?: number | null
          created_at?: string
          last_used_at?: string
        }
      }
      planned_meals: {
        Row: {
          id: string
          user_id: string
          planned_date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          sugar_g: number | null
          sodium_mg: number | null
          potassium_mg: number | null
          fiber_g: number | null
          cholesterol_mg: number | null
          saturated_fat_g: number | null
          unsaturated_fat_g: number | null
          calcium_mg: number | null
          iron_mg: number | null
          vitamin_c_mg: number | null
          vitamin_a_mcg: number | null
          vitamin_d_mcg: number | null
          weight_grams: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          planned_date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_name: string
          calories: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          weight_grams?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          planned_date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          sugar_g?: number | null
          sodium_mg?: number | null
          potassium_mg?: number | null
          fiber_g?: number | null
          cholesterol_mg?: number | null
          saturated_fat_g?: number | null
          unsaturated_fat_g?: number | null
          calcium_mg?: number | null
          iron_mg?: number | null
          vitamin_c_mg?: number | null
          vitamin_a_mcg?: number | null
          vitamin_d_mcg?: number | null
          weight_grams?: number | null
          created_at?: string
        }
      }
      water_logs: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          logged_at?: string
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          logged_date: string
          step_count: number
          exercise_type: string | null
          duration_minutes: number | null
          calories_burned: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          logged_date: string
          step_count?: number
          exercise_type?: string | null
          duration_minutes?: number | null
          calories_burned?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          logged_date?: string
          step_count?: number
          exercise_type?: string | null
          duration_minutes?: number | null
          calories_burned?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
