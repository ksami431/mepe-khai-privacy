# Play Store Submission Guide - Mepe Khai

Complete checklist and instructions for submitting Mepe Khai to Google Play Store.

---

## ✅ What's Already Complete

### Code Changes
- ✅ **Barcode scanner removed** (3 files deleted, log-food.tsx cleaned)
- ✅ **Delete account feature added** (Settings → Danger Zone)
- ✅ **Privacy policy updated** (removed OpenFoodFacts, added delete info)
- ✅ **Production AAB build started** (check EAS dashboard)

### Files Modified/Created
1. Deleted: `BarcodeScanner.tsx`, `openfoodfacts.ts`, `openfoodfacts.types.ts`
2. Modified: `log-food.tsx`, `settings.tsx`, `useAuth.ts`, `app.json`, `PRIVACY_POLICY.md`
3. Created: `delete_user_account_function.sql`, `GITHUB_SETUP_INSTRUCTIONS.md`

---

## 🔴 CRITICAL: Must Complete Before Submission

### 1. Run Supabase Migrations (REQUIRED)

**You have 2 SQL migrations to run:**

#### Migration 1: Micronutrients & Water Tracking
**File:** `/migrations/add_micronutrients_and_water.sql`

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **SQL Editor**
4. Click: **New Query**
5. Copy entire contents of `add_micronutrients_and_water.sql`
6. Paste and click **Run**

#### Migration 2: Delete Account Function
**File:** `/migrations/delete_user_account_function.sql`

1. In Supabase SQL Editor
2. Click: **New Query**
3. Copy entire contents of `delete_user_account_function.sql`
4. Paste and click **Run**

**⚠️ Without these migrations:**
- Micronutrients won't display
- Water tracking won't work
- Delete account will fail

---

### 2. Create GitHub Repository for Privacy Policy

**Follow instructions in:** `GITHUB_SETUP_INSTRUCTIONS.md`

**Quick steps:**
1. Go to https://github.com/new
2. Name: `mepe-khai-privacy`
3. Public repository
4. Upload `PRIVACY_POLICY.md`
5. Get URL: `https://github.com/YOUR_USERNAME/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md`

**After getting URL:**
- Update settings.tsx line ~250 with real URL
- Use URL in Play Store listing

---

### 3. Download Production AAB

**Check build status:**
```bash
eas build:list
```

**Or visit:** https://expo.dev/accounts/skhan7787/projects/mepe-khai/builds

**When build completes:**
1. Download the `.aab` file
2. Save to a safe location
3. This is what you'll upload to Play Store

**Build time:** ~15-20 minutes

---

## 📱 Play Store Submission Steps

### Step 1: Go to Play Console

**URL:** https://play.google.com/console/

**First time setup:**
1. Pay $25 one-time registration fee (if not done)
2. Complete developer account profile
3. Accept developer agreement

---

### Step 2: Create New App

1. Click **Create app**
2. Fill in details:

**App details:**
- **App name:** Mepe Khai
- **Default language:** English (United States)
- **App or game:** App
- **Free or paid:** Free

**Declarations:**
- ✅ I confirm this is a health app
- ✅ Privacy policy provided
- ✅ Content guidelines followed

3. Click **Create app**

---

### Step 3: Complete Store Listing

#### App Details
- **App name:** Mepe Khai
- **Short description (80 chars):**
  ```
  AI-powered nutrition tracker with photo analysis and micronutrient tracking
  ```

- **Full description (4000 chars):**
  ```
  Mepe Khai - Measure, Track, Transform

  AI-POWERED FOOD TRACKING
  • Snap photos of your meals for instant nutrition analysis
  • Google Gemini AI estimates calories, protein, carbs, and fats
  • Track 12 micronutrients: sugar, sodium, fiber, vitamins & more

  COMPREHENSIVE NUTRITION TRACKING
  • Personalized daily calorie and macro targets
  • Micronutrient monitoring with color-coded limits
  • Water intake tracking with 8x daily reminders
  • Progress tracking with weight logs and charts

  SMART FEATURES
  • AI meal photo analysis
  • Manual food entry
  • Favorite foods library
  • Meal planning
  • Activity logging
  • Daily nutrition summaries
  • Customizable meal reminders

  PRIVACY & SECURITY
  • Your data is encrypted and secure
  • Progress photos stored only on your device
  • Full data export anytime
  • Complete account deletion available in settings

  Perfect for anyone looking to improve their nutrition, lose weight, gain muscle, or maintain a healthy lifestyle.

  Download Mepe Khai today and transform your health journey!
  ```

#### App Details
- **App category:** Health & Fitness
- **Email:** ksami933@gmail.com
- **Privacy policy URL:** `https://github.com/ksami431/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md`

#### Graphics
- **App icon:** 512x512px (already have)
- **Feature graphic:** 1024x500px (you said you have this)
- **Phone screenshots:** 2-8 required (you said you have 5-7)

**Upload your prepared assets**

---

### Step 4: Content Rating

Complete the questionnaire:

**Violence:**
- Violence or blood: No

**Sexual Content:**
- Sexual content: No

**Profanity:**
- Profanity: No

**Controlled Substances:**
- Drug, alcohol, tobacco: No

**Gambling:**
- Gambling content: No

**Interactive Elements:**
- Users can interact: Yes (food logging, tracking)
- Users can exchange info: No
- In-app purchases: No

**Expected rating:** Everyone

---

### Step 5: Data Safety

**Data collected:**

**Personal info:**
- ✅ Name
- ✅ Email address

**Health & Fitness:**
- ✅ Health info (weight, dietary habits)
- ✅ Fitness info (activity tracking)

**Photos:**
- ✅ Photos (meal photos for analysis)

**App activity:**
- ✅ In-app actions

**Data usage:**
- ✅ App functionality
- ✅ Personalization

**Data sharing:**
- Third parties: Supabase (storage), Google Gemini (AI analysis)

**Security practices:**
- ✅ Data is encrypted in transit
- ✅ Data is encrypted at rest
- ✅ Users can request data deletion

---

### Step 6: Select Release Track

**Options:**

1. **Internal Testing** (Recommended first)
   - Up to 100 testers
   - Fastest approval (hours)
   - Test before public

2. **Closed Testing**
   - Invite-only beta
   - More testers allowed

3. **Open Testing**
   - Public opt-in beta

4. **Production**
   - Full public release
   - 1-7 days review time

**Recommendation:** Start with **Internal Testing**

---

### Step 7: Upload AAB

1. **In your release track, click "Create new release"**
2. **Upload AAB file** (downloaded from EAS)
3. **Release name:** v1.0.0
4. **Release notes:**
   ```
   Initial release of Mepe Khai!

   Features:
   • AI-powered food photo analysis
   • Comprehensive nutrition tracking
   • 12 micronutrient monitoring
   • Water intake tracking with reminders
   • Weight and activity logging
   • Personalized meal planning
   • Beautiful, intuitive interface
   ```

5. **Click "Review release"**
6. **Fix any errors shown**
7. **Click "Start rollout"**

---

## ⏱️ What Happens Next

### Internal Testing Track:
- **Review time:** 1-4 hours
- **Testers receive:** Email invitation
- **Testing period:** As long as you want
- **Promote to production:** When ready

### Production Track:
- **Review time:** 1-7 days (typically 1-3 days)
- **App goes live:** After approval
- **Updates:** 2-3 hours review time

---

## 📋 Pre-Submission Checklist

**Before clicking "Start rollout":**

- [ ] Supabase migrations run (both SQL files)
- [ ] GitHub repo created with privacy policy
- [ ] Privacy policy URL added to Play Store
- [ ] AAB downloaded from EAS
- [ ] Screenshots uploaded (5-7)
- [ ] Feature graphic uploaded (1024x500)
- [ ] App description complete
- [ ] Content rating complete
- [ ] Data safety section complete
- [ ] Delete account feature tested
- [ ] All core features work

---

## 🧪 Testing Checklist

**Test these before submission:**

1. **Sign up & Onboarding**
   - [ ] Create new account
   - [ ] Complete onboarding flow
   - [ ] Profile created in Supabase

2. **Food Tracking**
   - [ ] Take photo of food
   - [ ] AI analysis works
   - [ ] Micronutrients display
   - [ ] Manual entry works

3. **Water Tracking**
   - [ ] Add water intake
   - [ ] Progress updates
   - [ ] Goal customization works
   - [ ] 8x daily reminders (if enabled)

4. **Account Management**
   - [ ] Delete account button visible in Settings
   - [ ] Two-step confirmation works
   - [ ] Account deleted successfully
   - [ ] Can create new account after deletion

5. **Privacy**
   - [ ] Privacy policy link works
   - [ ] Opens GitHub URL correctly

---

## 🔄 After Submission

### When Approved:
1. **Test the published app**
2. **Share with friends/family**
3. **Gather feedback**
4. **Plan updates**

### Future Updates:
```bash
# 1. Make code changes
# 2. Publish OTA update
eas update --branch production --message "Your update message"

# 3. If native changes needed, rebuild
eas build --platform android --profile production

# 4. Upload new AAB to Play Store
```

---

## 📞 Support Resources

**EAS Build Dashboard:**
https://expo.dev/accounts/skhan7787/projects/mepe-khai/builds

**Play Console:**
https://play.google.com/console/

**Supabase Dashboard:**
https://supabase.com/dashboard

**Documentation:**
- EAS Build: https://docs.expo.dev/build/introduction/
- Play Store: https://support.google.com/googleplay/android-developer/

---

## 🎯 Summary

**You're 90% ready for Play Store submission!**

**Still need to:**
1. ✅ Run 2 Supabase migrations
2. ✅ Create GitHub repo for privacy policy
3. ✅ Wait for AAB build to complete (~15 mins)
4. ✅ Upload to Play Store

**Once submitted:**
- Internal testing approval: Hours
- Production approval: 1-7 days
- Your app will be on Google Play! 🎉

---

**Good luck with your launch! 🚀**

Contact: ksami933@gmail.com
