-- Add goal_weight_kg column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS goal_weight_kg NUMERIC;

-- Add comment for documentation
COMMENT ON COLUMN profiles.goal_weight_kg IS 'User target weight in kilograms for weight tracking goals';
