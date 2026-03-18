import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { Alert } from 'react-native';

export interface MealShareData {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType?: string;
  imageUrl?: string;
}

// Check if sharing is available on the device
export async function isSharingAvailable(): Promise<boolean> {
  return await Sharing.isAvailableAsync();
}

// Capture a view as an image and share it
export async function shareView(viewRef: any, title: string = 'My Meal'): Promise<boolean> {
  try {
    const available = await isSharingAvailable();
    
    if (!available) {
      Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
      return false;
    }

    // Capture the view as an image
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
    });

    // Share the image
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: title,
    });

    return true;
  } catch (error) {
    console.error('Error sharing view:', error);
    Alert.alert('Error', 'Failed to share. Please try again.');
    return false;
  }
}

// Share meal data as text
export async function shareMealAsText(meal: MealShareData): Promise<boolean> {
  try {
    const available = await isSharingAvailable();
    
    if (!available) {
      Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
      return false;
    }

    const text = formatMealForSharing(meal);
    
    // Note: expo-sharing doesn't support text sharing directly
    // This would need native sharing module for text
    Alert.alert(
      'Share Meal',
      'Text sharing requires native share module. Please use the image share option.',
      [{ text: 'OK' }]
    );

    return false;
  } catch (error) {
    console.error('Error sharing meal text:', error);
    Alert.alert('Error', 'Failed to share. Please try again.');
    return false;
  }
}

// Format meal data for sharing as text
export function formatMealForSharing(meal: MealShareData): string {
  const mealTypeEmoji = getMealTypeEmoji(meal.mealType || '');
  
  return `${mealTypeEmoji} ${meal.mealName}

📊 Nutrition Info:
🔥 ${meal.calories} cal
💪 ${meal.protein}g protein
🍞 ${meal.carbs}g carbs
🥑 ${meal.fats}g fats

Tracked with Mepe Khai - AI Diet Tracker`;
}

// Get emoji for meal type
function getMealTypeEmoji(mealType: string): string {
  const emojis: Record<string, string> = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
  };
  return emojis[mealType.toLowerCase()] || '🍴';
}

// Calculate macro percentages for visual display
export function calculateMacroPercentages(meal: MealShareData) {
  const totalMacros = meal.protein * 4 + meal.carbs * 4 + meal.fats * 9;
  
  if (totalMacros === 0) {
    return { protein: 0, carbs: 0, fats: 0 };
  }

  return {
    protein: Math.round((meal.protein * 4 / totalMacros) * 100),
    carbs: Math.round((meal.carbs * 4 / totalMacros) * 100),
    fats: Math.round((meal.fats * 9 / totalMacros) * 100),
  };
}
