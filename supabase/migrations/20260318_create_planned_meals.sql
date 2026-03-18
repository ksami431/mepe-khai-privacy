-- Create planned_meals table for meal planning feature
CREATE TABLE IF NOT EXISTS planned_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  planned_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fats NUMERIC DEFAULT 0,
  weight_grams NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date_meal_type UNIQUE (user_id, planned_date, meal_type, meal_name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_planned_meals_user_id ON planned_meals(user_id);
CREATE INDEX IF NOT EXISTS idx_planned_meals_date ON planned_meals(user_id, planned_date);

-- Enable Row Level Security
ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own planned meals
CREATE POLICY "Users can view own planned meals"
  ON planned_meals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own planned meals
CREATE POLICY "Users can insert own planned meals"
  ON planned_meals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own planned meals
CREATE POLICY "Users can update own planned meals"
  ON planned_meals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own planned meals
CREATE POLICY "Users can delete own planned meals"
  ON planned_meals
  FOR DELETE
  USING (auth.uid() = user_id);
