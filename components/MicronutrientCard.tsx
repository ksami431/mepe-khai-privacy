import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface MicronutrientCardProps {
  label: string;
  icon: string;
  consumed: number;
  target: number;
  unit: string;
  type: 'limit' | 'minimum'; // limit = don't exceed, minimum = must reach
}

export function MicronutrientCard({ label, icon, consumed, target, unit, type }: MicronutrientCardProps) {
  const { theme } = useTheme();
  
  // Calculate percentage
  const percentage = Math.min(100, (consumed / target) * 100);
  
  // Determine color based on type and percentage
  const getColor = () => {
    if (type === 'limit') {
      // For limits (like sugar, sodium) - red if exceeding
      if (percentage > 100) return '#ef4444'; // red
      if (percentage > 80) return '#f59e0b'; // yellow/orange
      return '#10b981'; // green
    } else {
      // For minimums (like fiber, vitamins) - green if meeting
      if (percentage >= 100) return '#10b981'; // green
      if (percentage >= 70) return '#f59e0b'; // yellow
      return '#ef4444'; // red
    }
  };
  
  const color = getColor();
  const styles = createStyles(theme, color);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.consumed}>
          {Math.round(consumed)}<Text style={styles.unit}>{unit}</Text>
        </Text>
        <Text style={styles.target}>
          / {target}{unit}
        </Text>
      </View>
      
      {type === 'limit' && percentage > 100 && (
        <Text style={styles.warning}>Over limit!</Text>
      )}
      {type === 'minimum' && percentage < 100 && (
        <Text style={styles.warning}>Below target</Text>
      )}
    </View>
  );
}

const createStyles = (theme: any, color: string) => StyleSheet.create({
  card: {
    backgroundColor: theme.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: theme.borderLight,
    minWidth: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    flex: 1,
  },
  progressContainer: {
    marginVertical: Spacing.xs,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.backgroundGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: color,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  consumed: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  unit: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
    color: theme.textLight,
  },
  target: {
    fontSize: FontSize.xs,
    color: theme.textLight,
  },
  warning: {
    fontSize: FontSize.xs,
    color: '#ef4444',
    marginTop: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
});
