# Quick Start Guide - Mepe Khai Setup

## ⚡ Fast Track to Get Running

### Step 1: Install Node.js (Required)

**Choose the fastest method for you:**

**Option A - Homebrew (Recommended for Mac):**
```bash
brew install node
```

**Option B - Official Installer:**
Download from https://nodejs.org/ and install

**Verify:**
```bash
node --version  # Should show v18 or higher
npm --version   # Should show 9 or higher
```

---

### Step 2: Install Project Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`. It may take 2-3 minutes.

---

### Step 3: Set Up Supabase (5 minutes)

1. Go to https://supabase.com and create an account
2. Click "New Project" → Name it "mepe-khai"
3. Choose a password and region
4. Wait ~2 minutes for provisioning
5. Go to **SQL Editor** → Run the SQL from `SUPABASE_SETUP.md`
6. Go to **Settings** → **API** → Copy:
   - Project URL
   - anon/public key

---

### Step 4: Set Up Gemini API (2 minutes)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key immediately

---

### Step 5: Create Environment File

```bash
# Create .env.local
cp .env.example .env.local
```

Edit `.env.local` and paste your keys:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyD...
```

---

### Step 6: Start the App

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go app on your phone

---

## ✅ Success Checklist

Before starting development, verify:

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Supabase project created
- [ ] Database tables created (3 tables: profiles, food_logs, weight_logs)
- [ ] Gemini API key obtained
- [ ] `.env.local` file created with all 3 keys
- [ ] Expo starts without errors

---

## 🚨 Common Issues

### "npx: command not found"
**Fix:** Node.js not installed. Go to Step 1.

### "Cannot find module '@supabase/supabase-js'"
**Fix:** Run `npm install`

### "API key not valid"
**Fix:** Check your `.env.local` file has correct keys

### Expo won't start
**Fix:** Run `npx expo start -c` to clear cache

---

## 📱 What to Build Next

Once the app runs successfully, the next phase is:

1. **Authentication Screens** (login, signup)
2. **Onboarding Flow** (collect user data for macro calculation)
3. **Dashboard** (show daily progress)
4. **AI Food Logging** (camera + text input)

Check the main `README.md` for full documentation.

---

## 🎯 Expected Timeline

- **Setup (Steps 1-6)**: 15-20 minutes
- **Troubleshooting**: 5-10 minutes
- **Total**: ~30 minutes to first run

---

## 💡 Pro Tips

1. **Use Expo Go app** on your phone for fastest testing
2. **Keep Expo DevTools open** for logs and debugging
3. **Check Supabase Dashboard** to verify data is saving
4. **Monitor Gemini API usage** in Google Cloud Console
5. **Start with iOS Simulator** if on Mac (faster than Android)

---

## 📞 Need Help?

- Supabase issues → See `SUPABASE_SETUP.md`
- Gemini API issues → See `GEMINI_API_SETUP.md`
- Node.js issues → See `SETUP_INSTRUCTIONS.md`
- General setup → See `README.md`

---

**Let's build something amazing! 🚀**
