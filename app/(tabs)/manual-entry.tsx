import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MealTypeSelector, MealType } from '@/components/MealTypeSelector';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { useFavorites } from '@/hooks/useFavorites';
import { analyzeTextFood } from '@/lib/gemini';
import { getMealTypeByTime } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type EntryMode = 'ai-assisted' | 'manual';

export default function ManualEntryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { createFoodLog } = useFoodLogs();
  const { favorites, updateLastUsed } = useFavorites();
  
  const [mode, setMode] = useState<EntryMode>('ai-assisted');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Common fields
  const [foodName, setFoodName] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const styles = createStyles(theme);

  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  
  // AI analysis results
  const [aiResults, setAiResults] = useState<any>(null);

  useEffect(() => {
    setSelectedMealType(getMealTypeByTime());
  }, []);

  const resetForm = () => {
    setFoodName('');
    setWeight('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setAiResults(null);
    setSelectedMealType(getMealTypeByTime());
  };

  const handleAIAnalysis = async () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    setAnalyzing(true);
    try {
      let query = foodName.trim();
      if (weight.trim()) {
        query += ` (${weight}g)`;
      }
      
      const analysis = await analyzeTextFood(query, weight ? parseFloat(weight) : undefined);
      setAiResults(analysis);
      
      // Pre-fill fields with AI results
      setCalories(analysis.calories.toString());
      setProtein(analysis.protein.toString());
      setCarbs(analysis.carbs.toString());
      setFats(analysis.fats.toString());
    } catch (error: any) {
      Alert.alert('Analysis Failed', error.message || 'Failed to analyze food');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    if (!calories || !protein || !carbs || !fats) {
      Alert.alert('Error', 'Please fill in all nutrition values');
      return;
    }

    const caloriesNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);
    const carbsNum = parseFloat(carbs);
    const fatsNum = parseFloat(fats);

    if (isNaN(caloriesNum) || isNaN(proteinNum) || isNaN(carbsNum) || isNaN(fatsNum)) {
      Alert.alert('Error', 'Please enter valid numbers for nutrition values');
      return;
    }

    setSaving(true);
    try {
      await createFoodLog({
        meal_name: foodName.trim(),
        meal_type: selectedMealType,
        calories: caloriesNum,
        protein: proteinNum,
        carbs: carbsNum,
        fats: fatsNum,
        logged_at: new Date().toISOString(),
        image_url: null,
        ai_analyzed: mode === 'ai-assisted',
        weight_grams: weight.trim() ? parseFloat(weight) : undefined,
      });

      Alert.alert(
        'Success!',
        `${foodName} logged successfully!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save food log');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Sign In Required</Text>
        </Card>
      </View>
    );
  }

  const handleSelectFavorite = async (favorite: typeof favorites[0]) => {
    setFoodName(favorite.meal_name);
    setWeight(favorite.weight_grams?.toString() || '');
    setCalories(favorite.calories.toString());
    setProtein(favorite.protein.toString());
    setCarbs(favorite.carbs.toString());
    setFats(favorite.fats.toString());
    setSelectedMealType(favorite.meal_type);
    setAiResults(null);
    await updateLastUsed(favorite.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Manual Food Entry</Text>
        <Text style={styles.description}>
          {mode === 'ai-assisted' 
            ? 'Enter food name and weight for AI estimation'
            : 'Enter all nutrition values manually'}
        </Text>
      </Card>

      {favorites.length > 0 && (
        <Card style={styles.favoritesCard}>
          <Text style={styles.favoritesTitle}>⭐ Quick Select from Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesScroll}>
            {favorites.slice(0, 5).map((fav) => (
              <TouchableOpacity
                key={fav.id}
                style={styles.favoriteChip}
                onPress={() => handleSelectFavorite(fav)}
              >
                <Text style={styles.favoriteChipText}>{fav.meal_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => router.push('/favorites')}>
            <Text style={styles.viewAllLink}>View All Favorites →</Text>
          </TouchableOpacity>
        </Card>
      )}

      <Card style={styles.modeCard}>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'ai-assisted' && styles.modeButtonActive]}
            onPress={() => {
              setMode('ai-assisted');
              resetForm();
            }}
          >
            <Text style={[styles.modeButtonText, mode === 'ai-assisted' && styles.modeButtonTextActive]}>
              🤖 AI-Assisted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'manual' && styles.modeButtonActive]}
            onPress={() => {
              setMode('manual');
              resetForm();
            }}
          >
            <Text style={[styles.modeButtonText, mode === 'manual' && styles.modeButtonTextActive]}>
              ✏️ Full Manual
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.formCard}>
        <Input
          label="Food Name"
          value={foodName}
          onChangeText={setFoodName}
          placeholder="e.g., Chicken breast"
        />

        <Input
          label="Weight (grams) - Optional"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g., 150"
          keyboardType="numeric"
        />

        {mode === 'ai-assisted' ? (
          <>
            <Button
              title={analyzing ? 'Analyzing...' : 'Analyze with AI'}
              onPress={handleAIAnalysis}
              disabled={analyzing || !foodName.trim()}
              style={styles.analyzeButton}
            />

            {analyzing && <LoadingSpinner />}

            {aiResults && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>AI Estimation (you can adjust):</Text>
                <Input
                  label="Calories"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
                <Input
                  label="Protein (g)"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
                <Input
                  label="Carbs (g)"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
                <Input
                  label="Fats (g)"
                  value={fats}
                  onChangeText={setFats}
                  keyboardType="numeric"
                />
              </View>
            )}
          </>
        ) : (
          <>
            <Input
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g., 250"
              keyboardType="numeric"
            />
            <Input
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              placeholder="e.g., 30"
              keyboardType="numeric"
            />
            <Input
              label="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              placeholder="e.g., 0"
              keyboardType="numeric"
            />
            <Input
              label="Fats (g)"
              value={fats}
              onChangeText={setFats}
              placeholder="e.g., 5"
              keyboardType="numeric"
            />
          </>
        )}

        <MealTypeSelector
          selectedType={selectedMealType}
          onSelect={setSelectedMealType}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={saving ? 'Saving...' : 'Save Food Log'}
            onPress={handleSave}
            disabled={saving || !foodName.trim() || !calories || !protein || !carbs || !fats}
          />
          <Button
            title="Clear"
            onPress={resetForm}
            variant="outline"
          />
        </View>
      </Card>
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
  card: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    color: theme.textLight,
    textAlign: 'center',
  },
  favoritesCard: {
    marginBottom: Spacing.lg,
  },
  favoritesTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.sm,
  },
  favoritesScroll: {
    marginBottom: Spacing.sm,
  },
  favoriteChip: {
    backgroundColor: theme.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  favoriteChipText: {
    color: theme.textMuted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  viewAllLink: {
    color: theme.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  modeCard: {
    marginBottom: Spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: theme.backgroundGray,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: theme.primary,
  },
  modeButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.textLight,
  },
  modeButtonTextActive: {
    color: theme.textMuted,
  },
  formCard: {
    gap: Spacing.md,
  },
  analyzeButton: {
    marginTop: Spacing.sm,
  },
  resultsContainer: {
    marginTop: Spacing.md,
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: theme.borderLight,
  },
  resultsTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  buttonContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
