import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';

export const uploadFoodImage = async (uri: string, userId: string): Promise<string> => {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}.jpg`;

    // Convert base64 to blob
    const blob = await fetch(`data:image/jpeg;base64,${base64}`).then((r) => r.blob());

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('food-images')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};
