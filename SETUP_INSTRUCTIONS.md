# Mepe Khai - Setup Instructions

## Prerequisites Installation

### Step 1: Install Node.js

Node.js is required for React Native and Expo development. Choose one of the following methods:

#### Option A: Using Homebrew (Recommended for macOS)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

#### Option B: Using Official Installer
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer and follow the prompts
4. Verify installation:
```bash
node --version
npm --version
```

#### Option C: Using nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

### Step 2: Verify Installation
After installing Node.js, verify that npm and npx are available:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
npx --version   # Should show 9.x.x or higher
```

### Step 3: Install Expo CLI Globally (Optional but Recommended)
```bash
npm install -g expo-cli
```

---

## Next Steps

Once Node.js is installed, I will proceed with:
1. Initializing the Expo project with TypeScript
2. Installing all dependencies
3. Setting up the project structure
4. Configuring Supabase and Gemini API

**Please install Node.js using one of the methods above, then let me know so I can continue with the project setup.**
