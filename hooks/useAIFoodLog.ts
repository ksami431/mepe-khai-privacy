import { useState } from 'react';
import { analyzeTextFood, analyzeImageFood, FoodAnalysisResult } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { FoodLogInsert } from '@/types/food.types';
import { getTimeOfDay } from '@/utils/format';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const useAIFoodLog = (userId: string | undefined) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async (text: string): Promise<FoodAnalysisResult | null> => {
    if (!userId) {
      setError('User not logged in');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeTextFood(text);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze food');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeImage = async (imageUri: string): Promise<FoodAnalysisResult | null> => {
    if (!userId) {
      setError('User not logged in');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const analysis = await analyzeImageFood(base64);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    if (!userId) return null;

    setUploading(true);
    try {
      const fileName = `${userId}/${Date.now()}.jpg`;
      const arrayBuffer = await fetch(imageUri).then(res => res.arrayBuffer());

      const { data, error } = await supabase.storage
        .from('food-images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveFoodLog = async (
    analysis: FoodAnalysisResult,
    imageUrl?: string
  ): Promise<boolean> => {
    if (!userId) {
      setError('User not logged in');
      return false;
    }

    try {
      const foodLog: FoodLogInsert = {
        user_id: userId,
        meal_name: analysis.meal_name,
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fats: analysis.fats,
        meal_type: getTimeOfDay(),
        ai_analyzed: true,
        image_url: imageUrl,
      };

      const { error } = await supabase.from('food_logs').insert(foodLog);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save food log');
      return false;
    }
  };

  const pickImage = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access media library is required');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  };

  const takePhoto = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access camera is required');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  };

  return {
    analyzing,
    uploading,
    error,
    analyzeText,
    analyzeImage,
    uploadImage,
    saveFoodLog,
    pickImage,
    takePhoto,
  };
};
