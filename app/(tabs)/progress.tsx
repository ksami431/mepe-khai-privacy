import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatsCard } from '@/components/StatsCard';
import { StreakBadge } from '@/components/StreakBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ExportModal } from '@/components/ExportModal';
import { WeightChart } from '@/components/WeightChart';
import { WeightEntryModal } from '@/components/WeightEntryModal';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { calculateWeeklyStats, calculateMonthlyStats } from '@/lib/statsCalculations';
import { exportToCSV, exportToPDF } from '@/lib/exportData';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type TimePeriod = 'week' | 'month';

export default function ProgressScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { getFoodLogsByDateRange } = useFoodLogs();
  const { weightLogs, weightTrend, latestWeight, createWeightLog } = useWeightLogs(90);
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [foodLogsData, setFoodLogsData] = useState<any[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const daysBack = period === 'week' ? 7 : 30;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      const logs = await getFoodLogsByDateRange(
        startDate.toISOString(),
        now.toISOString()
      );

      setFoodLogsData(logs);
      const calorieTarget = profile?.daily_calorie_target || 2000;
      
      if (period === 'week') {
        const weeklyStats = calculateWeeklyStats(logs, [], calorieTarget);
        setStats(weeklyStats);
      } else {
        const monthlyStats = calculateMonthlyStats(logs, [], calorieTarget);
        setStats(monthlyStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleExportCSV = async () => {
    try {
      await exportToCSV(foodLogsData, [], stats);
    } catch (error) {
      throw error;
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(foodLogsData, [], stats, profile?.full_name || 'User');
    } catch (error) {
      throw error;
    }
  };

  const isWeekly = period === 'week';
  const periodDays = isWeekly ? 7 : 30;
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>📊 Your Progress</Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => setShowExportModal(true)}
          >
            <Text style={styles.exportIcon}>📥</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {stats && stats.daysLogged > 0 ? (
        <>
          {!isWeekly && 'streak' in stats && (
            <StreakBadge streak={stats.streak} />
          )}

          <View style={styles.statsGrid}>
            <StatsCard
              icon="📅"
              label="Days Logged"
              value={`${stats.daysLogged}/${periodDays}`}
              subtitle={`${Math.round((stats.daysLogged / periodDays) * 100)}% consistency`}
            />
            <StatsCard
              icon="🔥"
              label="Avg Calories"
              value={Math.round(stats.avgCalories)}
              subtitle={`vs ${profile?.daily_calorie_target || 2000} target`}
              color={stats.adherence >= 90 && stats.adherence <= 110 ? '#22c55e' : '#f59e0b'}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatsCard
              icon="💪"
              label="Avg Protein"
              value={`${Math.round(stats.avgProtein)}g`}
              subtitle="per day"
            />
            <StatsCard
              icon="🍞"
              label="Avg Carbs"
              value={`${Math.round(stats.avgCarbs)}g`}
              subtitle="per day"
            />
            <StatsCard
              icon="🥑"
              label="Avg Fats"
              value={`${Math.round(stats.avgFats)}g`}
              subtitle="per day"
            />
          </View>

          <Card style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>💡 Insights</Text>
            {stats.adherence >= 90 && stats.adherence <= 110 && (
              <Text style={styles.insightText}>✅ Great job staying on target!</Text>
            )}
            {stats.avgProtein >= (profile?.daily_protein_target || 150) && (
              <Text style={styles.insightText}>💪 Excellent protein intake!</Text>
            )}
            {stats.daysLogged >= periodDays * 0.8 && (
              <Text style={styles.insightText}>🎯 Amazing consistency!</Text>
            )}
            {stats.daysLogged < periodDays * 0.5 && (
              <Text style={styles.insightText}>📝 Try logging more days for better insights</Text>
            )}
          </Card>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>
            Start logging your meals to see your progress stats!
          </Text>
        </Card>
      )}

      <View style={styles.progressPhotosSection}>
        <Button
          title="📷 View Progress Photos"
          onPress={() => router.push('/progress-photos')}
          variant="outline"
        />
      </View>

      <Card style={styles.weightCard}>
        <View style={styles.weightHeader}>
          <Text style={styles.weightTitle}>⚖️ Weight Tracking</Text>
          <TouchableOpacity
            style={styles.logWeightButton}
            onPress={() => setShowWeightModal(true)}
          >
            <Text style={styles.logWeightText}>+ Log Weight</Text>
          </TouchableOpacity>
        </View>

        {latestWeight && (
          <View style={styles.currentWeight}>
            <Text style={styles.currentWeightLabel}>Current Weight</Text>
            <Text style={styles.currentWeightValue}>{latestWeight.toFixed(1)} kg</Text>
            {weightTrend.change !== 0 && (
              <Text style={[
                styles.weightChange,
                { color: weightTrend.change < 0 ? theme.success : theme.error }
              ]}>
                {weightTrend.change > 0 ? '+' : ''}{weightTrend.change.toFixed(1)} kg
                ({weightTrend.percentChange > 0 ? '+' : ''}{weightTrend.percentChange.toFixed(1)}%)
              </Text>
            )}
          </View>
        )}

        <WeightChart 
          data={weightLogs} 
          goalWeight={profile?.goal_weight_kg || undefined}
        />
      </Card>

      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      <WeightEntryModal
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onSave={createWeightLog}
        currentWeight={latestWeight || profile?.weight_kg || undefined}
      />
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  exportButton: {
    padding: Spacing.sm,
  },
  exportIcon: {
    fontSize: 28,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: theme.white,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.primary,
  },
  periodButtonText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    fontWeight: FontWeight.medium,
  },
  periodButtonTextActive: {
    color: theme.white,
    fontWeight: FontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  insightsCard: {
    marginTop: Spacing.md,
  },
  insightsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  insightText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    marginBottom: Spacing.sm,
    lineHeight: 22,
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
  progressPhotosSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  weightCard: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weightTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  logWeightButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: theme.primary,
  },
  logWeightText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: theme.white,
  },
  currentWeight: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: theme.backgroundGray,
    borderRadius: BorderRadius.md,
  },
  currentWeightLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  currentWeightValue: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    marginBottom: Spacing.xs,
  },
  weightChange: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
});
