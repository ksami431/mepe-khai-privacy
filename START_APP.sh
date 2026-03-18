#!/bin/bash

echo "🚀 Starting Mepe Khai..."
echo ""

# Set PATH to include Node.js
export PATH="/usr/local/bin:$PATH"

# Increase file descriptor limit for this session
ulimit -n 65536

# Navigate to project directory
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"

# Start Expo
npx expo start
