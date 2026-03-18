# Database Migration Required

## Issue
The `favorite_foods` table doesn't exist in your Supabase database yet.

## Solution
You need to run the migration file to create the table.

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of: `supabase/migrations/20260318_create_favorite_foods.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI (if installed)

```bash
npx supabase db push
```

## Migration File Location
`supabase/migrations/20260318_create_favorite_foods.sql`

## What This Creates
- **favorite_foods** table for storing user's frequently eaten meals
- Proper indexes for performance
- Row Level Security policies for data protection

## After Migration
Once the migration runs successfully, the app will automatically work with the new features:
- ⭐ Food Favorites
- 📅 Meal History Calendar  
- 📊 Weekly/Monthly Stats
