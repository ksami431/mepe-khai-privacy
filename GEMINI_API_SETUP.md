# Google Gemini API Setup Guide

## Step 1: Access Google AI Studio

1. Open your web browser
2. Navigate to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
3. Sign in with your Google account

## Step 2: Create API Key

1. Click on **"Create API Key"** button
2. You'll see a dialog with two options:
   - **Create API key in new project** (recommended if you don't have an existing project)
   - **Create API key in existing project** (if you have a Google Cloud project)
3. Select your preferred option
4. Click **"Create API Key"**

## Step 3: Copy Your API Key

1. A new API key will be generated immediately
2. **IMPORTANT**: Copy the API key immediately and save it securely
3. The full key will only be shown once
4. Store it in a password manager or secure note

**Your API key will look something like this:**
```
AIzaSyD1234567890abcdefghijklmnopqrstuvwx
```

## Step 4: Add to Your Project

1. Open or create the `.env.local` file in your project root
2. Add the following line (replace with your actual API key):

```
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwx
```

3. **NEVER** commit this file to git or share it publicly

## Step 5: Enable Required APIs (Usually Automatic)

The following APIs should be automatically enabled:
- Generative Language API
- Vertex AI API (if using Vision features)

If you encounter issues, manually enable them:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Library**
4. Search for "Generative Language API"
5. Click **Enable**

## API Models We'll Use

### For Text Analysis (Natural Language Food Logging)
- **Model**: `gemini-1.5-flash`
- **Use case**: When users type "I ate 2 eggs and toast"
- **Speed**: Fast
- **Cost**: Low

### For Image Analysis (Food Photo Recognition)
- **Model**: `gemini-1.5-pro-vision` or `gemini-1.5-flash`
- **Use case**: When users take a photo of their meal
- **Speed**: Moderate
- **Cost**: Moderate

## Pricing (as of 2024)

### Gemini 1.5 Flash (Recommended for most features)
- **Free tier**: 15 requests per minute
- **Paid tier**: $0.075 per 1M characters (input), $0.30 per 1M characters (output)

### Gemini 1.5 Pro
- **Free tier**: 2 requests per minute
- **Paid tier**: $1.25 per 1M characters (input), $5.00 per 1M characters (output)

**For Mepe Khai**: We'll primarily use Flash for cost-effectiveness. It's fast and accurate enough for food recognition.

## Rate Limits

### Free Tier
- 15 requests per minute (Flash)
- 2 requests per minute (Pro)
- 1,500 requests per day

### Paid Tier
- 1,000 requests per minute
- Higher depending on your quota

**For development**: Free tier is sufficient  
**For production**: Monitor usage and upgrade if needed

## Security Best Practices

### ✅ DO:
- Store API key in `.env.local` (git-ignored)
- Use environment variables in your code
- Rotate keys periodically
- Monitor usage in Google Cloud Console

### ❌ DON'T:
- Hardcode API key in source code
- Commit `.env.local` to version control
- Share API key in public forums or screenshots
- Expose key in client-side code (we'll use it server-side or in secure environment)

## Testing Your Setup

Once your API key is added to `.env.local`, you can test it with a simple query:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent("What is 2 + 2?");
console.log(result.response.text());
// Should output: "4" or similar
```

## Verification Checklist

Your Gemini API setup is complete when:
- ✅ API key obtained from Google AI Studio
- ✅ API key saved in `.env.local`
- ✅ `.env.local` is in `.gitignore`
- ✅ Generative Language API is enabled in Google Cloud
- ✅ Test query works successfully

## Troubleshooting

### Error: "API key not valid"
- **Solution**: Double-check you copied the entire key
- Verify no extra spaces or characters

### Error: "Quota exceeded"
- **Solution**: You've hit the free tier limit
- Wait for rate limit to reset (per minute/day)
- Consider upgrading to paid tier

### Error: "API not enabled"
- **Solution**: Enable "Generative Language API" in Google Cloud Console

### Error: "Invalid model name"
- **Solution**: Ensure you're using correct model names:
  - `gemini-1.5-flash`
  - `gemini-1.5-pro`

## How Mepe Khai Will Use Gemini

### Scenario 1: Text-Based Food Logging
**User types**: "I ate 2 scrambled eggs, 2 slices of whole wheat toast with butter, and a glass of orange juice"

**Gemini returns**:
```json
{
  "meal_name": "Breakfast - Eggs and Toast",
  "calories": 520,
  "protein": 22,
  "carbs": 48,
  "fats": 24,
  "items": [
    { "food": "Scrambled eggs (2 large)", "calories": 180, "protein": 12, "carbs": 2, "fats": 12 },
    { "food": "Whole wheat toast (2 slices)", "calories": 160, "protein": 8, "carbs": 28, "fats": 2 },
    { "food": "Butter (1 tbsp)", "calories": 100, "protein": 0, "carbs": 0, "fats": 11 },
    { "food": "Orange juice (8 oz)", "calories": 110, "protein": 2, "carbs": 26, "fats": 0 }
  ]
}
```

### Scenario 2: Image-Based Food Recognition
**User takes photo**: Picture of a plate with chicken breast, rice, and broccoli

**Gemini analyzes** and returns:
```json
{
  "meal_name": "Grilled Chicken with Rice and Vegetables",
  "calories": 580,
  "protein": 48,
  "carbs": 52,
  "fats": 14,
  "confidence": "high",
  "items": [
    { "food": "Grilled chicken breast (6 oz)", "calories": 280, "protein": 53, "carbs": 0, "fats": 6 },
    { "food": "White rice (1 cup)", "calories": 240, "protein": 4, "carbs": 53, "fats": 0 },
    { "food": "Steamed broccoli (1 cup)", "calories": 55, "protein": 4, "carbs": 11, "fats": 0 }
  ]
}
```

## Next Steps

Once your API key is configured, we'll implement:
1. Text-to-nutrition analysis service
2. Image-to-nutrition analysis service
3. Prompt engineering for accurate macro estimation
4. Error handling and fallbacks
