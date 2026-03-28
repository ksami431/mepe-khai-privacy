import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MealShareCard } from '@/components/MealShareCard';
import { MicronutrientCard } from '@/components/MicronutrientCard';
import { WaterIntakeCard } from '@/components/WaterIntakeCard';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { getMealTypeEmoji } from '@/lib/constants';
import { shareView } from '@/lib/shareUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, profile, loading: authLoading } = useAuth();
  const { foodLogs, dailyTotals, loading, refreshLogs, deleteFoodLog } = useFoodLogs();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [mealToShare, setMealToShare] = useState<any>(null);
  const shareCardRef = useRef<View>(null);

  const handleShareMeal = (log: any) => {
    setMealToShare(log);
    setShareModalVisible(true);
  };

  const handleShareImage = async () => {
    if (shareCardRef.current) {
      const success = await shareView(shareCardRef.current, `${mealToShare.meal_name} - Mepe Khai`);
      if (success) {
        setShareModalVisible(false);
      }
    }
  };

  const handleDeleteMeal = (log: any) => {
    Alert.alert(
      'Delete Meal?',
      `Remove ${log.meal_name} from your log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFoodLog(log.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  // Note: Removed automatic redirects - show appropriate message instead
  if (!authLoading && !user) {
    return (
      <View style={styles.container}>
        <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
          <Text style={styles.sectionTitle}>Please Sign In</Text>
          <Text style={{ color: theme.textLight, marginTop: Spacing.sm }}>
            Sign in to access your dashboard
          </Text>
        </Card>
      </View>
    );
  }

  if (!authLoading && user && !profile) {
    return (
      <View style={styles.container}>
        <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
          <Text style={styles.sectionTitle}>Complete Your Profile</Text>
          <Text style={{ color: theme.textLight, marginTop: Spacing.sm }}>
            Please complete the onboarding process to access your dashboard
          </Text>
        </Card>
      </View>
    );
  }

  // Use real targets from profile or defaults
  const caloriesTarget = profile?.daily_calorie_target || 2000;
  const proteinTarget = profile?.daily_protein_target || 150;
  const carbsTarget = profile?.daily_carbs_target || 200;
  const fatTarget = profile?.daily_fats_target || 67;

  // Use consumed from daily totals
  const caloriesConsumed = dailyTotals.calories;
  const protein = dailyTotals.protein;
  const carbs = dailyTotals.carbs;
  const fat = dailyTotals.fats;

  const progress = caloriesTarget > 0 ? (caloriesConsumed / caloriesTarget) * 100 : 0;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshLogs} tintColor={theme.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {profile?.full_name || 'there'}! 👋</Text>
        <Text style={styles.tagline}>Measure, Track, Transform</Text>
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Today's Summary</Text>
        
        <View style={styles.caloriesContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.caloriesInfo}>
            <Text style={styles.caloriesConsumed}>{caloriesConsumed}</Text>
            <Text style={styles.caloriesSeparator}>/</Text>
            <Text style={styles.caloriesTarget}>{caloriesTarget}</Text>
            <Text style={styles.caloriesLabel}>kcal</Text>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          <MacroItem label="Protein" value={protein} target={proteinTarget} color="#3b82f6" styles={styles} />
          <MacroItem label="Carbs" value={carbs} target={carbsTarget} color="#f59e0b" styles={styles} />
          <MacroItem label="Fat" value={fat} target={fatTarget} color="#ef4444" styles={styles} />
        </View>
      </Card>

      {/* Micronutrients Section */}
      <View style={styles.micronutrientsSection}>
        <Text style={styles.sectionTitle}>Micronutrients</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.micronutrientsScroll}
        >
          <MicronutrientCard
            label="Sugar"
            icon="🍬"
            consumed={dailyTotals.sugar}
            target={profile?.daily_sugar_limit_g || 50}
            unit="g"
            type="limit"
          />
          <MicronutrientCard
            label="Sodium"
            icon="🧂"
            consumed={dailyTotals.sodium}
            target={profile?.daily_sodium_limit_mg || 2300}
            unit="mg"
            type="limit"
          />
          <MicronutrientCard
            label="Fiber"
            icon="🌾"
            consumed={dailyTotals.fiber}
            target={profile?.daily_fiber_min_g || 30}
            unit="g"
            type="minimum"
          />
          <MicronutrientCard
            label="Potassium"
            icon="🥔"
            consumed={dailyTotals.potassium}
            target={profile?.daily_potassium_min_mg || 3400}
            unit="mg"
            type="minimum"
          />
          <MicronutrientCard
            label="Calcium"
            icon="🥛"
            consumed={dailyTotals.calcium}
            target={profile?.daily_calcium_min_mg || 1000}
            unit="mg"
            type="minimum"
          />
          <MicronutrientCard
            label="Iron"
            icon="🥩"
            consumed={dailyTotals.iron}
            target={profile?.daily_iron_min_mg || 18}
            unit="mg"
            type="minimum"
          />
          <MicronutrientCard
            label="Vit C"
            icon="🍊"
            consumed={dailyTotals.vitamin_c}
            target={profile?.daily_vitamin_c_min_mg || 90}
            unit="mg"
            type="minimum"
          />
          <MicronutrientCard
            label="Vit A"
            icon="🥕"
            consumed={dailyTotals.vitamin_a}
            target={profile?.daily_vitamin_a_min_mcg || 900}
            unit="mcg"
            type="minimum"
          />
        </ScrollView>
      </View>

      {/* Water Intake Section */}
      <WaterIntakeCard />

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionButton icon="📸" label="Log Food" onPress={() => router.push('/log-food')} styles={styles} />
          <ActionButton icon="🍽️" label="Manual Entry" onPress={() => router.push('/manual-entry')} styles={styles} />
          <ActionButton icon="⭐" label="Favorites" onPress={() => router.push('/favorites')} styles={styles} />
          <ActionButton icon="📅" label="Plan Meals" onPress={() => router.push('/meal-planner')} styles={styles} />
        </View>
      </View>

      <Card style={styles.motivationCard}>
        <Text style={styles.motivationIcon}>💪</Text>
        <Text style={styles.motivationText}>
          Great start! Keep tracking your meals to reach your goals.
        </Text>
      </Card>

      <View style={styles.mealsSection}>
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.viewAllLink}>📅 Calendar</Text>
            </TouchableOpacity>
          </View>
          {foodLogs.length === 0 ? (
            <Card style={styles.mealCard}>
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Tap "Log Food" to get started</Text>
            </Card>
          ) : (
            <>
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                const mealsOfType = foodLogs.filter(log => log.meal_type === mealType);
                if (mealsOfType.length === 0) return null;
                
                return (
                  <View key={mealType} style={styles.mealTypeSection}>
                    <Text style={styles.mealTypeTitle}>
                      {getMealTypeEmoji(mealType as any)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                    {mealsOfType.map((log) => (
                      <Card key={log.id} style={styles.mealCard}>
                        <View style={styles.mealHeader}>
                          <View style={styles.mealNameContainer}>
                            <Text style={styles.mealName}>{log.meal_name}</Text>
                            <Text style={styles.mealCalories}>{log.calories} kcal</Text>
                          </View>
                          <View style={styles.mealActions}>
                            <TouchableOpacity
                              onPress={() => handleShareMeal(log)}
                              style={styles.shareButton}
                            >
                              <Text style={styles.shareIcon}>📤</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteMeal(log)}
                              style={styles.deleteButton}
                            >
                              <Text style={styles.deleteIcon}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.mealMacros}>
                          <Text style={styles.mealMacroText}>P: {Math.round(log.protein)}g</Text>
                          <Text style={styles.mealMacroText}>C: {Math.round(log.carbs)}g</Text>
                          <Text style={styles.mealMacroText}>F: {Math.round(log.fats)}g</Text>
                          {log.weight_grams && (
                            <Text style={styles.mealMacroText}>⚖️ {log.weight_grams}g</Text>
                          )}
                        </View>
                      </Card>
                    ))}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Sami Khan Fitness</Text>
      </View>

      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.shareModalOverlay}>
          <View style={styles.shareModalContent}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>Share Meal</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Text style={styles.shareModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.shareModalScroll}
              contentContainerStyle={styles.shareModalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {mealToShare && (
                <View style={styles.shareCardContainer}>
                  <MealShareCard
                    ref={shareCardRef}
                    mealName={mealToShare.meal_name}
                    calories={mealToShare.calories}
                    protein={mealToShare.protein}
                    carbs={mealToShare.carbs}
                    fats={mealToShare.fats}
                    mealType={mealToShare.meal_type}
                    imageUrl={mealToShare.image_url}
                  />
                </View>
              )}

              <View style={styles.shareModalActions}>
                <Button
                  title="📤 Share Image"
                  onPress={handleShareImage}
                  style={styles.shareModalButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShareModalVisible(false)}
                  variant="outline"
                  style={styles.shareModalButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const MacroItem = ({ label, value, target, color, styles }: { label: string; value: number; target: number; color: string; styles: any }) => {
  const percentage = (value / target) * 100;
  
  return (
    <View style={styles.macroItem}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.macroBar}>
        <View style={[styles.macroProgress, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.macroValue}>{Math.round(value)}g / {Math.round(target)}g</Text>
    </View>
  );
};

const ActionButton = ({ icon, label, onPress, styles }: { icon: string; label: string; onPress: () => void; styles: any }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

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
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.base,
    color: theme.primary,
    fontWeight: FontWeight.semibold,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  progressText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  caloriesInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesConsumed: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  caloriesSeparator: {
    fontSize: FontSize.xl,
    color: theme.textMuted,
    marginHorizontal: Spacing.xs,
  },
  caloriesTarget: {
    fontSize: FontSize.xl,
    color: theme.textLight,
  },
  caloriesLabel: {
    fontSize: FontSize.base,
    color: theme.textLight,
    marginLeft: Spacing.xs,
  },
  macrosContainer: {
    gap: Spacing.md,
  },
  macroItem: {
    marginBottom: Spacing.sm,
  },
  macroLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  macroBar: {
    height: 8,
    backgroundColor: theme.borderLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  macroProgress: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  macroValue: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
  },
  micronutrientsSection: {
    marginBottom: Spacing.lg,
  },
  micronutrientsScroll: {
    gap: Spacing.sm,
    paddingHorizontal: 2,
  },
  quickActions: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: FontSize.sm,
    color: theme.text,
    fontWeight: FontWeight.medium,
  },
  motivationCard: {
    backgroundColor: theme.primary,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  motivationText: {
    fontSize: FontSize.base,
    color: theme.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  mealsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllLink: {
    fontSize: FontSize.sm,
    color: theme.primary,
    fontWeight: FontWeight.semibold,
  },
  mealTypeSection: {
    marginBottom: Spacing.lg,
  },
  mealTypeTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.sm,
  },
  mealCard: {
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    textAlign: 'center',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  mealNameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  mealName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    flex: 1,
  },
  mealCalories: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    marginLeft: Spacing.sm,
  },
  mealActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  shareButton: {
    padding: Spacing.xs,
  },
  shareIcon: {
    fontSize: 20,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  deleteIcon: {
    fontSize: 20,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  mealMacroText: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  mealType: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    textTransform: 'capitalize',
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    fontWeight: FontWeight.medium,
  },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModalContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  shareModalScroll: {
    flex: 1,
  },
  shareModalScrollContent: {
    paddingBottom: Spacing.lg,
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareModalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  shareModalClose: {
    fontSize: 28,
    color: theme.textLight,
    padding: Spacing.xs,
  },
  shareCardContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareModalActions: {
    gap: Spacing.sm,
  },
  shareModalButton: {
    width: '100%',
  },
});
