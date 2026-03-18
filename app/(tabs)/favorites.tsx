import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFavorites } from '@/hooks/useFavorites';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { getMealTypeEmoji } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, loading, deleteFavorite, updateLastUsed } = useFavorites();
  const { createFoodLog } = useFoodLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [logging, setLogging] = useState<string | null>(null);
  const styles = createStyles(theme);

  const filteredFavorites = favorites.filter(fav =>
    fav.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogFavorite = async (favorite: typeof favorites[0]) => {
    setLogging(favorite.id);
    try {
      await createFoodLog({
        meal_name: favorite.meal_name,
        meal_type: favorite.meal_type,
        calories: favorite.calories,
        protein: favorite.protein,
        carbs: favorite.carbs,
        fats: favorite.fats,
        weight_grams: favorite.weight_grams || undefined,
        logged_at: new Date().toISOString(),
        image_url: null,
        ai_analyzed: false,
      });

      await updateLastUsed(favorite.id);

      Alert.alert(
        'Success!',
        `${favorite.meal_name} logged successfully!`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log food');
    } finally {
      setLogging(null);
    }
  };

  const handleDeleteFavorite = (favorite: typeof favorites[0]) => {
    Alert.alert(
      'Delete Favorite',
      `Remove "${favorite.meal_name}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFavorite(favorite.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete favorite');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Favorite Foods</Text>
        <Text style={styles.subtitle}>Quick log your frequently eaten meals</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search favorites..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textMuted}
        />
      </View>

      {filteredFavorites.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No favorites found' : 'No favorites yet'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try a different search term'
              : 'Save your frequently eaten foods for quick logging'}
          </Text>
          {!searchQuery && (
            <Button
              title="Log a Meal"
              onPress={() => router.push('/log-food')}
              style={styles.emptyButton}
            />
          )}
        </Card>
      ) : (
        filteredFavorites.map((favorite) => (
          <Card key={favorite.id} style={styles.favoriteCard}>
            <View style={styles.favoriteHeader}>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>
                  {getMealTypeEmoji(favorite.meal_type)} {favorite.meal_name}
                </Text>
                <Text style={styles.favoriteCalories}>{favorite.calories} kcal</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteFavorite(favorite)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.favoriteMacros}>
              <Text style={styles.macroText}>P: {Math.round(favorite.protein)}g</Text>
              <Text style={styles.macroText}>C: {Math.round(favorite.carbs)}g</Text>
              <Text style={styles.macroText}>F: {Math.round(favorite.fats)}g</Text>
              {favorite.weight_grams && (
                <Text style={styles.macroText}>⚖️ {favorite.weight_grams}g</Text>
              )}
            </View>

            <Button
              title={logging === favorite.id ? 'Logging...' : 'Log This Meal'}
              onPress={() => handleLogFavorite(favorite)}
              disabled={logging === favorite.id}
              style={styles.logButton}
            />
          </Card>
        ))
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: theme.textLight,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchInput: {
    backgroundColor: theme.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSize.base,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
  favoriteCard: {
    marginBottom: Spacing.md,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  favoriteInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  favoriteName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  favoriteCalories: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  deleteIcon: {
    fontSize: 20,
  },
  favoriteMacros: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  macroText: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  logButton: {
    marginTop: Spacing.sm,
  },
});
