# 📱 Share Mepe Khai with iPhone Friends

## Quick Guide for Your Friends

### Step 1: Install Expo Go
1. Open the **App Store** on iPhone
2. Search for **"Expo Go"**
3. Download and install the app (it's free!)

### Step 2: Access Mepe Khai App

**Method 1: Via QR Code (Recommended)**
When you're running the development server, friends can:
1. Open **Expo Go** app on their iPhone
2. Tap **"Scan QR Code"** at the bottom
3. Scan the QR code you share with them
4. App will load and run instantly

**Method 2: Via Shared Link**
When you start the development server:
1. You'll get a link like: `exp://192.168.x.x:8081`
2. Share this link with your friends
3. They open it on their iPhone
4. It will prompt to open in Expo Go
5. App loads automatically

**Note:** Your computer must be running the development server (`npm start`) for friends to access the app. Both you and your friends need to be on the same WiFi network, OR you can use tunnel mode for remote access.

---

## 🎯 What Your Friends Will Experience

### First Time Opening
1. App opens in Expo Go
2. See "Mepe Khai" welcome screen
3. Can sign up with email/password
4. Complete onboarding flow
5. Start using the app!

### Features They Can Test
- ✅ Account creation and login
- ✅ Profile setup and editing
- ✅ Meal logging with AI analysis
- ✅ Food diary tracking
- ✅ Weight tracking and charts
- ✅ Progress photos
- ✅ Nutrition statistics
- ✅ All latest updates you publish

---

## 📤 How to Share (For You)

### Step 1: Start the Development Server
```bash
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"
npm start
```

### Step 2: Choose Sharing Method

**Option A: Share QR Code (Same WiFi Network)**
1. After running `npm start`, you'll see a QR code in terminal
2. Press `t` to toggle QR code visibility
3. Take a screenshot of the QR code
4. Send to your friends via text/WhatsApp/email
5. They scan it with Expo Go app

**Option B: Share Link (Same WiFi Network)**
1. After running `npm start`, you'll see a link like:
   ```
   exp://192.168.1.x:8081
   ```
2. Copy this link
3. Send to friends
4. They open it on iPhone → Opens in Expo Go

**Option C: Use Tunnel Mode (Remote Access - Works Anywhere)**
1. Run with tunnel:
   ```bash
   npm start -- --tunnel
   ```
2. Wait for tunnel to connect (may take 30-60 seconds)
3. You'll get a public URL like:
   ```
   exp://abc-xyz.anonymous.mepe-khai.exp.direct:80
   ```
4. Share this link - works from anywhere!
5. Friends don't need to be on same WiFi

### Message Template for Friends
```
Hey! Try my app Mepe Khai:

1. Install "Expo Go" from the App Store (free)
2. Open this link on your iPhone:
   [paste the exp:// link here]
3. It will open in Expo Go automatically

Let me know what you think! It's an AI-powered diet tracker I'm building.
```

---

## 🔄 Updating the App

### During Development (Live Reload)
- When you save code changes, the app updates automatically
- Friends see changes in real-time
- Just keep the development server running

### Publishing Updates (For Production)
When you publish updates:
```bash
npx eas-cli update --branch production --message "Your update message"
```

Note: EAS updates work for standalone builds, not Expo Go development mode.

---

## ⚠️ Important Notes

### For Your Friends
- **Requires Expo Go**: Free app from App Store
- **Internet Required**: App loads from Expo servers
- **Show Expo Branding**: Top bar shows "Expo Go"
- **Not Standalone**: Opens within Expo Go app

### For You
- **Unlimited Testers**: Add as many friends as you want
- **Free**: No Apple Developer account needed
- **Live Reload**: Changes appear instantly when you save
- **No Review Process**: Bypass App Store review
- **Must Keep Server Running**: Your computer needs to run `npm start`

### Limitations
- ❌ Not on App Store (requires Expo Go)
- ❌ Your computer must be running the dev server
- ❌ Same WiFi network required (unless using tunnel mode)
- ❌ Can't test push notifications (requires standalone build)
- ❌ Shows Expo branding

---

## 🚀 If You Want Standalone App Later

For a production-ready app without Expo Go:

1. **Get Apple Developer Account** ($99/year)
2. **Build Standalone App**:
   ```bash
   eas build --profile production --platform ios
   ```
3. **Distribute via TestFlight** (Apple's beta testing)
4. **Submit to App Store** (full release)

---

## 📞 Support for Friends

### Common Issues

**"Can't find the app in Expo Go"**
- Make sure your development server is running (`npm start`)
- Verify you're both on the same WiFi network (or use tunnel mode)
- Try the direct link method instead
- Ensure they're opening the link in Safari (not Chrome)

**"App won't load"**
- Verify your development server is still running
- Check that you're on the same WiFi network
- Try using tunnel mode: `npm start -- --tunnel`
- Ask them to close and reopen Expo Go
- Restart the development server

**"Getting an error message"**
- Send you a screenshot
- Check if your app is published correctly
- Verify they're using the correct link

**"App crashes or freezes"**
- Update to latest version (you publish update)
- Have them clear Expo Go cache
- Report specific steps to reproduce

---

## 📊 Track Your Testers

### Expo Dashboard
- Visit: `https://expo.dev/accounts/skhan7787/projects/mepe-khai`
- See app analytics
- View error logs
- Monitor usage

### Get Feedback
Ask friends to report:
- ✅ What features work well
- ❌ Any bugs or crashes
- 💡 Improvement suggestions
- 🎨 UI/UX feedback

---

## 🎉 Ready to Share!

Your app is live and ready for testing. Share one of the methods above with your iPhone friends and start getting feedback!

**Project Info:**
- Owner: skhan7787
- Slug: mepe-khai
- Project ID: b8175dbf-4d83-42c5-a3e3-bf09bf74e678
- Branch: production
- Runtime: 1.0.0
