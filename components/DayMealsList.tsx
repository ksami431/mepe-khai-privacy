import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { getMealTypeEmoji } from '@/lib/constants';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface Meal {
  id: string;
  meal_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logged_at: string;
}

interface DayMealsListProps {
  date: Date;
  meals: Meal[];
}

export const DayMealsList: React.FC<DayMealsListProps> = ({ date, meals }) => {
  const groupedMeals = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack'),
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (meals.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>No meals logged on {dateString}</Text>
      </Card>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.dateCard}>
        <Text style={styles.dateText}>{dateString}</Text>
      </Card>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Calories:</Text>
          <Text style={styles.summaryValue}>{Math.round(totalCalories)} kcal</Text>
        </View>
        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={styles.macroValue}>{Math.round(totalFats)}g</Text>
          </View>
        </View>
      </Card>

      {Object.entries(groupedMeals).map(([mealType, typeMeals]) => {
        if (typeMeals.length === 0) return null;

        return (
          <View key={mealType} style={styles.mealTypeSection}>
            <Text style={styles.mealTypeTitle}>
              {getMealTypeEmoji(mealType as any)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>
            {typeMeals.map((meal) => (
              <Card key={meal.id} style={styles.mealCard}>
                <Text style={styles.mealName}>{meal.meal_name}</Text>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealCalories}>{Math.round(meal.calories)} kcal</Text>
                  <Text style={styles.mealMacros}>
                    P: {Math.round(meal.protein)}g · C: {Math.round(meal.carbs)}g · F: {Math.round(meal.fats)}g
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateCard: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.base,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  macroValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  mealTypeSection: {
    marginBottom: Spacing.lg,
  },
  mealTypeTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  mealCard: {
    marginBottom: Spacing.sm,
  },
  mealName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  mealMacros: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
