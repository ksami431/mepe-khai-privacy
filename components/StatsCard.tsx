import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: '↑' | '↓' | '→';
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  trend,
  color = Colors.primary,
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {trend && (
          <Text style={[styles.trend, getTrendColor(trend)]}>{trend}</Text>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
};

const getTrendColor = (trend: '↑' | '↓' | '→') => {
  switch (trend) {
    case '↑': return { color: '#22c55e' };
    case '↓': return { color: '#ef4444' };
    case '→': return { color: Colors.textMuted };
  }
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  trend: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
