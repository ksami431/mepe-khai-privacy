import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export interface FoodAnalysisResult {
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: 'high' | 'medium' | 'low';
  items?: Array<{
    food: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }>;
}

export interface RecipeAnalysisResult {
  recipe_name: string;
  servings: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  per_serving_calories: number;
  per_serving_protein: number;
  per_serving_carbs: number;
  per_serving_fats: number;
  ingredients: string[];
}

export const analyzeRecipe = async (recipeText: string): Promise<RecipeAnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Analyze this recipe and provide detailed nutrition information. 
Recipe:
${recipeText}

Please provide:
1. Recipe name (if mentioned, otherwise create one from ingredients)
2. Estimated number of servings
3. Total nutrition for the entire recipe
4. Nutrition per serving
5. List of main ingredients

Return ONLY a valid JSON object with this structure (no markdown, no extra text):
{
  "recipe_name": "string",
  "servings": number,
  "total_calories": number,
  "total_protein": number (in grams),
  "total_carbs": number (in grams),
  "total_fats": number (in grams),
  "per_serving_calories": number,
  "per_serving_protein": number (in grams),
  "per_serving_carbs": number (in grams),
  "per_serving_fats": number (in grams),
  "ingredients": ["ingredient1", "ingredient2", ...]
}

If servings are not mentioned, estimate based on typical serving sizes. Be accurate with nutrition calculations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse recipe analysis response');
    }

    const analysis: RecipeAnalysisResult = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing recipe:', error);
    throw new Error('Failed to analyze recipe. Please check the format and try again.');
  }
};

export const analyzeTextFood = async (text: string, weightGrams?: number): Promise<FoodAnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let foodDescription = text;
    if (weightGrams) {
      foodDescription = `${text} (weight: ${weightGrams} grams)`;
    }

    const prompt = `You are a nutrition expert. Analyze the following food description and provide nutritional information in JSON format.

Food description: "${foodDescription}"

${weightGrams ? `IMPORTANT: Calculate nutrition values for exactly ${weightGrams} grams of this food.` : 'Use standard serving sizes if quantities are not specified.'}

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "meal_name": "descriptive meal name",
  "calories": total_calories_as_number,
  "protein": protein_grams_as_number,
  "carbs": carbs_grams_as_number,
  "fats": fats_grams_as_number,
  "confidence": "high" or "medium" or "low",
  "items": [
    {
      "food": "food item name with quantity",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number
    }
  ]
}

Be accurate with macro calculations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const analysis: FoodAnalysisResult = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing text food:', error);
    throw new Error('Failed to analyze food. Please try again.');
  }
};

export const analyzeImageFood = async (imageBase64: string): Promise<FoodAnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a nutrition expert. Analyze this food image and provide detailed nutritional information in JSON format.

Identify all visible food items and estimate their quantities and nutritional values.

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "meal_name": "descriptive meal name based on what you see",
  "calories": total_calories_as_number,
  "protein": protein_grams_as_number,
  "carbs": carbs_grams_as_number,
  "fats": fats_grams_as_number,
  "confidence": "high" or "medium" or "low",
  "items": [
    {
      "food": "food item name with estimated quantity",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number
    }
  ]
}

Be as accurate as possible with portion size estimation and macro calculations.`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const textResponse = response.text();
    
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const analysis: FoodAnalysisResult = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing image food:', error);
    throw new Error('Failed to analyze food image. Please try again.');
  }
};
