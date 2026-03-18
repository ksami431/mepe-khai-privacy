import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  view: 'front' | 'side' | 'back';
  notes?: string;
}

const PHOTOS_KEY = '@progress_photos';
const PHOTOS_DIR = FileSystem.documentDirectory + 'progress_photos/';

// Ensure the photos directory exists
export const initializePhotoStorage = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
};

// Save photo metadata to AsyncStorage
const savePhotoMetadata = async (photos: ProgressPhoto[]) => {
  try {
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Error saving photo metadata:', error);
    throw error;
  }
};

// Get all photo metadata
export const getAllPhotos = async (): Promise<ProgressPhoto[]> => {
  try {
    const data = await AsyncStorage.getItem(PHOTOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading photos:', error);
    return [];
  }
};

// Save a new photo
export const saveProgressPhoto = async (
  imageUri: string,
  view: 'front' | 'side' | 'back',
  notes?: string
): Promise<ProgressPhoto> => {
  try {
    await initializePhotoStorage();

    const id = Date.now().toString();
    const filename = `photo_${id}.jpg`;
    const newUri = PHOTOS_DIR + filename;

    // Copy the image to our photos directory
    await FileSystem.copyAsync({
      from: imageUri,
      to: newUri,
    });

    const photo: ProgressPhoto = {
      id,
      uri: newUri,
      date: new Date().toISOString(),
      view,
      notes,
    };

    const photos = await getAllPhotos();
    photos.unshift(photo); // Add to beginning
    await savePhotoMetadata(photos);

    return photo;
  } catch (error) {
    console.error('Error saving progress photo:', error);
    throw error;
  }
};

// Delete a photo
export const deleteProgressPhoto = async (photoId: string) => {
  try {
    const photos = await getAllPhotos();
    const photoToDelete = photos.find(p => p.id === photoId);
    
    if (photoToDelete) {
      // Delete the file
      const fileInfo = await FileSystem.getInfoAsync(photoToDelete.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photoToDelete.uri);
      }
    }

    // Remove from metadata
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    await savePhotoMetadata(updatedPhotos);
  } catch (error) {
    console.error('Error deleting progress photo:', error);
    throw error;
  }
};

// Get photos by view type
export const getPhotosByView = async (view: 'front' | 'side' | 'back'): Promise<ProgressPhoto[]> => {
  const photos = await getAllPhotos();
  return photos.filter(p => p.view === view);
};

// Get storage size
export const getStorageSize = async (): Promise<number> => {
  try {
    const photos = await getAllPhotos();
    let totalSize = 0;
    
    for (const photo of photos) {
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.exists && 'size' in fileInfo) {
        totalSize += fileInfo.size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

// Format bytes to readable string
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
