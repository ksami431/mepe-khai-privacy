import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Card } from './Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useWaterLogs } from '@/hooks/useWaterLogs';

export function WaterIntakeCard() {
  const { theme } = useTheme();
  const { waterLogs, createWaterLog, deleteWaterLog, waterTarget } = useWaterLogs();
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async (amount_ml: number) => {
    if (adding) return;
    
    setAdding(true);
    try {
      await createWaterLog(amount_ml);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log water');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry?',
      'Remove this water log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWaterLog(id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete water log');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Water Intake</Text>
        <Text style={styles.subtitle}>Stay hydrated!</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.circleContainer}>
          <View style={styles.circleBackground}>
            <View style={styles.circleText}>
              <Text style={styles.progressPercentage}>
                {Math.round(waterTarget.progress_percentage)}%
              </Text>
              <Text style={styles.progressLabel}>
                {waterTarget.consumed_ml}ml
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{waterTarget.glasses_consumed}</Text>
            <Text style={styles.statLabel}>Glasses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{waterTarget.daily_goal_ml}ml</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{waterTarget.remaining_ml}ml</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsLabel}>Quick Add:</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickAdd(250)}
            disabled={adding}
          >
            <Text style={styles.quickButtonText}>+250ml</Text>
            <Text style={styles.quickButtonSubtext}>1 glass</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickAdd(500)}
            disabled={adding}
          >
            <Text style={styles.quickButtonText}>+500ml</Text>
            <Text style={styles.quickButtonSubtext}>2 glasses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickAdd(750)}
            disabled={adding}
          >
            <Text style={styles.quickButtonText}>+750ml</Text>
            <Text style={styles.quickButtonSubtext}>Bottle</Text>
          </TouchableOpacity>
        </View>
      </View>

      {waterLogs.length > 0 && (
        <View style={styles.logsSection}>
          <Text style={styles.logsTitle}>Today's Logs:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.logsContainer}
          >
            {waterLogs.map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.logItem}
                onLongPress={() => handleDelete(log.id)}
              >
                <Text style={styles.logAmount}>{log.amount_ml}ml</Text>
                <Text style={styles.logTime}>
                  {new Date(log.logged_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.logsHint}>Long press to delete</Text>
        </View>
      )}
    </Card>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginTop: 2,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  circleContainer: {
    width: 110,
    height: 110,
  },
  circleBackground: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.backgroundGray,
    borderWidth: 8,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  progressLabel: {
    fontSize: FontSize.xs,
    color: theme.textLight,
  },
  stats: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  quickActions: {
    marginBottom: Spacing.md,
  },
  quickActionsLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickButton: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  quickButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  quickButtonSubtext: {
    fontSize: FontSize.xs,
    color: theme.textLight,
    marginTop: 2,
  },
  logsSection: {
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    paddingTop: Spacing.sm,
  },
  logsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  logsContainer: {
    gap: Spacing.xs,
  },
  logItem: {
    backgroundColor: theme.backgroundGray,
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  logAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: theme.primary,
  },
  logTime: {
    fontSize: FontSize.xs,
    color: theme.textLight,
  },
  logsHint: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
