# Create Supabase Storage Bucket - Step by Step

## 🎯 Quick Steps to Fix Storage Error

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Sign in with your account (ksami933@gmail.com)

### Step 2: Select Your Project
- Click on your project: **"Mepe Khai - AI Diet Tracker"**

### Step 3: Create Storage Bucket
1. In the **left sidebar**, click **"Storage"**
2. Click the **"New bucket"** button (top right)
3. Fill in:
   - **Name**: `food-images` (exactly this, no spaces)
   - **Public bucket**: Toggle **ON** ✅ (make it public)
   - **File size limit**: 5 MB (default is fine)
4. Click **"Create bucket"**

### Step 4: Set Access Policies

After creating the bucket, you need to allow users to upload and view images:

1. Click on the `food-images` bucket you just created
2. Go to **"Policies"** tab
3. Click **"New policy"** button

**Policy 1: Allow uploads**
- Click **"For full customization"**
- Name: `Users can upload images`
- Policy command: **INSERT**
- Target roles: **authenticated**
- USING expression: Leave empty
- WITH CHECK expression:
```sql
bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]
```
- Click **Save**

**Policy 2: Allow public viewing**
- Click **"New policy"** again
- Click **"For full customization"**
- Name: `Public read access`
- Policy command: **SELECT**
- Target roles: **public**
- USING expression:
```sql
bucket_id = 'food-images'
```
- WITH CHECK expression: Leave empty
- Click **Save**

### Step 5: Verify Bucket Created
You should see:
- ✅ Bucket name: `food-images`
- ✅ Public access: Yes
- ✅ Two policies created

### Step 6: Test in App
1. Go back to your iPhone app
2. Navigate to "Log Food" tab
3. Take a photo of food
4. Analyze it
5. **No more storage error!** ✅

---

## ⚡ Alternative: Quick Policy Setup

If the above is too complex, use these simpler policies:

1. In the `food-images` bucket → Policies tab
2. Click **"Add policy using template"**
3. Choose **"Enable insert for authenticated users"** → Click **Use this template** → Save
4. Click **"Add policy using template"** again
5. Choose **"Enable read access for all users"** → Click **Use this template** → Save

Done! This gives basic access that's good enough for now.

---

## 🔍 Troubleshooting

**Can't find Storage in sidebar?**
- Make sure you're in the correct project
- Storage should be between "Database" and "Edge Functions"

**Policy creation failing?**
- Make sure the bucket name is exactly `food-images`
- Try the "template" method instead of custom SQL

**Still getting errors after creating bucket?**
- Wait 1-2 minutes for changes to propagate
- Reload your app on iPhone
- Check bucket name spelling

---

## ✅ After Setup

Once the bucket is created:
- Food images will be stored permanently
- You can view them in Supabase Storage dashboard
- Each user's images are in their own folder (by user ID)
- No more storage errors in console! 🎉
