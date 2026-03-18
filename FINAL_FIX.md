# Final Fix for Metro Bundler Issue

The EMFILE error persists because Watchman isn't properly installed. Here's the solution:

## Option 1: Install Watchman Properly (Recommended)

**In your Terminal, run these commands one by one:**

```bash
# 1. Ensure Homebrew PATH is set
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# 2. Install Watchman (takes 2-3 minutes)
brew install watchman

# 3. Start Watchman service
brew services start watchman

# 4. Verify it's installed
watchman version

# 5. Navigate to project and start Expo
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npx expo start
```

---

## Option 2: Try Web Version First (Quick Test)

If you want to see the app working while Watchman installs:

```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npx expo start --web
```

This opens the app in your browser - no file watching issues!

---

## Option 3: Use iOS Simulator (If you have Xcode)

```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npx expo start --ios
```

---

## Why Watchman Fixes This

Watchman is Facebook's file-watching service designed specifically for large React Native projects. It handles file watching much more efficiently than the default Node.js watcher, avoiding the EMFILE error.

---

## Next Steps

1. **Install Watchman** using Option 1 commands above
2. **Verify installation:** `watchman version` should show a version number
3. **Start Expo:** `npx expo start`
4. **Scan QR code** with Expo Go on your phone
5. **App should load!**

---

**Start with Option 1 - copy those commands into your Terminal now.**
