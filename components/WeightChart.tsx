import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight } from '@/constants/theme';

interface WeightLog {
  weight_kg: number;
  logged_at: string;
}

interface WeightChartProps {
  data: WeightLog[];
  goalWeight?: number;
}

export function WeightChart({ data, goalWeight }: WeightChartProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width - Spacing.lg * 2 - Spacing.lg * 2;
  
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          No weight data yet. Start logging your weight to see your progress!
        </Text>
      </View>
    );
  }

  const weights = data.map(d => d.weight_kg);
  const maxWeight = Math.max(...weights, goalWeight || 0);
  const minWeight = Math.min(...weights, goalWeight || Infinity);
  const range = maxWeight - minWeight || 10;
  const chartHeight = 200;

  const getY = (weight: number) => {
    return chartHeight - ((weight - minWeight + range * 0.1) / (range * 1.2)) * chartHeight;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {maxWeight.toFixed(1)}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {((maxWeight + minWeight) / 2).toFixed(1)}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {minWeight.toFixed(1)}
          </Text>
        </View>

        {/* Chart area */}
        <View style={[styles.chart, { width: screenWidth }]}>
          {/* Goal line */}
          {goalWeight && goalWeight >= minWeight && goalWeight <= maxWeight && (
            <View
              style={[
                styles.goalLine,
                { 
                  top: getY(goalWeight),
                  backgroundColor: theme.secondary,
                }
              ]}
            />
          )}

          {/* Data points and line */}
          {data.length > 1 && (
            <View style={StyleSheet.absoluteFill}>
              {data.map((point, index) => {
                if (index === 0) return null;
                const prevPoint = data[index - 1];
                const x1 = ((data.length - 1 - index) / (data.length - 1)) * screenWidth;
                const x2 = ((data.length - index) / (data.length - 1)) * screenWidth;
                const y1 = getY(prevPoint.weight_kg);
                const y2 = getY(point.weight_kg);

                const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

                return (
                  <View
                    key={point.logged_at}
                    style={[
                      styles.line,
                      {
                        left: x1,
                        top: y1,
                        width,
                        transform: [{ rotate: `${angle}deg` }],
                        backgroundColor: theme.primary,
                      }
                    ]}
                  />
                );
              })}
            </View>
          )}

          {/* Points */}
          {data.map((point, index) => {
            const x = ((data.length - 1 - index) / (data.length - 1)) * screenWidth;
            const y = getY(point.weight_kg);

            return (
              <View
                key={point.logged_at}
                style={[
                  styles.point,
                  {
                    left: x - 4,
                    top: y - 4,
                    backgroundColor: theme.primary,
                    borderColor: theme.white,
                  }
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* X-axis labels */}
      <View style={[styles.xAxis, { width: screenWidth, marginLeft: 40 }]}>
        {data.slice(0, Math.min(data.length, 5)).map((point, index) => {
          if (index % Math.ceil(data.length / 5) !== 0 && index !== data.length - 1) return null;
          return (
            <Text
              key={point.logged_at}
              style={[styles.xAxisLabel, { color: theme.textLight }]}
            >
              {formatDate(point.logged_at)}
            </Text>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.legendText, { color: theme.textLight }]}>Your Weight</Text>
        </View>
        {goalWeight && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: theme.secondary }]} />
            <Text style={[styles.legendText, { color: theme.textLight }]}>Goal: {goalWeight}kg</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.base,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: Spacing.xs,
  },
  axisLabel: {
    fontSize: FontSize.xs,
    textAlign: 'right',
  },
  chart: {
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.5,
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  xAxisLabel: {
    fontSize: FontSize.xs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLine: {
    width: 16,
    height: 2,
  },
  legendText: {
    fontSize: FontSize.sm,
  },
});
