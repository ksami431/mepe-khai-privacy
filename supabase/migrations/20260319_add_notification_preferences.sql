-- Add notification preference columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS breakfast_reminder_time TIME DEFAULT '08:00:00',
ADD COLUMN IF NOT EXISTS lunch_reminder_time TIME DEFAULT '12:30:00',
ADD COLUMN IF NOT EXISTS dinner_reminder_time TIME DEFAULT '19:00:00',
ADD COLUMN IF NOT EXISTS snack_reminder_time TIME DEFAULT '15:00:00',
ADD COLUMN IF NOT EXISTS log_reminder_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS daily_summary_enabled BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.notifications_enabled IS 'Master toggle for all notifications';
COMMENT ON COLUMN profiles.breakfast_reminder_time IS 'Time for breakfast meal reminder';
COMMENT ON COLUMN profiles.lunch_reminder_time IS 'Time for lunch meal reminder';
COMMENT ON COLUMN profiles.dinner_reminder_time IS 'Time for dinner meal reminder';
COMMENT ON COLUMN profiles.log_reminder_enabled IS 'Enable reminders to log meals';
COMMENT ON COLUMN profiles.daily_summary_enabled IS 'Enable daily nutrition summary notifications';
