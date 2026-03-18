-- Create favorite_foods table for saving frequently eaten foods
CREATE TABLE IF NOT EXISTS favorite_foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fats NUMERIC DEFAULT 0,
  meal_type TEXT,
  weight_grams NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_id ON favorite_foods(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_foods_last_used ON favorite_foods(user_id, last_used_at DESC);

-- Enable Row Level Security
ALTER TABLE favorite_foods ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own favorites
CREATE POLICY "Users can view own favorite foods"
  ON favorite_foods FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorite foods"
  ON favorite_foods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own favorites
CREATE POLICY "Users can update own favorite foods"
  ON favorite_foods FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorite foods"
  ON favorite_foods FOR DELETE
  USING (auth.uid() = user_id);
