import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { usePlannedMeals } from '@/hooks/usePlannedMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function MealPlannerScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(getNextSevenDays()[0]);
  
  const startDate = getNextSevenDays()[0];
  const endDate = getNextSevenDays()[6];
  
  const { plannedMeals, loading, createPlannedMeal, deletePlannedMeal, getMealsForDate, getTotalNutritionForDate } = usePlannedMeals(startDate, endDate);
  const { favorites } = useFavorites();

  const dates = getNextSevenDays();

  const handleAddMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (favorites.length === 0) {
      Alert.alert(
        'No Favorites',
        'You need to save some favorite meals first. Log a meal and save it as a favorite!',
        [{ text: 'OK' }]
      );
      return;
    }

    const favNames = favorites.map((fav, idx) => `${idx + 1}. ${fav.meal_name} (${fav.calories} kcal)`).join('\n');
    
    Alert.prompt(
      'Add Planned Meal',
      `Select a favorite by number or enter a custom meal name:\n\n${favNames}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (input?: string) => {
            if (!input || !input.trim()) return;
            
            const inputNum = parseInt(input);
            let mealData: any;
            
            if (!isNaN(inputNum) && inputNum >= 1 && inputNum <= favorites.length) {
              const fav = favorites[inputNum - 1];
              mealData = {
                planned_date: date,
                meal_type: mealType,
                meal_name: fav.meal_name,
                calories: fav.calories,
                protein: fav.protein,
                carbs: fav.carbs,
                fats: fav.fats,
                weight_grams: fav.weight_grams || undefined,
              };
            } else {
              mealData = {
                planned_date: date,
                meal_type: mealType,
                meal_name: input.trim(),
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
              };
            }

            try {
              await createPlannedMeal(mealData);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to add planned meal');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    Alert.alert(
      'Delete Planned Meal?',
      'Remove this meal from your plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlannedMeal(mealId);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text style={styles.headerTitle}>7-Day Meal Planner</Text>
        <Text style={styles.headerDescription}>
          Plan your meals for the next week
        </Text>
      </Card>

      {dates.map((date) => {
        const mealsForDate = getMealsForDate(date);
        const totals = getTotalNutritionForDate(date);
        const dayName = getDayName(date);
        const formattedDate = formatDate(date);

        return (
          <Card key={date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayName}>{dayName}</Text>
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
              {mealsForDate.length > 0 && (
                <Text style={styles.dayTotal}>{totals.calories} kcal</Text>
              )}
            </View>

            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const mealTypeMeals = mealsForDate.filter(m => m.meal_type === mealType);

              return (
                <View key={mealType} style={styles.mealTypeSection}>
                  <View style={styles.mealTypeHeader}>
                    <Text style={styles.mealTypeTitle}>
                      {getMealTypeEmoji(mealType as any)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                    <TouchableOpacity onPress={() => handleAddMeal(date, mealType as any)}>
                      <Text style={styles.addButton}>+ Add</Text>
                    </TouchableOpacity>
                  </View>

                  {mealTypeMeals.length === 0 ? (
                    <Text style={styles.emptyText}>No meal planned</Text>
                  ) : (
                    mealTypeMeals.map((meal) => (
                      <View key={meal.id} style={styles.mealItem}>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{meal.meal_name}</Text>
                          {meal.calories > 0 && (
                            <Text style={styles.mealNutrition}>
                              {meal.calories} kcal • P:{Math.round(meal.protein)}g C:{Math.round(meal.carbs)}g F:{Math.round(meal.fats)}g
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteMeal(meal.id)}>
                          <Text style={styles.deleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              );
            })}
          </Card>
        );
      })}
    </ScrollView>
  );
}

function getNextSevenDays(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function getDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getMealTypeEmoji(mealType: string): string {
  const emojis: Record<string, string> = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
  };
  return emojis[mealType] || '🍴';
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
  },
  content: {
    padding: Spacing.lg,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.sm,
  },
  headerDescription: {
    fontSize: FontSize.base,
    color: theme.textLight,
    textAlign: 'center',
  },
  dayCard: {
    marginBottom: Spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  dayName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  dateText: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginTop: 2,
  },
  dayTotal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  mealTypeSection: {
    marginBottom: Spacing.md,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  mealTypeTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
  },
  addButton: {
    fontSize: FontSize.sm,
    color: theme.primary,
    fontWeight: FontWeight.semibold,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    fontStyle: 'italic',
    marginLeft: Spacing.md,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.backgroundGray,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: theme.text,
    marginBottom: 2,
  },
  mealNutrition: {
    fontSize: FontSize.xs,
    color: theme.textLight,
  },
  deleteIcon: {
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
});
