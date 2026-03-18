# Connect Your iPhone to Mepe Khai

## Simple 3-Step Process

### Step 1: Start the Server
In your Terminal, run:
```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npx expo start
```

### Step 2: On Your iPhone
1. Download **Expo Go** from the App Store (if you haven't already)
2. Make sure your iPhone is on the **same WiFi** as your Mac

### Step 3: Connect
Open **Expo Go** on your iPhone and you'll see one of these options:

**Option A: Automatic (Easiest)**
- Look under "Development servers"
- You should see "Mepe Khai - AI Diet Tracker"
- Tap it to connect

**Option B: Scan QR Code**
- Open iPhone Camera app
- Point at the QR code in your Terminal
- Tap the notification
- Opens in Expo Go

**Option C: Manual URL**
- In Expo Go, tap your profile icon (top right)
- Find "Enter URL manually"
- Type: `exp://192.168.0.166:8081`
- Tap Connect

---

## Your Connection Details

**Your Mac IP:** 192.168.0.166
**Metro Port:** 8081
**Full URL:** exp://192.168.0.166:8081

---

## Troubleshooting

**If it doesn't connect:**
1. Verify both devices are on the same WiFi
2. Check your Mac's firewall isn't blocking port 8081
3. Try restarting Metro bundler (Ctrl+C then `npx expo start`)

**If you see "Unable to connect":**
- Your network might be blocking local connections
- Try using your Mac's hotspot instead of WiFi

---

## What You'll See

Once connected, the app will load and show:
- "Mepe Khai" title
- "AI Diet Tracker" subtitle
- "Setup Complete! ✅"
- Message about building authentication screens

This confirms everything is working!
