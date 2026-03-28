import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type Goal = 'lose_weight' | 'maintain_weight' | 'gain_weight';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

export default function GoalsScreen() {
  const router = useRouter();
  const { data, updateGoals } = useOnboarding();
  const [goal, setGoal] = useState<Goal | ''>(data.goal);
  const [targetWeight, setTargetWeight] = useState(data.targetWeight);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(data.activityLevel);
  const [errors, setErrors] = useState<{ goal?: string; targetWeight?: string; activityLevel?: string }>({});

  const validate = () => {
    const newErrors: { goal?: string; targetWeight?: string; activityLevel?: string } = {};
    
    if (!goal) {
      newErrors.goal = 'Please select your goal';
    }
    
    if (!targetWeight) {
      newErrors.targetWeight = 'Target weight is required';
    } else if (isNaN(Number(targetWeight)) || Number(targetWeight) <= 0) {
      newErrors.targetWeight = 'Please enter a valid weight';
    }
    
    if (!activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    
    // Store data in context
    updateGoals({
      goal: goal as any,
      targetWeight,
      activityLevel: activityLevel as any,
    });
    
    router.push('/preferences');
  };

  const goalOptions = [
    { value: 'lose_weight', label: 'Lose Weight', icon: '📉', description: 'Reduce body fat' },
    { value: 'maintain_weight', label: 'Maintain Weight', icon: '⚖️', description: 'Stay at current weight' },
    { value: 'gain_weight', label: 'Gain Weight', icon: '📈', description: 'Build muscle mass' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Physical job + exercise' },
  ];

  return (
    <View style={styles.container}>
      <OnboardingHeader showBack={true} onBack={() => router.back()} />
      <View style={{ height: 100 }} />
      <ProgressBar current={4} total={5} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>What's your goal?</Text>
          <Text style={styles.subtitle}>
            We'll calculate your personalized calorie and macro targets based on your goal.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Primary Goal</Text>
            <View style={styles.goalOptions}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.goalOption,
                    goal === option.value && styles.goalOptionSelected,
                  ]}
                  onPress={() => setGoal(option.value as Goal)}
                >
                  <Text style={styles.goalIcon}>{option.icon}</Text>
                  <Text style={[styles.goalLabel, goal === option.value && styles.goalLabelSelected]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.goalDescription, goal === option.value && styles.goalDescriptionSelected]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.goal && <Text style={styles.error}>{errors.goal}</Text>}
          </View>

          <View style={styles.section}>
            <Input
              label="Target Weight (kg)"
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="65"
              keyboardType="decimal-pad"
              error={errors.targetWeight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Activity Level</Text>
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.activityOption,
                  activityLevel === option.value && styles.activityOptionSelected,
                ]}
                onPress={() => setActivityLevel(option.value as ActivityLevel)}
              >
                <View style={styles.activityContent}>
                  <Text style={[styles.activityLabel, activityLevel === option.value && styles.activityLabelSelected]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.activityDescription, activityLevel === option.value && styles.activityDescriptionSelected]}>
                    {option.description}
                  </Text>
                </View>
                {activityLevel === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            {errors.activityLevel && <Text style={styles.error}>{errors.activityLevel}</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  goalOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  goalOption: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  goalOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  goalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  goalLabelSelected: {
    color: Colors.white,
  },
  goalDescription: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
  goalDescriptionSelected: {
    color: Colors.white,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  activityOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundGray,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityLabelSelected: {
    color: Colors.primary,
  },
  activityDescription: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  activityDescriptionSelected: {
    color: Colors.text,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
