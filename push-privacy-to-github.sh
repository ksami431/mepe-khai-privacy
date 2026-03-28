#!/bin/bash

# Script to push privacy policy to GitHub
# Run this after creating your GitHub Personal Access Token

echo "🚀 Pushing Privacy Policy to GitHub..."
echo ""

# Navigate to project directory
cd "/Users/samikhan/Mepe Khai - AI Diet Tracker"

# Check if privacy-repo remote already exists
if git remote | grep -q "privacy-repo"; then
    echo "✅ Remote 'privacy-repo' already exists"
else
    echo "➕ Adding GitHub remote..."
    git remote add privacy-repo https://github.com/ksami431/mepe-khai-privacy.git
fi

# Add privacy policy file
echo "📄 Adding PRIVACY_POLICY.md..."
git add PRIVACY_POLICY.md

# Commit
echo "💾 Committing..."
git commit -m "Add privacy policy for Mepe Khai app - Contact: ksami933@gmail.com"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for:"
echo "   Username: ksami431"
echo "   Password: [paste your GitHub token here]"
echo ""
git push privacy-repo HEAD:main

echo ""
echo "✅ Done! Check: https://github.com/ksami431/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md"
