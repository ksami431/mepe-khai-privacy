# Fix Storage Bucket Error

## ❌ Current Error
```
ERROR: [StorageApiError: Bucket not found]
```

The app is trying to upload food images to Supabase Storage, but the bucket doesn't exist.

## ✅ Solution: Create Storage Bucket

### Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Sign in with your account

2. **Navigate to Storage**
   - Click on your project: "Mepe Khai - AI Diet Tracker"
   - In the left sidebar, click **"Storage"**

3. **Create New Bucket**
   - Click **"New bucket"** button
   - **Bucket name**: `food-images`
   - **Public bucket**: Toggle ON (✅)
   - **File size limit**: Leave default or set to 5MB
   - Click **"Create bucket"**

4. **Set Policies (Important!)**
   After creating the bucket, you need to set policies:
   
   - Click on the `food-images` bucket
   - Go to **"Policies"** tab
   - Click **"New policy"**
   
   **Insert Policy:**
   ```sql
   CREATE POLICY "Users can upload their own images"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```
   
   **Select Policy:**
   ```sql
   CREATE POLICY "Images are publicly accessible"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'food-images');
   ```

5. **Test**
   - Go back to your app
   - Try logging food with a photo
   - Storage error should be gone!

## 📝 Alternative: Skip Storage (Already Implemented)

If you don't want to store images, the app already handles this gracefully:
- Images won't be saved
- Food analysis still works with Gemini 2.5 Flash
- Nutrition data still saves to database
- You'll just see a warning in console (can be ignored)

## Current Status

✅ **Food logging works** - even without storage bucket
✅ **Gemini 2.5 Flash** - analyzing food images
⚠️ **Storage error** - caught and handled, but shows in console
❌ **Images not saved** - until bucket is created

Once you create the bucket, images will be saved and the error will disappear!
