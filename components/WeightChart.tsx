import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
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
  // Use minimum width to ensure chart is always readable
  const chartPadding = 30;
  const screenWidth = Dimensions.get('window').width - Spacing.lg * 2 - 40; // 40 for y-axis
  const minChartWidth = Math.max(screenWidth, data.length * 80); // Ensure enough space per data point
  const chartWidth = minChartWidth - chartPadding * 2;
  
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
  const chartHeight = 250;
  const labelTopPadding = 35; // Space for weight labels above points
  
  // Add padding to range for visual spacing (10% on top and bottom)
  const paddedMax = maxWeight + range * 0.1;
  const paddedMin = minWeight - range * 0.1;
  const paddedRange = paddedMax - paddedMin;

  const getY = (weight: number) => {
    // Calculate Y position based on padded range for accurate positioning
    // Add offset to account for label space at top
    return labelTopPadding + (chartHeight - labelTopPadding) - ((weight - paddedMin) / paddedRange) * (chartHeight - labelTopPadding);
  };

  const formatDate = (dateString: string) => {
    // Handle both ISO timestamps and date-only strings
    const date = dateString.includes('T') 
      ? new Date(dateString)
      : new Date(dateString + 'T12:00:00'); // Add noon time to avoid day shift
    
    // Use UTC methods to avoid timezone conversion
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${month}/${day}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { height: chartHeight + labelTopPadding }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {paddedMax.toFixed(1)}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {((paddedMax + paddedMin) / 2).toFixed(1)}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textLight }]}>
            {paddedMin.toFixed(1)}
          </Text>
        </View>

        {/* Scrollable Chart area */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.chartScroll}
        >
          <View style={[styles.chart, { width: minChartWidth }]}>
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
                const x1 = chartPadding + ((index - 1) / (data.length - 1)) * chartWidth;
                const x2 = chartPadding + (index / (data.length - 1)) * chartWidth;
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

          {/* Points with weight labels */}
          {data.map((point, index) => {
            const x = chartPadding + (index / (data.length - 1)) * chartWidth;
            const y = getY(point.weight_kg);
            const isLatest = index === data.length - 1;
            const isFirst = index === 0;
            // Show all labels since we have scrollable space
            const showLabel = true;

            return (
              <View key={point.logged_at}>
                <View
                  style={[
                    styles.point,
                    {
                      left: x - (isLatest ? 6 : 4),
                      top: y - (isLatest ? 6 : 4),
                      backgroundColor: theme.primary,
                      borderColor: theme.white,
                      width: isLatest ? 12 : 8,
                      height: isLatest ? 12 : 8,
                      borderRadius: isLatest ? 6 : 4,
                    }
                  ]}
                />
                {showLabel && (
                  <Text
                    style={[
                      styles.weightLabel,
                      {
                        left: x - 22,
                        top: y - 30,
                        color: theme.text,
                        fontWeight: isLatest ? '700' : '600',
                        fontSize: FontSize.sm,
                      }
                    ]}
                  >
                    {point.weight_kg.toFixed(1)} kg
                  </Text>
                )}
              </View>
            );
          })}
          </View>
        </ScrollView>
      </View>

      {/* X-axis labels */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.xAxisScroll}
      >
        <View style={[styles.xAxis, { width: minChartWidth, marginLeft: 40 }]}>
        {data.map((point, index) => {
          // Show first, last, and every nth date to avoid overcrowding
          const showEveryNth = Math.max(1, Math.floor(data.length / 4));
          const shouldShow = index === 0 || index === data.length - 1 || index % showEveryNth === 0;
          if (!shouldShow) return null;
          
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
      </ScrollView>

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
    paddingBottom: Spacing.xl,
    width: '100%',
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.base,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: Spacing.xs,
  },
  axisLabel: {
    fontSize: FontSize.xs,
  },
  chartScroll: {
    flex: 1,
  },
  chart: {
    position: 'relative',
    height: '100%',
  },
  xAxisScroll: {
    width: '100%',
  },
  goalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  point: {
    position: 'absolute',
    borderWidth: 2,
  },
  weightLabel: {
    position: 'absolute',
    fontSize: FontSize.xs,
    textAlign: 'center',
    width: 40,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  xAxisLabel: {
    fontSize: FontSize.xs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
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
    width: 20,
    height: 2,
  },
  legendText: {
    fontSize: FontSize.xs,
  },
});
