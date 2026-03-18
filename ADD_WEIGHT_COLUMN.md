# Add weight_grams Column to Database

## ⚠️ Database Migration Required

The app now supports tracking food weight in grams, but the database needs to be updated.

## 🔧 Steps to Fix

### Option 1: Run SQL in Supabase Dashboard (Easiest)

1. Go to **https://supabase.com/dashboard**
2. Open your project: **"Mepe Khai - AI Diet Tracker"**
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Paste this SQL:

```sql
ALTER TABLE food_logs 
ADD COLUMN IF NOT EXISTS weight_grams NUMERIC;
```

6. Click **"Run"** (or press Cmd+Enter)
7. You should see: "Success. No rows returned"

### Option 2: Use Migration File

The migration file is already created at:
`supabase/migrations/20260318_add_weight_grams.sql`

If you have Supabase CLI installed:
```bash
supabase db push
```

## ✅ After Running Migration

Once the column is added:
- Restart your Expo app
- Weight tracking will work
- Previous food logs won't have weight (that's OK)
- New logs with weight will display: ⚖️ 200g

## 🧪 Test After Migration

1. Log food with a photo
2. Enter weight (e.g., "200")
3. Tap "Recalculate"
4. Save
5. Check home screen - should show: **⚖️ 200g**

---

**The migration is safe - it only adds a column, doesn't delete or modify existing data.**
