# GitHub Repository Setup for Privacy Policy

Follow these steps to create a GitHub repository and publish your privacy policy.

---

## Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Navigate to: https://github.com/new

2. **Repository Settings:**
   - **Repository name:** `mepe-khai-privacy`
   - **Description:** `Privacy Policy and Terms of Service for Mepe Khai - AI Diet Tracker`
   - **Visibility:** ✅ Public (required for public access)
   - **Initialize this repository with:**
     - ✅ Add a README file
     - Leave .gitignore and license empty

3. **Click "Create repository"**

---

## Step 2: Upload Privacy Policy

### Option A: Via GitHub Web Interface (Easier)

1. **On your new repository page, click:**
   - "Add file" → "Upload files"

2. **Upload the file:**
   - Drag and drop: `PRIVACY_POLICY.md` (from your Mepe Khai project folder)
   - Or click "choose your files" and select it

3. **Commit changes:**
   - Commit message: `Add privacy policy for Mepe Khai app`
   - Click "Commit changes"

### Option B: Via Git Command Line

```bash
# Navigate to your project directory
cd /Users/samikhan/Mepe\ Khai\ -\ AI\ Diet\ Tracker

# Initialize git (if not already)
git init

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add privacy-repo https://github.com/YOUR_USERNAME/mepe-khai-privacy.git

# Add privacy policy file
git add PRIVACY_POLICY.md

# Commit
git commit -m "Add privacy policy for Mepe Khai app"

# Push to GitHub
git push privacy-repo main
```

---

## Step 3: Get Your Privacy Policy URL

After uploading, your privacy policy will be available at:

```
https://github.com/YOUR_USERNAME/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### Example:
If your username is `samikhan123`, the URL would be:
```
https://github.com/samikhan123/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md
```

---

## Step 4: Update App Configuration

Once you have the URL, you need to update:

### 1. Settings Screen Privacy Link

Edit: `app/(tabs)/settings.tsx`

Find line ~250:
```typescript
onPress={() => handleOpenLink('https://mepekhai.com/privacy', 'Privacy Policy')}
```

Replace with:
```typescript
onPress={() => Linking.openURL('https://github.com/YOUR_USERNAME/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md')}
```

**Also add import at top:**
```typescript
import { Linking } from 'react-native';
```

### 2. Play Store Listing

When filling out the Play Store listing, use this URL in the **Privacy Policy** field:
```
https://github.com/YOUR_USERNAME/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md
```

---

## Step 5: Verify Privacy Policy is Accessible

1. **Open the URL in your browser**
2. **Verify you can see the privacy policy**
3. **Make sure the repository is PUBLIC** (check repository settings)

---

## Alternative: Use GitHub Pages (Optional, Prettier URL)

If you want a cleaner URL like `https://YOUR_USERNAME.github.io/mepe-khai-privacy/`:

1. **In repository settings:**
   - Go to "Pages" section
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Click "Save"

2. **Wait 1-2 minutes for deployment**

3. **Your privacy policy will be at:**
   ```
   https://YOUR_USERNAME.github.io/mepe-khai-privacy/
   ```

---

## Troubleshooting

**Problem: Can't see privacy policy**
- Solution: Make sure repository is PUBLIC, not private

**Problem: 404 error**
- Solution: Check file name is exactly `PRIVACY_POLICY.md`

**Problem: URL doesn't work**
- Solution: Verify you replaced YOUR_USERNAME with actual username

---

## Next Steps After GitHub Setup

1. ✅ Get your privacy policy URL
2. ✅ Update settings.tsx with the real URL
3. ✅ Run Supabase migrations (2 files in `/migrations/`)
4. ✅ Build production AAB
5. ✅ Submit to Play Store

---

## Your Privacy Policy URL Template

**Copy and fill this out:**

```
GitHub Username: _______________
Privacy Policy URL: https://github.com/_______________/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md
```

Use this URL in:
- ✅ Play Store listing
- ✅ Settings screen (update code)
- ✅ Any app store submissions

---

**Need help?** Contact: privacy@mepekhai.com
