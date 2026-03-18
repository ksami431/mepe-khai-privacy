-- Add weight_grams column to food_logs table
ALTER TABLE food_logs 
ADD COLUMN IF NOT EXISTS weight_grams NUMERIC;

-- Add comment to document the column
COMMENT ON COLUMN food_logs.weight_grams IS 'Weight of the food in grams (optional, for more accurate tracking)';
