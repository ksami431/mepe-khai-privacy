# Fix "Too Many Open Files" Error

## Quick Solution: Use Expo Go on Your Phone (Recommended)

This bypasses the file limit issue entirely:

1. **Download Expo Go** on your iPhone/Android
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Run this command in your terminal:**
   ```bash
   export PATH="/usr/local/bin:$PATH" && npx expo start --tunnel
   ```

3. **Scan the QR code** with your phone camera
4. **App opens in Expo Go!**

---

## OR: Fix the File Limit (Permanent Solution)

### Step 1: Open Terminal and run:

```bash
sudo launchctl limit maxfiles 65536 200000
```

Enter your Mac password when prompted.

### Step 2: Restart your terminal/IDE

### Step 3: Verify it worked:

```bash
ulimit -n
```

Should show 65536 or higher.

### Step 4: Start Expo:

```bash
npx expo start
```

---

## Which Should You Choose?

**Use Expo Go (Method 1)** if:
- ✅ You want to test on a real device
- ✅ You want the fastest setup
- ✅ You don't want to mess with system settings

**Fix File Limit (Method 2)** if:
- ✅ You want to use iOS Simulator
- ✅ You want to use Android Emulator
- ✅ You prefer testing on your computer

---

**Try Expo Go first - it's easier and you get to test on a real phone!**
