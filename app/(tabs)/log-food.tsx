import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MealTypeSelector, MealType } from '@/components/MealTypeSelector';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { RecipeInput } from '@/components/RecipeInput';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { useFavorites } from '@/hooks/useFavorites';
import { analyzeImageFood, analyzeTextFood, analyzeRecipe } from '@/lib/gemini';
import { uploadFoodImage } from '@/lib/storage';
import { searchProductByBarcode, calculateNutritionForServing } from '@/lib/openfoodfacts';
import { getMealTypeByTime } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function LogFoodScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const { createFoodLog } = useFoodLogs();
  const { createFavorite } = useFavorites();
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [weight, setWeight] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [servingSize, setServingSize] = useState('');
  const [showRecipeInput, setShowRecipeInput] = useState(false);
  const [recipeData, setRecipeData] = useState<any>(null);
  const [selectedServings, setSelectedServings] = useState('');
  const styles = createStyles(theme);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable camera and photo library access in your device settings to use this feature.'
      );
      return false;
    }
    return true;
  };

  const processImage = async (uri: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to log food');
      return;
    }

    setAnalyzing(true);
    setImageUri(uri);

    try {
      // Convert image to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64 = await base64Promise;

      // Analyze with AI
      const analysis = await analyzeImageFood(base64);

      // Try to upload image to Supabase Storage (optional)
      let imageUrl: string | null = null;
      try {
        imageUrl = await uploadFoodImage(uri, user.id);
      } catch (uploadError) {
        console.log('Image upload skipped (bucket may not exist):', uploadError);
      }

      // Store results and show review screen
      setAnalysisResult(analysis);
      setUploadedImageUrl(imageUrl);
      setSelectedMealType(getMealTypeByTime());
    } catch (error: any) {
      console.error('Error processing image:', error);
      Alert.alert('Analysis Failed', error.message || 'Failed to analyze food. Please try manual entry.');
      setImageUri(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRecalculateWithWeight = async () => {
    if (!analysisResult || !weight.trim()) return;

    setAnalyzing(true);
    try {
      const weightGrams = parseFloat(weight);
      if (isNaN(weightGrams) || weightGrams <= 0) {
        Alert.alert('Error', 'Please enter a valid weight');
        return;
      }

      // Re-analyze with weight using text analysis
      const updatedAnalysis = await analyzeTextFood(analysisResult.meal_name, weightGrams);
      setAnalysisResult(updatedAnalysis);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to recalculate with weight');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    if (!analysisResult || !user) return;

    setSaving(true);
    try {
      const weightGrams = weight.trim() ? parseFloat(weight) : undefined;
      
      await createFoodLog({
        meal_name: analysisResult.meal_name,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        meal_type: selectedMealType,
        logged_at: new Date().toISOString(),
        image_url: uploadedImageUrl,
        ai_analyzed: true,
        weight_grams: weightGrams,
      });

      Alert.alert(
        'Success!',
        `${analysisResult.meal_name} logged successfully!`,
        [
          {
            text: 'Save as Favorite',
            onPress: async () => {
              try {
                await createFavorite({
                  meal_name: analysisResult.meal_name,
                  calories: analysisResult.calories,
                  protein: analysisResult.protein,
                  carbs: analysisResult.carbs,
                  fats: analysisResult.fats,
                  meal_type: selectedMealType,
                  weight_grams: weightGrams || null,
                });
                Alert.alert('Saved!', 'Added to your favorites');
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to save favorite');
              }
              setImageUri(null);
              setAnalysisResult(null);
              setWeight('');
              setUploadedImageUrl(null);
              setSelectedMealType(null);
              router.back();
            },
          },
          { 
            text: 'Done', 
            onPress: () => {
              setImageUri(null);
              setAnalysisResult(null);
              setWeight('');
              setUploadedImageUrl(null);
              setSelectedMealType(null);
              router.back();
            }
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save food log');
    } finally {
      setSaving(false);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setShowBarcodeScanner(false);
    setAnalyzing(true);

    try {
      const productData = await searchProductByBarcode(barcode);
      
      if (!productData) {
        Alert.alert(
          'Product Not Found',
          'This product is not in our database. Please try manual entry.',
          [
            { text: 'Manual Entry', onPress: () => router.push('/(tabs)/manual-entry') },
            { text: 'Scan Again', onPress: () => setShowBarcodeScanner(true) },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        setAnalyzing(false);
        return;
      }

      setScannedProduct(productData);
      setServingSize('100');
      setSelectedMealType(getMealTypeByTime());
      
      const nutrition = calculateNutritionForServing(productData, 100);
      setAnalysisResult({
        meal_name: `${productData.productName}${productData.brand ? ' (' + productData.brand + ')' : ''}`,
        ...nutrition,
        confidence: 'high',
      });
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to fetch product information. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRecalculateServingSize = () => {
    if (!scannedProduct || !servingSize.trim()) return;

    const grams = parseFloat(servingSize);
    if (isNaN(grams) || grams <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid serving size in grams');
      return;
    }

    const nutrition = calculateNutritionForServing(scannedProduct, grams);
    setAnalysisResult({
      ...analysisResult,
      ...nutrition,
    });
    setWeight(servingSize);
  };

  const handleRecipeAnalysis = async (recipeText: string) => {
    setAnalyzing(true);

    try {
      const analysis = await analyzeRecipe(recipeText);
      
      setRecipeData(analysis);
      setSelectedServings('1');
      setSelectedMealType(getMealTypeByTime());
      
      // Show per-serving nutrition by default
      setAnalysisResult({
        meal_name: analysis.recipe_name,
        calories: Math.round(analysis.per_serving_calories),
        protein: Math.round(analysis.per_serving_protein * 10) / 10,
        carbs: Math.round(analysis.per_serving_carbs * 10) / 10,
        fats: Math.round(analysis.per_serving_fats * 10) / 10,
        confidence: 'high',
      });
      
      setShowRecipeInput(false);
    } catch (error: any) {
      console.error('Error analyzing recipe:', error);
      Alert.alert('Analysis Failed', error.message || 'Failed to analyze recipe. Please check the format and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRecalculateServings = () => {
    if (!recipeData || !selectedServings.trim()) return;

    const servings = parseFloat(selectedServings);
    if (isNaN(servings) || servings <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of servings');
      return;
    }

    const totalCalories = recipeData.per_serving_calories * servings;
    const totalProtein = recipeData.per_serving_protein * servings;
    const totalCarbs = recipeData.per_serving_carbs * servings;
    const totalFats = recipeData.per_serving_fats * servings;

    setAnalysisResult({
      meal_name: recipeData.recipe_name + ` (${servings} serving${servings !== 1 ? 's' : ''})`,
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fats: Math.round(totalFats * 10) / 10,
      confidence: 'high',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.analyzingContainer}>
          <LoadingSpinner />
          <Text style={styles.analyzingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={styles.title}>Sign In Required</Text>
            <Text style={styles.description}>
              Please sign in to log your meals and track your nutrition.
            </Text>
          </Card>
          <Button
            title="Sign In"
            onPress={() => router.replace('/(auth)/signin')}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  if (analyzing) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.analyzingScrollContent}>
          {imageUri && (
            <View style={styles.analyzingImageContainer}>
              <Image source={{ uri: imageUri }} style={styles.analyzingImage} />
              <View style={styles.imageOverlay} />
            </View>
          )}
          <Card style={styles.analyzingCard}>
            <Text style={styles.analyzingEmoji}>🔍</Text>
            <Text style={styles.analyzingTitle}>Analyzing your food...</Text>
            <Text style={styles.analyzingDescription}>
              Our AI is identifying the ingredients and calculating nutrition
            </Text>
            <LoadingSpinner />
          </Card>
        </ScrollView>
      </View>
    );
  }

  if (analysisResult) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {imageUri && <Image source={{ uri: imageUri }} style={styles.reviewImage} />}
            
            <Card style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>{analysisResult.meal_name}</Text>
              <View style={styles.macrosGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Calories</Text>
                  <Text style={styles.macroValue}>{analysisResult.calories}</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>{analysisResult.protein}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>{analysisResult.carbs}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Fats</Text>
                  <Text style={styles.macroValue}>{analysisResult.fats}g</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.weightCard}>
              <Text style={styles.weightTitle}>⚖️ Adjust Weight (Optional)</Text>
              <Text style={styles.weightDescription}>
                Enter the weight in grams for more accurate calorie tracking
              </Text>
              <View style={styles.weightInputContainer}>
                <TextInput
                  style={styles.weightInput}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="e.g., 200"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <Button
                  title="Recalculate"
                  onPress={() => {
                    Keyboard.dismiss();
                    handleRecalculateWithWeight();
                  }}
                  disabled={!weight.trim()}
                  variant="outline"
                  style={styles.recalculateButton}
                />
              </View>
            </Card>

            <MealTypeSelector
              selectedType={selectedMealType}
              onSelect={setSelectedMealType}
            />

            <View style={styles.actionButtons}>
              <Button
                title={saving ? 'Saving...' : 'Save Food Log'}
                onPress={() => {
                  Keyboard.dismiss();
                  handleSaveLog();
                }}
                disabled={saving}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  Keyboard.dismiss();
                  setImageUri(null);
                  setAnalysisResult(null);
                  setWeight('');
                  setUploadedImageUrl(null);
                  setSelectedMealType(null);
                }}
                variant="outline"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.icon}>📸</Text>
          <Text style={styles.title}>Log Your Food</Text>
          <Text style={styles.description}>
            Take a photo or manually enter your meal details.
          </Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={handleTakePhoto}
            style={styles.button}
          />
          <Button
            title="Choose from Gallery"
            onPress={handleChooseFromGallery}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Scan Barcode"
            onPress={() => setShowBarcodeScanner(true)}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Analyze Recipe"
            onPress={() => setShowRecipeInput(true)}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Manual Entry"
            onPress={() => router.push('/(tabs)/manual-entry')}
            variant="outline"
            style={styles.button}
          />
        </View>
      </View>

      <Modal
        visible={showBarcodeScanner}
        animationType="slide"
        onRequestClose={() => setShowBarcodeScanner(false)}
      >
        <BarcodeScanner
          onBarcodeScanned={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      </Modal>

      <Modal
        visible={showRecipeInput}
        animationType="slide"
        onRequestClose={() => setShowRecipeInput(false)}
      >
        <RecipeInput
          onAnalyze={handleRecipeAnalysis}
          onCancel={() => setShowRecipeInput(false)}
          analyzing={analyzing}
        />
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    color: theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
  analyzingScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  analyzingImageContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  analyzingImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  analyzingCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  analyzingEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  analyzingTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  analyzingDescription: {
    fontSize: FontSize.base,
    color: theme.textLight,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  analyzingText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  analyzingSubtext: {
    fontSize: FontSize.base,
    color: theme.textLight,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  resultsCard: {
    marginBottom: Spacing.md,
  },
  resultsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  macroItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.backgroundGray,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  macroValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  weightCard: {
    marginBottom: Spacing.md,
  },
  weightTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  weightDescription: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginBottom: Spacing.md,
  },
  weightInputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  weightInput: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
    padding: Spacing.md,
    borderRadius: 12,
    fontSize: FontSize.base,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  recalculateButton: {
    paddingHorizontal: Spacing.lg,
  },
  actionButtons: {
    gap: Spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
});
