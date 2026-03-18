import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { getExerciseTypeEmoji, calculateCaloriesFromExercise, calculateCaloriesFromSteps, getExerciseTypesList, ExerciseType } from '@/lib/activityCalculations';

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { activityLogs, dailyTotals, loading, createActivityLog, deleteActivityLog } = useActivityLogs();
  const [showStepEntry, setShowStepEntry] = useState(false);
  const [showExerciseEntry, setShowExerciseEntry] = useState(false);
  const [stepCount, setStepCount] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const styles = createStyles(theme);

  const handleLogSteps = async () => {
    if (!stepCount || parseInt(stepCount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid step count');
      return;
    }

    setSaving(true);
    try {
      const steps = parseInt(stepCount);
      const calories = calculateCaloriesFromSteps(steps, profile?.weight_kg || 70);
      
      await createActivityLog({
        logged_date: new Date().toISOString().split('T')[0],
        step_count: steps,
        exercise_type: null,
        duration_minutes: null,
        calories_burned: calories,
        notes: null,
      });

      setStepCount('');
      setShowStepEntry(false);
      Alert.alert('Success', `Logged ${steps} steps!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log steps');
    } finally {
      setSaving(false);
    }
  };

  const handleLogExercise = async () => {
    if (!selectedExercise || !duration || parseInt(duration) <= 0) {
      Alert.alert('Invalid Input', 'Please select an exercise type and duration');
      return;
    }

    setSaving(true);
    try {
      const durationMin = parseInt(duration);
      const calories = calculateCaloriesFromExercise(selectedExercise, durationMin, profile?.weight_kg || 70);
      
      await createActivityLog({
        logged_date: new Date().toISOString().split('T')[0],
        step_count: 0,
        exercise_type: selectedExercise,
        duration_minutes: durationMin,
        calories_burned: calories,
        notes: notes || null,
      });

      setSelectedExercise(null);
      setDuration('');
      setNotes('');
      setShowExerciseEntry(false);
      Alert.alert('Success', `Logged ${selectedExercise} workout!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log exercise');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = (activity: any) => {
    Alert.alert(
      'Delete Activity?',
      'Are you sure you want to remove this activity log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivityLog(activity.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete activity');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>👣</Text>
            <Text style={styles.statValue}>{dailyTotals.total_steps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{dailyTotals.total_calories_burned}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={styles.statValue}>{dailyTotals.total_exercise_minutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="Log Steps 👣"
          onPress={() => setShowStepEntry(!showStepEntry)}
          variant={showStepEntry ? 'primary' : 'outline'}
          style={styles.actionButton}
        />
        <Button
          title="Log Exercise 🏃"
          onPress={() => setShowExerciseEntry(!showExerciseEntry)}
          variant={showExerciseEntry ? 'primary' : 'outline'}
          style={styles.actionButton}
        />
      </View>

      {showStepEntry && (
        <Card style={styles.entryCard}>
          <Text style={styles.entryTitle}>Log Steps</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter step count"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={stepCount}
            onChangeText={setStepCount}
          />
          <Button
            title="Save Steps"
            onPress={handleLogSteps}
            loading={saving}
            disabled={saving}
          />
        </Card>
      )}

      {showExerciseEntry && (
        <Card style={styles.entryCard}>
          <Text style={styles.entryTitle}>Log Exercise</Text>
          
          <Text style={styles.label}>Exercise Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exercisePicker}>
            {getExerciseTypesList().map((exercise) => (
              <TouchableOpacity
                key={exercise}
                style={[
                  styles.exerciseChip,
                  selectedExercise === exercise && styles.exerciseChipSelected,
                ]}
                onPress={() => setSelectedExercise(exercise)}
              >
                <Text style={styles.exerciseEmoji}>{getExerciseTypeEmoji(exercise)}</Text>
                <Text style={[
                  styles.exerciseLabel,
                  selectedExercise === exercise && styles.exerciseLabelSelected,
                ]}>
                  {exercise}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter duration in minutes"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={duration}
            onChangeText={setDuration}
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes about your workout"
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          <Button
            title="Save Exercise"
            onPress={handleLogExercise}
            loading={saving}
            disabled={saving || !selectedExercise || !duration}
          />
        </Card>
      )}

      <Card style={styles.historyCard}>
        <Text style={styles.historyTitle}>Today's Activities</Text>
        {activityLogs.length === 0 ? (
          <Text style={styles.emptyText}>No activities logged yet. Start tracking your movement!</Text>
        ) : (
          activityLogs.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityEmoji}>
                  {activity.exercise_type ? getExerciseTypeEmoji(activity.exercise_type) : '👣'}
                </Text>
                <View style={styles.activityDetails}>
                  {activity.exercise_type ? (
                    <>
                      <Text style={styles.activityName}>{activity.exercise_type}</Text>
                      <Text style={styles.activityStats}>
                        {activity.duration_minutes} min · {activity.calories_burned} cal
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.activityName}>Steps</Text>
                      <Text style={styles.activityStats}>
                        {activity.step_count.toLocaleString()} steps · {activity.calories_burned} cal
                      </Text>
                    </>
                  )}
                  {activity.notes && (
                    <Text style={styles.activityNotes}>{activity.notes}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDeleteActivity(activity)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </Card>
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
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  entryCard: {
    marginBottom: Spacing.lg,
  },
  entryTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: theme.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSize.base,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.borderLight,
    marginBottom: Spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  exercisePicker: {
    marginBottom: Spacing.md,
  },
  exerciseChip: {
    backgroundColor: theme.backgroundGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  exerciseChipSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  exerciseEmoji: {
    fontSize: 20,
  },
  exerciseLabel: {
    fontSize: FontSize.sm,
    color: theme.text,
    fontWeight: FontWeight.medium,
  },
  exerciseLabelSelected: {
    color: theme.white,
  },
  historyCard: {
    marginBottom: Spacing.lg,
  },
  historyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: theme.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: Spacing.xl,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: 2,
  },
  activityStats: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  activityNotes: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  deleteIcon: {
    fontSize: 20,
    padding: Spacing.sm,
  },
});
