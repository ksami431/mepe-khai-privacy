# Quick Fix - Choose One Method

## Method 1: Restart Terminal (Fastest - 30 seconds)

1. **Close your Terminal app completely** (Cmd+Q)
2. **Open Terminal again**
3. **Run these commands:**
   ```bash
   cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
   npx expo start
   ```

The new file limit should now be active.

---

## Method 2: Install Watchman (Recommended - 5 minutes)

Watchman is Facebook's file watching service, recommended for React Native development.

### Step 1: Install Homebrew (if you don't have it)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the instructions it shows at the end to add Homebrew to your PATH.

### Step 2: Install Watchman
```bash
brew install watchman
```

### Step 3: Start Expo
```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npx expo start
```

---

## Why This Happens

macOS limits file watchers by default. Metro bundler needs to watch many files in `node_modules`. Your system limit is now set correctly (65536), but the Terminal needs to be restarted to use it.

---

**Try Method 1 first (restart Terminal) - it's fastest!**

Then scan the QR code with Expo Go on your phone and the app should load.
