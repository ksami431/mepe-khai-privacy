# Mepe Khai - AI Diet Tracker 🍽️

**"I eat by measuring"** - A modern, AI-powered calorie and macro tracking app built with React Native, Expo, Supabase, and Google Gemini AI.

---

## 🚀 Features

- **AI-Powered Food Logging**: Take a photo or describe your meal in natural language
- **Smart Macro Tracking**: Automatically calculates your personalized calorie and macro targets
- **Beautiful Dashboard**: Clean UI with visual progress rings for calories, protein, carbs, and fats
- **Intelligent Onboarding**: Answer simple questions to get personalized nutrition goals
- **Weight Tracking**: Monitor your progress with weekly check-ins
- **Cross-Platform**: Works on both iOS and Android

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Installation Guide](./SETUP_INSTRUCTIONS.md)
- **npm** or **yarn**
- **Expo CLI** (optional but recommended)
- **iOS Simulator** (Mac only) or **Android Emulator**

---

## 🛠️ Installation Steps

### 1. Install Node.js

If you haven't installed Node.js yet, follow the instructions in [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md).

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native & Expo
- Supabase client
- Google Gemini AI
- NativeWind (Tailwind CSS)
- And more...

### 3. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Set up the database schema
3. Configure Row Level Security
4. Get your API keys

### 4. Set Up Google Gemini API

Follow the guide in [GEMINI_API_SETUP.md](./GEMINI_API_SETUP.md) to:
1. Create a Google AI Studio account
2. Generate an API key
3. Configure the API for food analysis

### 5. Configure Environment Variables

1. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Fill in your credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

**⚠️ IMPORTANT**: Never commit `.env.local` to version control!

---

## 🏃 Running the App

### Development Mode

Start the Expo development server:
```bash
npx expo start
```

This will open the Expo Developer Tools in your browser. From there you can:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing only)
npm run web
```

---

## 📁 Project Structure

```
mepe-khai/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication flows
│   └── (tabs)/              # Main app tabs
├── components/              # Reusable UI components
│   └── ui/                  # Base components
├── lib/                     # Core business logic
│   ├── supabase.ts         # Supabase client
│   ├── gemini.ts           # AI food analysis
│   ├── calculations.ts     # TDEE & macro calculations
│   └── constants.ts        # App constants
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication
│   ├── useDailyStats.ts    # Daily nutrition stats
│   └── useAIFoodLog.ts     # AI food logging
├── types/                   # TypeScript definitions
├── utils/                   # Helper functions
└── assets/                  # Images, fonts, icons
```

---

## 🎨 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React Native, Expo, TypeScript |
| **Navigation** | Expo Router |
| **Styling** | NativeWind (Tailwind CSS) |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI** | Google Gemini API |
| **Storage** | Supabase Storage |
| **State** | React Hooks |
| **Forms** | React Hook Form + Zod |

---

## 📱 Building for Production

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure Your Project

```bash
eas build:configure
```

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

### Submit to App Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## 🔧 Configuration Files

- **`app.json`**: Expo configuration
- **`eas.json`**: EAS Build configuration for app stores
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`tailwind.config.js`**: Tailwind CSS theme customization
- **`babel.config.js`**: Babel configuration for NativeWind

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
Run `npm install` to ensure all dependencies are installed.

### Expo app not opening
1. Clear Expo cache: `npx expo start -c`
2. Restart your development server

### Supabase connection issues
1. Verify your `.env.local` file has correct credentials
2. Check that your Supabase project is active
3. Ensure RLS policies are correctly configured

### Gemini API errors
1. Verify your API key is correct
2. Check API quota in Google Cloud Console
3. Ensure you're using the correct model names

### Build errors
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Expo cache: `npx expo start -c`
3. Update dependencies: `npm update`

---

## 📚 Key Features Implementation Status

### Phase 1: Authentication & Onboarding ✅
- [x] Project structure created
- [x] Supabase integration configured
- [x] Type definitions established
- [ ] Login/Signup screens (Next step)
- [ ] Onboarding questionnaire (Next step)

### Phase 2: AI Food Logging (Next)
- [x] Gemini AI integration prepared
- [ ] Camera interface
- [ ] Text input interface
- [ ] AI analysis confirmation screen

### Phase 3: Dashboard & Tracking (Next)
- [ ] Daily calorie summary
- [ ] Macro progress rings
- [ ] Food log history
- [ ] Weight tracking

### Phase 4: Polish & Optimization (Future)
- [ ] Offline support
- [ ] Push notifications
- [ ] Dark mode
- [ ] Haptic feedback

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

## 📄 License

Private - All rights reserved

---

## 📞 Support

For setup help, refer to:
- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [Gemini API Setup](./GEMINI_API_SETUP.md)

---

## 🎯 Next Steps

1. **Install Node.js** (if not done) - See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
2. **Run `npm install`** - Install all dependencies
3. **Set up Supabase** - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. **Set up Gemini API** - Follow [GEMINI_API_SETUP.md](./GEMINI_API_SETUP.md)
5. **Create `.env.local`** - Add your API keys
6. **Start the app** - Run `npx expo start`
7. **Build the screens** - Start with authentication flow

---

**Built with ❤️ for a healthier lifestyle**
