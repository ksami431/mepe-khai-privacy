# 🔧 Quick Installation Commands

## Step 1: Install Required Packages

Copy and paste these commands in your terminal:

```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"

npm install expo-barcode-scanner expo-sharing @react-native-async-storage/async-storage
```

---

## Step 2: Run Database Migrations

### Open Supabase Dashboard
https://supabase.com/dashboard

### Run Migration 1 - Favorite Foods
1. SQL Editor → New Query
2. Copy all content from: `supabase/migrations/20260318_create_favorite_foods.sql`
3. Paste and Run

### Run Migration 2 - Planned Meals  
1. SQL Editor → New Query
2. Copy all content from: `supabase/migrations/20260318_create_planned_meals.sql`
3. Paste and Run

---

## Step 3: Restart App

In Expo Go:
- Shake your device
- Tap "Reload"

Or in terminal:
- Press `r` to reload

---

## ✅ Verification

After installation, test each feature:

1. **Barcode Scanner**: Log Food → Scan Barcode → Scan a product
2. **Recipe Analysis**: Log Food → Analyze Recipe → Paste a recipe
3. **Meal Planner**: Home → Plan Meals → Add meals for tomorrow
4. **Data Export**: Progress → 📥 → Export CSV or HTML
5. **Dark Mode**: Settings → Toggle Dark Mode switch

---

## 🚨 Troubleshooting

**Packages won't install?**
- Make sure you're in the project directory
- Try: `npx expo install` instead of `npm install`

**Barcode scanner not working?**
- Check camera permissions in device settings
- Restart Expo Go after installing

**Favorites/Planning not loading?**
- Verify both migrations ran successfully in Supabase
- Check Supabase project is connected (.env.local has correct URLs)

**Dark mode not applying?**
- Restart the app completely
- Check Settings → Appearance section exists

---

## 📱 All Features Ready!

Once packages are installed and migrations are run, all 5 new features will work seamlessly:

✅ Barcode Scanner  
✅ Recipe Analysis  
✅ Meal Planning  
✅ Data Export  
✅ Dark Mode  

**Sami Khan Fitness** branding integrated throughout! 🎉
