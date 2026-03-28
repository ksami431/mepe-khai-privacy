-- Migration: Add Micronutrient Tracking and Water Intake
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Add micronutrient columns to food_logs
-- ============================================
ALTER TABLE food_logs
ADD COLUMN IF NOT EXISTS sugar_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS potassium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cholesterol_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS saturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS unsaturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS calcium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS iron_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_c_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_a_mcg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_d_mcg DECIMAL(10,2) DEFAULT 0;

-- ============================================
-- 2. Create water_logs table
-- ============================================
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, logged_at);

-- Enable Row Level Security
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for water_logs
DROP POLICY IF EXISTS "Users can view own water logs" ON water_logs;
CREATE POLICY "Users can view own water logs" 
  ON water_logs FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own water logs" ON water_logs;
CREATE POLICY "Users can insert own water logs" 
  ON water_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own water logs" ON water_logs;
CREATE POLICY "Users can delete own water logs" 
  ON water_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 3. Add micronutrient targets to profiles
-- ============================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS daily_sugar_limit_g INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS daily_sodium_limit_mg INTEGER DEFAULT 2300,
ADD COLUMN IF NOT EXISTS daily_potassium_min_mg INTEGER DEFAULT 3400,
ADD COLUMN IF NOT EXISTS daily_fiber_min_g INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS daily_cholesterol_limit_mg INTEGER DEFAULT 300,
ADD COLUMN IF NOT EXISTS daily_saturated_fat_limit_g INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS daily_unsaturated_fat_min_g INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS daily_calcium_min_mg INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS daily_iron_min_mg INTEGER DEFAULT 18,
ADD COLUMN IF NOT EXISTS daily_vitamin_c_min_mg INTEGER DEFAULT 90,
ADD COLUMN IF NOT EXISTS daily_vitamin_a_min_mcg INTEGER DEFAULT 900,
ADD COLUMN IF NOT EXISTS daily_vitamin_d_min_mcg INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS daily_water_goal_ml INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS water_reminder_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS water_reminder_interval_hours INTEGER DEFAULT 2;

-- ============================================
-- 4. Add micronutrient columns to favorite_foods
-- ============================================
ALTER TABLE favorite_foods
ADD COLUMN IF NOT EXISTS sugar_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS potassium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cholesterol_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS saturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS unsaturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS calcium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS iron_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_c_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_a_mcg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_d_mcg DECIMAL(10,2) DEFAULT 0;

-- ============================================
-- 5. Add micronutrient columns to planned_meals
-- ============================================
ALTER TABLE planned_meals
ADD COLUMN IF NOT EXISTS sugar_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS potassium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cholesterol_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS saturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS unsaturated_fat_g DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS calcium_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS iron_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_c_mg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_a_mcg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vitamin_d_mcg DECIMAL(10,2) DEFAULT 0;

-- ============================================
-- Migration complete!
-- ============================================
