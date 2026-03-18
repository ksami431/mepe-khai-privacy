import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { calculateMacroPercentages } from '@/lib/shareUtils';

interface MealShareCardProps {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType?: string;
  imageUrl?: string;
}

export const MealShareCard = React.forwardRef<View, MealShareCardProps>((props, ref) => {
  const { theme } = useTheme();
  const { mealName, calories, protein, carbs, fats, mealType, imageUrl } = props;
  
  const macroPercentages = calculateMacroPercentages({ mealName, calories, protein, carbs, fats });
  
  const getMealTypeEmoji = (type?: string) => {
    if (!type) return '🍴';
    const emojis: Record<string, string> = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎',
    };
    return emojis[type.toLowerCase()] || '🍴';
  };

  const styles = createStyles(theme);

  return (
    <View ref={ref} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Mepe Khai</Text>
        <Text style={styles.tagline}>Measure, Track, Transform</Text>
      </View>

      {/* Meal Image (if available) */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.mealImage} />
        </View>
      )}

      {/* Meal Info */}
      <View style={styles.mealInfo}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealEmoji}>{getMealTypeEmoji(mealType)}</Text>
          {mealType && (
            <Text style={styles.mealType}>{mealType.toUpperCase()}</Text>
          )}
        </View>
        <Text style={styles.mealName}>{mealName}</Text>
      </View>

      {/* Calories */}
      <View style={styles.caloriesSection}>
        <Text style={styles.caloriesValue}>{calories}</Text>
        <Text style={styles.caloriesLabel}>Calories</Text>
      </View>

      {/* Macros */}
      <View style={styles.macrosSection}>
        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>💪</Text>
          <Text style={styles.macroValue}>{protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroPercent}>{macroPercentages.protein}%</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>🍞</Text>
          <Text style={styles.macroValue}>{carbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroPercent}>{macroPercentages.carbs}%</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>🥑</Text>
          <Text style={styles.macroValue}>{fats}g</Text>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroPercent}>{macroPercentages.fats}%</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🤖 AI-Powered Diet Tracking</Text>
      </View>
    </View>
  );
});

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    fontStyle: 'italic',
  },
  imageContainer: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  mealInfo: {
    marginBottom: Spacing.lg,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mealEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  mealType: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    letterSpacing: 1,
  },
  mealName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    lineHeight: 28,
  },
  caloriesSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: theme.primaryLight,
    borderRadius: BorderRadius.md,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    marginBottom: Spacing.xs,
  },
  caloriesLabel: {
    fontSize: FontSize.base,
    color: theme.textLight,
    fontWeight: FontWeight.semibold,
  },
  macrosSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  macroValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: FontSize.xs,
    color: theme.textLight,
    marginBottom: 2,
  },
  macroPercent: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
  },
});
