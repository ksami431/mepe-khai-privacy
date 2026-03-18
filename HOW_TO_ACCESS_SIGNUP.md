# How to Access Sign Up/Sign In Screens

## 🔍 Current Situation

You're seeing the **onboarding welcome screen** because:
1. You have a user account in Supabase (from previous sign up attempts)
2. But you don't have a profile yet
3. The app auto-redirects users without profiles to onboarding

## ✅ Solution: Use the Back Button

I've added a **"← Back" button** at the top of the onboarding welcome screen.

### Steps to Access Sign Up/Sign In:

1. **Look at the top-left** of your screen
2. **Tap "← Back"**
3. **Confirm "Sign Out"** when prompted
4. You'll return to the main welcome screen
5. Now you can tap **"Get Started"** (sign up) or **"Sign In"**

## 🔄 Alternative: Delete Test User in Supabase

If the back button doesn't appear yet (waiting for hot reload):

1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find your test user (ksami933@gmail.com)
4. Click the **trash icon** to delete
5. Refresh your app
6. You'll see the main welcome screen

## 📱 What You Should See Now

### On the Onboarding Welcome Screen:
```
← Back                    (NEW - tap this!)
━━━━━━━━━━━━━━━━━━━━━━━
Progress: 1 of 5

🥗

Welcome to Mepe Khai!
Measure, Track, Transform

📊 Track your nutrition...
🎯 Set and achieve goals...
📈 Monitor your progress...
💪 Transform your health...

[Let's Get Started]
```

### After Tapping Back → Sign Out:
```
🥗

Mepe Khai
AI Diet Tracker
Measure, Track, Transform

Your intelligent companion for...

[Get Started]      ← Sign up new account
[Sign In]          ← Sign in existing
```

## 🎯 Complete Flow

### Option 1: Sign Up New Account
1. Tap "← Back" on onboarding screen
2. Confirm "Sign Out"
3. Tap "Get Started"
4. Enter NEW email/password
5. Tap "Create Account"
6. Complete all 5 onboarding steps
7. See real calorie values
8. Navigate to tabs

### Option 2: Sign In Existing (After Fixing)
1. First, complete onboarding for an account
2. Sign out from profile tab
3. Return to welcome screen
4. Tap "Sign In"
5. Enter credentials
6. Auto-redirect to tabs (profile exists)

## ⚡ Hot Reload Status

**Changes are live!** The back button should appear on your iPhone within seconds.

If you don't see it yet:
- Pull down to refresh in Expo Go
- Or shake your phone → "Reload"
- Or wait 5-10 seconds for auto-reload

## 🔧 Technical Details

**What I Added**:
- Back button in onboarding welcome screen header
- Sign out functionality from onboarding
- Alert confirmation before signing out
- Redirect to main welcome screen after sign out

**Files Modified**:
- `app/(onboarding)/welcome.tsx` - Added back button + sign out

---

**You should now be able to access the sign up and sign in screens!**
