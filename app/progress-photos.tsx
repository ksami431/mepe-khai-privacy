import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { getAllPhotos, saveProgressPhoto, deleteProgressPhoto, getPhotosByView, formatBytes, getStorageSize, ProgressPhoto } from '@/lib/photoStorage';

type ViewType = 'front' | 'side' | 'back' | 'all';

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<ViewType>('all');
  const [storageSize, setStorageSize] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);

  const styles = createStyles(theme);

  useEffect(() => {
    loadPhotos();
    loadStorageSize();
  }, [selectedView]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      let loadedPhotos: ProgressPhoto[];
      
      if (selectedView === 'all') {
        loadedPhotos = await getAllPhotos();
      } else {
        loadedPhotos = await getPhotosByView(selectedView);
      }
      
      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const loadStorageSize = async () => {
    const size = await getStorageSize();
    setStorageSize(size);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take progress photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      promptForView(result.assets[0].uri);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library access is needed to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      promptForView(result.assets[0].uri);
    }
  };

  const promptForView = (imageUri: string) => {
    Alert.alert(
      'Select Photo View',
      'Which angle is this photo?',
      [
        {
          text: 'Front',
          onPress: () => savePhoto(imageUri, 'front'),
        },
        {
          text: 'Side',
          onPress: () => savePhoto(imageUri, 'side'),
        },
        {
          text: 'Back',
          onPress: () => savePhoto(imageUri, 'back'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const savePhoto = async (imageUri: string, view: 'front' | 'side' | 'back') => {
    try {
      await saveProgressPhoto(imageUri, view);
      await loadPhotos();
      await loadStorageSize();
      Alert.alert('Success', 'Progress photo saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      'Delete Photo?',
      'Are you sure you want to delete this progress photo? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProgressPhoto(photo.id);
              await loadPhotos();
              await loadStorageSize();
              if (selectedPhoto?.id === photo.id) {
                setSelectedPhoto(null);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getViewEmoji = (view: string) => {
    switch (view) {
      case 'front': return '👤';
      case 'side': return '🧍';
      case 'back': return '🚶';
      default: return '📸';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Progress Photos</Text>
        <View style={styles.placeholder} />
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          Track your body transformation with progress photos. Photos are stored locally on your device for privacy.
        </Text>
        <Text style={styles.storageInfo}>
          Storage used: {formatBytes(storageSize)}
        </Text>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="📸 Take Photo"
          onPress={handleTakePhoto}
          style={styles.actionButton}
        />
        <Button
          title="🖼️ Upload Photo"
          onPress={handlePickPhoto}
          variant="outline"
          style={styles.actionButton}
        />
      </View>

      <View style={styles.filterButtons}>
        {(['all', 'front', 'side', 'back'] as ViewType[]).map((view) => (
          <TouchableOpacity
            key={view}
            style={[
              styles.filterButton,
              selectedView === view && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedView(view)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedView === view && styles.filterButtonTextActive,
            ]}>
              {view === 'all' ? '📸 All' : `${getViewEmoji(view)} ${view.charAt(0).toUpperCase() + view.slice(1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {photos.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your progress by taking or uploading your first photo!
          </Text>
        </Card>
      ) : (
        <View style={styles.gallery}>
          {photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              onPress={() => setSelectedPhoto(photo)}
              onLongPress={() => handleDeletePhoto(photo)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photoImage} />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoDate}>{formatDate(photo.date)}</Text>
                <Text style={styles.photoView}>{getViewEmoji(photo.view)} {photo.view}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedPhoto && (
        <View style={styles.fullScreenOverlay}>
          <TouchableOpacity 
            style={styles.fullScreenBackground}
            onPress={() => setSelectedPhoto(null)}
          >
            <View style={styles.fullScreenContent}>
              <Image 
                source={{ uri: selectedPhoto.uri }} 
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
              <View style={styles.fullScreenInfo}>
                <Text style={styles.fullScreenDate}>{formatDate(selectedPhoto.date)}</Text>
                <Text style={styles.fullScreenView}>
                  {getViewEmoji(selectedPhoto.view)} {selectedPhoto.view.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(selectedPhoto)}
              >
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backIcon: {
    fontSize: 28,
    color: theme.primary,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  infoText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  storageInfo: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterButtonText: {
    fontSize: FontSize.xs,
    color: theme.textLight,
    fontWeight: FontWeight.medium,
  },
  filterButtonTextActive: {
    color: theme.white,
    fontWeight: FontWeight.bold,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoCard: {
    width: (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.sm * 2) / 3,
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Spacing.xs,
  },
  photoDate: {
    fontSize: FontSize.xs,
    color: theme.white,
    fontWeight: FontWeight.medium,
  },
  photoView: {
    fontSize: FontSize.xs,
    color: theme.white,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 1000,
  },
  fullScreenBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  fullScreenImage: {
    width: '100%',
    height: '70%',
  },
  fullScreenInfo: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  fullScreenDate: {
    fontSize: FontSize.lg,
    color: theme.white,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  fullScreenView: {
    fontSize: FontSize.base,
    color: theme.white,
  },
  deleteButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: theme.error,
    borderRadius: BorderRadius.md,
  },
  deleteButtonText: {
    fontSize: FontSize.base,
    color: theme.white,
    fontWeight: FontWeight.bold,
  },
});
