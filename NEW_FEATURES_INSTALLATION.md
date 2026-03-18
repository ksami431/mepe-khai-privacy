# 🚀 New Features Installation Guide

## 📦 Required Packages

Run these commands in your terminal:

```bash
npm install expo-barcode-scanner
npm install expo-sharing
npm install @react-native-async-storage/async-storage
```

Or if using Expo CLI:

```bash
npx expo install expo-barcode-scanner expo-sharing @react-native-async-storage/async-storage
```

---

## 🗄️ Database Migrations Required

You need to run **TWO** migrations in your Supabase Dashboard:

### Migration 1: Favorite Foods (if not already done)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy contents from: `supabase/migrations/20260318_create_favorite_foods.sql`
5. Paste and click **Run**

### Migration 2: Planned Meals (NEW)

1. In **SQL Editor** → **New Query**
2. Copy contents from: `supabase/migrations/20260318_create_planned_meals.sql`
3. Paste and click **Run**

---

## ✅ What's New

### 1. 📱 Barcode Scanner
**Location:** Log Food → "Scan Barcode" button

**How to use:**
- Tap "Scan Barcode"
- Point camera at product barcode
- Product info loads from OpenFoodFacts (free database)
- Enter serving size in grams
- Save to log

**No API key needed** - OpenFoodFacts is completely free!

---

### 2. 📋 Recipe Analysis
**Location:** Log Food → "Analyze Recipe" button

**How to use:**
- Tap "Analyze Recipe"
- Paste full recipe (ingredients + instructions)
- AI calculates total nutrition and per-serving
- Select number of servings to log
- Save to log

**Example Recipe Format:**
```
Ingredients:
- 2 chicken breasts
- 1 cup rice
- 2 tbsp olive oil

Instructions:
1. Cook rice
2. Grill chicken
3. Serve together
```

---

### 3. 📅 Meal Planning (7-Day)
**Location:** Home → Quick Actions → "📅 Plan Meals"

**How to use:**
- View next 7 days (today through 6 days ahead)
- Each day has 4 meal slots: Breakfast, Lunch, Dinner, Snack
- Tap "+ Add" to add meals from favorites
- Enter favorite number or custom meal name
- See daily calorie totals
- Delete planned meals with trash icon

**Features:**
- Plan meals in advance
- Add from favorites (quick selection)
- See planned nutrition per day
- Simple list view

---

### 4. 💾 Data Export
**Location:** Progress Tab → 📥 Export button (top right)

**Export Options:**
- **CSV Export** - Spreadsheet format with:
  - All food logs (date, meal type, name, nutrition)
  - Weight logs
  - Weekly/Monthly statistics
  
- **HTML Report** - Formatted report with:
  - Sami Khan Fitness branding
  - Statistics summary cards
  - Food logs table
  - Weight logs table
  - Professional layout

**How to use:**
- Go to Progress tab
- Tap 📥 icon in top right
- Choose CSV or HTML Report
- File will be saved and shared via system share sheet

---

### 5. 🌙 Dark Mode
**Location:** Settings → Appearance → Dark Mode toggle

**How to use:**
- Go to Settings tab
- Toggle "🌙 Dark Mode" switch
- Theme changes instantly
- Preference saved automatically

**Features:**
- System-wide dark theme
- Smooth transitions
- Persisted preference
- All screens updated

---

## 🔍 Features Summary

| Feature | Status | Access Point |
|---------|--------|-------------|
| Barcode Scanner | ✅ Ready | Log Food screen |
| Recipe Analysis | ✅ Ready | Log Food screen |
| Meal Planning | ✅ Ready | Home → Plan Meals |
| Data Export | ✅ Ready | Progress screen |
| Dark Mode | ✅ Ready | Settings screen |

---

## 📱 Testing Checklist

After installing packages and running migrations:

### Barcode Scanner:
- [ ] Scan a packaged food product
- [ ] Verify product info loads correctly
- [ ] Adjust serving size and recalculate
- [ ] Save scanned food to log

### Recipe Analysis:
- [ ] Paste a recipe with ingredients
- [ ] Verify AI calculates nutrition
- [ ] Adjust serving count
- [ ] Save recipe meal to log

### Meal Planning:
- [ ] Open Plan Meals from home
- [ ] Add meal from favorites to tomorrow
- [ ] View 7-day plan with totals
- [ ] Delete a planned meal

### Data Export:
- [ ] Export as CSV from Progress
- [ ] Verify CSV contains all data
- [ ] Export as HTML Report
- [ ] Check Sami Khan Fitness branding

### Dark Mode:
- [ ] Toggle dark mode in Settings
- [ ] Navigate all screens in dark mode
- [ ] Toggle back to light mode
- [ ] Verify preference persists after restart

---

## ⚠️ Important Notes

### OpenFoodFacts API
- **No API key required** - completely free
- Database has 2M+ products worldwide
- Returns nutrition per 100g
- Works offline after initial scan

### Package Installations
All new packages are Expo-compatible and well-maintained:
- `expo-barcode-scanner` - Official Expo package for camera scanning
- `expo-sharing` - Share files via system share sheet
- `@react-native-async-storage/async-storage` - Persistent storage for theme preference

### Migrations
Both migrations include:
- Proper indexes for performance
- Row Level Security policies
- Cascading deletes on user deletion
- Timestamp tracking

---

## 🎯 Brand Integration

**Sami Khan Fitness** branding now appears in:
- ✅ Welcome screen - Logo + "Powered by" footer
- ✅ Home screen - Subtle footer
- ✅ Settings - Developer name and brand
- ✅ Export reports - Header branding
- ✅ OpenFoodFacts User-Agent header

**No "Gemini" mentions** in user-facing UI - all references removed!

---

## 🚦 Next Steps

1. **Install packages** (run npm commands above)
2. **Run migrations** (both SQL files in Supabase)
3. **Restart Expo Go** (shake device → reload)
4. **Test each feature** (use checklist above)

All features are fully implemented and ready to use! 🎉

---

**Questions or Issues?**
- Barcode not scanning? Check camera permissions in device settings
- Product not found? Try manual entry or different barcode
- Recipe analysis unclear? Ensure format includes ingredients list
- Dark mode not applying? Check if ThemeProvider is wrapping app

**Powered by Sami Khan Fitness • Measure, Track, Transform**
