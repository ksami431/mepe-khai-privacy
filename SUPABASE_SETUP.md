# Supabase Setup Guide for Mepe Khai

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in with your account
3. Click "New Project"
4. Fill in the details:
   - **Name**: mepe-khai
   - **Database Password**: Create a strong password and **save it securely**
   - **Region**: Choose the closest region to your users (e.g., Singapore for Asia)
   - **Pricing Plan**: Start with Free tier
5. Click "Create new project"
6. Wait 2-3 minutes for your database to provision

## Step 2: Set Up Database Schema

Once your project is ready:

1. Navigate to the **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy and paste the SQL below
4. Click "Run" or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
    daily_calorie_target INTEGER,
    daily_protein_target INTEGER,
    daily_carbs_target INTEGER,
    daily_fats_target INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_logs table
CREATE TABLE food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    meal_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein NUMERIC(6,2) DEFAULT 0,
    carbs NUMERIC(6,2) DEFAULT 0,
    fats NUMERIC(6,2) DEFAULT 0,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    ai_analyzed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight_logs table
CREATE TABLE weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL,
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, logged_at)
);

-- Create indexes for better performance
CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_logged_at ON food_logs(logged_at);
CREATE INDEX idx_weight_logs_user_id ON weight_logs(user_id);
CREATE INDEX idx_weight_logs_logged_at ON weight_logs(logged_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create RLS Policies for food_logs
CREATE POLICY "Users can view their own food logs"
    ON food_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
    ON food_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
    ON food_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
    ON food_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for weight_logs
CREATE POLICY "Users can view their own weight logs"
    ON weight_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs"
    ON weight_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs"
    ON weight_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs"
    ON weight_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Get Your API Keys

1. Navigate to **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long JWT token)
4. Copy both values

## Step 4: Configure Your App

1. Create a `.env.local` file in your project root
2. Add the following (replace with your actual values):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key-here
```

3. **IMPORTANT**: Never commit `.env.local` to git (it's already in .gitignore)

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email templates if desired (optional, can be done later)

## Step 6: Storage Setup (for food images)

1. Go to **Storage** in the left sidebar
2. Click "New bucket"
3. Create a bucket named `food-images`
4. Set it to **Public** (so users can view their uploaded food photos)
5. Set up a policy to allow authenticated users to upload:

```sql
-- In SQL Editor
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Verification

Your Supabase setup is complete when:
- ✅ Tables created: `profiles`, `food_logs`, `weight_logs`
- ✅ RLS policies enabled and configured
- ✅ API keys copied to `.env.local`
- ✅ Email authentication enabled
- ✅ Storage bucket `food-images` created

## Troubleshooting

**Issue**: Tables not showing up
- **Solution**: Make sure you ran the SQL query in the correct project

**Issue**: RLS errors when testing
- **Solution**: Verify policies are created and user is authenticated

**Issue**: Can't upload images
- **Solution**: Check storage policies and bucket is public

## Next Steps

Once Supabase is configured, the app will automatically:
1. Handle user authentication (signup/login)
2. Store user profiles with calculated macros
3. Save food logs with AI analysis
4. Track weight history for dynamic calorie adjustments
