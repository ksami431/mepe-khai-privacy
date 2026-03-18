import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  const getMessage = () => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Keep it going!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'You\'re on fire!';
    return 'Incredible dedication!';
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.number}>{streak}</Text>
      </View>
      <Text style={styles.label}>Day Streak</Text>
      <Text style={styles.message}>{getMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  flame: {
    fontSize: 48,
    marginRight: Spacing.sm,
  },
  number: {
    fontSize: 56,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  label: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
