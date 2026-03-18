import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { calculateMacroTargets } from '@/lib/calculations';
import { ACTIVITY_LEVELS, GOALS, GENDERS } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type Goal = 'lose' | 'maintain' | 'gain';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Gender = 'male' | 'female' | 'other';

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const styles = createStyles(theme);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [gender, setGender] = useState<Gender | null>(profile?.gender || null);
  const [weight, setWeight] = useState(profile?.weight_kg?.toString() || '');
  const [height, setHeight] = useState(profile?.height_cm?.toString() || '');
  const [goalWeight, setGoalWeight] = useState(profile?.goal_weight_kg?.toString() || '');
  const [goal, setGoal] = useState<Goal | null>(profile?.goal || null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(profile?.activity_level || null);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age (10-120)');
      return;
    }

    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    if (!height || isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    if (!goal) {
      Alert.alert('Error', 'Please select your goal');
      return;
    }

    if (!activityLevel) {
      Alert.alert('Error', 'Please select your activity level');
      return;
    }

    setSaving(true);
    try {
      const targets = calculateMacroTargets({
        age: ageNum,
        gender,
        weight_kg: weightNum,
        height_cm: heightNum,
        activity_level: activityLevel,
        goal,
      });

      const goalWeightNum = goalWeight ? parseFloat(goalWeight) : null;

      await updateProfile({
        full_name: fullName.trim(),
        age: ageNum,
        gender,
        weight_kg: weightNum,
        height_cm: heightNum,
        goal_weight_kg: goalWeightNum,
        goal,
        activity_level: activityLevel,
        daily_calorie_target: targets.calories,
        daily_protein_target: targets.protein,
        daily_carbs_target: targets.carbs,
        daily_fats_target: targets.fats,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
          />

          <Input
            label="Age"
            value={age}
            onChangeText={setAge}
            placeholder="25"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.optionsGrid}>
            {Object.entries(GENDERS).map(([key, { label, icon }]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionCard,
                  gender === key && styles.optionCardSelected,
                ]}
                onPress={() => setGender(key as Gender)}
              >
                <Text style={styles.optionIcon}>{icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    gender === key && styles.optionLabelSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>
          
          <Input
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="70"
            keyboardType="decimal-pad"
          />

          <Input
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            placeholder="170"
            keyboardType="decimal-pad"
          />

          <Input
            label="Goal Weight (kg) - Optional"
            value={goalWeight}
            onChangeText={setGoalWeight}
            placeholder="65"
            keyboardType="decimal-pad"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <View style={styles.optionsList}>
            {Object.entries(GOALS).map(([key, { label, description, icon }]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionRow,
                  goal === key && styles.optionRowSelected,
                ]}
                onPress={() => setGoal(key as Goal)}
              >
                <Text style={styles.optionRowIcon}>{icon}</Text>
                <View style={styles.optionRowContent}>
                  <Text
                    style={[
                      styles.optionRowLabel,
                      goal === key && styles.optionRowLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                  <Text style={styles.optionRowDescription}>{description}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    goal === key && styles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.optionsList}>
            {Object.entries(ACTIVITY_LEVELS).map(([key, { label, description }]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionRow,
                  activityLevel === key && styles.optionRowSelected,
                ]}
                onPress={() => setActivityLevel(key as ActivityLevel)}
              >
                <View style={styles.optionRowContent}>
                  <Text
                    style={[
                      styles.optionRowLabel,
                      activityLevel === key && styles.optionRowLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                  <Text style={styles.optionRowDescription}>{description}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    activityLevel === key && styles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
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
  optionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.borderLight,
    backgroundColor: theme.backgroundWhite,
  },
  optionCardSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: theme.text,
  },
  optionLabelSelected: {
    color: theme.textMuted,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.borderLight,
    backgroundColor: theme.white,
  },
  optionRowSelected: {
    backgroundColor: theme.primaryLight,
    borderColor: theme.primary,
  },
  optionRowIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  optionRowContent: {
    flex: 1,
  },
  optionRowLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  optionRowLabelSelected: {
    color: theme.primary,
  },
  optionRowDescription: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.borderLight,
    marginLeft: Spacing.sm,
  },
  radioSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
