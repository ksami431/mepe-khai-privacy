import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMonthDates, isToday, isSameDate, getDateString } from '@/utils/calendar';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  datesWithLogs: Set<string>;
  onSelectDate: (date: Date) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  selectedDate,
  datesWithLogs,
  onSelectDate,
}) => {
  const dates = getMonthDates(year, month);

  return (
    <View style={styles.container}>
      <View style={styles.weekDaysRow}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.datesGrid}>
        {dates.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dateCell} />;
          }

          const dateString = getDateString(date);
          const hasLogs = datesWithLogs.has(dateString);
          const isSelected = selectedDate && isSameDate(date, selectedDate);
          const isCurrentDay = isToday(date);
          const isFuture = date > new Date();

          return (
            <TouchableOpacity
              key={dateString}
              style={[
                styles.dateCell,
                isSelected && styles.dateCellSelected,
                isCurrentDay && !isSelected && styles.dateCellToday,
              ]}
              onPress={() => !isFuture && onSelectDate(date)}
              disabled={isFuture}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.dateTextSelected,
                  isCurrentDay && !isSelected && styles.dateTextToday,
                  isFuture && styles.dateTextFuture,
                ]}
              >
                {date.getDate()}
              </Text>
              {hasLogs && !isSelected && (
                <View style={styles.logIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  weekDaysRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textLight,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dateCellSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  dateCellToday: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  dateText: {
    fontSize: FontSize.base,
    color: Colors.text,
  },
  dateTextSelected: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  dateTextToday: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  dateTextFuture: {
    color: Colors.textMuted,
  },
  logIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
