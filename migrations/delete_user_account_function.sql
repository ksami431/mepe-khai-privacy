-- Migration: Add delete_user_account function
-- Run this in Supabase SQL Editor

-- ============================================
-- Create function to delete user account
-- ============================================
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
BEGIN
  -- Delete all user data from tables (ON DELETE CASCADE should handle most)
  DELETE FROM food_logs WHERE user_id = auth.uid();
  DELETE FROM water_logs WHERE user_id = auth.uid();
  DELETE FROM weight_logs WHERE user_id = auth.uid();
  DELETE FROM activity_logs WHERE user_id = auth.uid();
  DELETE FROM favorite_foods WHERE user_id = auth.uid();
  DELETE FROM planned_meals WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();
  
  -- Delete the auth user (this is the final step)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;

-- ============================================
-- Migration complete!
-- ============================================
