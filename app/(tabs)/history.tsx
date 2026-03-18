import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { Calendar } from '@/components/Calendar';
import { DayMealsList } from '@/components/DayMealsList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { formatMonthYear, getDatesWithLogs, getDateString } from '@/utils/calendar';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayMeals, setDayMeals] = useState<any[]>([]);
  const [monthLogs, setMonthLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const styles = createStyles(theme);

  const { getFoodLogsByDateRange, getFoodLogsByDate } = useFoodLogs();

  useEffect(() => {
    loadMonthData();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      loadDayMeals();
    }
  }, [selectedDate]);

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString();
      const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString();
      const logs = await getFoodLogsByDateRange(startDate, endDate);
      setMonthLogs(logs);
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDayMeals = async () => {
    if (!selectedDate) return;

    try {
      const dateString = getDateString(new Date(selectedDate));
      const meals = await getFoodLogsByDate(dateString);
      setDayMeals(meals);
    } catch (error) {
      console.error('Error loading day meals:', error);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    const today = new Date();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    // Don't allow going beyond current month
    if (nextYear > today.getFullYear() || 
        (nextYear === today.getFullYear() && nextMonth > today.getMonth())) {
      return;
    }

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const datesWithLogs = getDatesWithLogs(monthLogs);
  const today = new Date();
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{formatMonthYear(currentYear, currentMonth)}</Text>
          <TouchableOpacity 
            onPress={handleNextMonth} 
            style={[styles.navButton, isCurrentMonth && styles.navButtonDisabled]}
            disabled={isCurrentMonth}
          >
            <Text style={[styles.navButtonText, isCurrentMonth && styles.navButtonTextDisabled]}>→</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Card style={styles.calendarCard}>
            <Calendar
              year={currentYear}
              month={currentMonth}
              selectedDate={selectedDate ? new Date(selectedDate) : null}
              datesWithLogs={datesWithLogs}
              onSelectDate={(date) => setSelectedDate(getDateString(date))}
            />
          </Card>

          {selectedDate && (
            <View style={styles.dayMealsContainer}>
              <DayMealsList date={new Date(selectedDate)} meals={dayMeals} />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: Spacing.lg,
  },
  headerCard: {
    marginBottom: Spacing.md,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: Spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: FontSize.xxl,
    color: theme.primary,
    fontWeight: FontWeight.bold,
  },
  navButtonTextDisabled: {
    color: theme.textLight,
  },
  monthTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    borderColor: theme.borderLight,
  },
  calendarCard: {
    marginBottom: Spacing.md,
  },
  dayMealsContainer: {
    flex: 1,
  },
});
