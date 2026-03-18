import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/hooks/useAuth';
import { calculateMacroTargets } from '@/lib/calculations';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { data, resetData } = useOnboarding();
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [targets, setTargets] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    console.log('Completion screen - received data:', JSON.stringify(data, null, 2));
    
    // Check if onboarding data is complete
    if (!data.weight || !data.height || !data.dateOfBirth || !data.goal || !data.activityLevel || !data.gender) {
      console.log('Incomplete onboarding data, redirecting to start');
      console.log('Missing:', {
        weight: !data.weight,
        height: !data.height,
        dateOfBirth: !data.dateOfBirth,
        goal: !data.goal,
        activityLevel: !data.activityLevel,
        gender: !data.gender
      });
      Alert.alert(
        'Incomplete Profile',
        'Please complete all onboarding steps first.',
        [{ text: 'OK', onPress: () => router.replace('/(onboarding)/welcome') }]
      );
      return;
    }
    calculateTargets();
  }, []);

  const calculateTargets = () => {
    // Validate required data exists
    if (!data.weight || !data.height || !data.dateOfBirth || !data.goal || !data.activityLevel || !data.gender) {
      console.log('Missing onboarding data, cannot calculate targets');
      return;
    }

    // Parse and convert units with validation
    let weightKg = parseFloat(data.weight);
    if (isNaN(weightKg) || weightKg <= 0) {
      console.error('Invalid weight value:', data.weight);
      return;
    }
    if (data.weightUnit === 'lbs') {
      weightKg = weightKg * 0.453592;
    }

    let heightCm = parseFloat(data.height);
    if (data.heightUnit === 'ft') {
      heightCm = heightCm * 30.48;
    }

    // Calculate age from date of birth
    console.log('Parsing date of birth:', data.dateOfBirth);
    
    // Parse MM/DD/YYYY format manually
    const dateParts = data.dateOfBirth.split('/');
    if (dateParts.length !== 3) {
      console.error('Invalid date format:', data.dateOfBirth);
      Alert.alert('Error', 'Invalid date format. Please use MM/DD/YYYY');
      return;
    }
    
    const month = parseInt(dateParts[0], 10) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    
    const birthDate = new Date(year, month, day);
    console.log('Parsed birth date:', birthDate, 'Valid:', !isNaN(birthDate.getTime()));
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    console.log('Calculated age:', age);

    if (isNaN(age) || age <= 0 || age > 120) {
      console.error('Invalid age calculated:', age, 'from date:', data.dateOfBirth);
      Alert.alert('Error', `Invalid age calculated. Please check your date of birth.`);
      return;
    }

    // Map goal and activity level to calculation types
    const goalMap: Record<string, 'lose' | 'maintain' | 'gain'> = {
      'lose_weight': 'lose',
      'maintain_weight': 'maintain',
      'gain_weight': 'gain',
    };

    const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'> = {
      'sedentary': 'sedentary',
      'lightly_active': 'light',
      'moderately_active': 'moderate',
      'very_active': 'active',
      'extremely_active': 'very_active',
    };

    const gender = data.gender === 'prefer_not_to_say' ? 'other' : data.gender as 'male' | 'female' | 'other';

    const calculated = calculateMacroTargets({
      age,
      gender,
      weight_kg: weightKg,
      height_cm: heightCm,
      activity_level: activityMap[data.activityLevel],
      goal: goalMap[data.goal],
    });

    setTargets(calculated);
  };

  const handleStartTracking = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to continue. Redirecting to sign in...');
      router.replace('/(auth)/signin');
      return;
    }

    // Validate data before saving
    if (!data.dateOfBirth) {
      Alert.alert('Error', 'Date of birth is missing. Please go back and complete all steps.');
      return;
    }

    setSaving(true);
    try {
      // Convert units if needed
      let weightKg = parseFloat(data.weight);
      if (isNaN(weightKg) || weightKg <= 0) {
        throw new Error('Invalid weight value');
      }
      if (data.weightUnit === 'lbs') {
        weightKg = weightKg * 0.453592;
      }

      let heightCm = parseFloat(data.height);
      if (isNaN(heightCm) || heightCm <= 0) {
        throw new Error('Invalid height value');
      }
      if (data.heightUnit === 'ft') {
        heightCm = heightCm * 30.48;
      }

      // Calculate age - parse MM/DD/YYYY format manually
      const dateParts = data.dateOfBirth.split('/');
      if (dateParts.length !== 3) {
        throw new Error('Invalid date format. Please use MM/DD/YYYY');
      }
      
      const month = parseInt(dateParts[0], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      
      const birthDate = new Date(year, month, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (isNaN(age) || age <= 0 || age > 120) {
        throw new Error('Invalid age calculated');
      }
      
      console.log('Save profile - calculated age:', age);

      // Map values
      const goalMap: Record<string, 'lose' | 'maintain' | 'gain'> = {
        'lose_weight': 'lose',
        'maintain_weight': 'maintain',
        'gain_weight': 'gain',
      };

      const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'> = {
        'sedentary': 'sedentary',
        'lightly_active': 'light',
        'moderately_active': 'moderate',
        'very_active': 'active',
        'extremely_active': 'very_active',
      };

      const gender = data.gender === 'prefer_not_to_say' ? 'other' : data.gender as 'male' | 'female' | 'other';

      // Save to Supabase
      await updateProfile({
        full_name: data.fullName,
        age,
        gender,
        height_cm: Math.round(heightCm),
        weight_kg: Math.round(weightKg * 10) / 10,
        activity_level: activityMap[data.activityLevel],
        goal: goalMap[data.goal],
        daily_calorie_target: targets.calories,
        daily_protein_target: targets.protein,
        daily_carbs_target: targets.carbs,
        daily_fats_target: targets.fats,
      });

      // Reset onboarding data
      resetData();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Profile save error:', error);
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
        <Text style={{ textAlign: 'center', marginTop: Spacing.md, color: Colors.textLight }}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  if (targets.calories === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>
            Your personalized nutrition plan is ready
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Your Daily Targets</Text>
          
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Calories</Text>
            <Text style={styles.targetValue}>{targets.calories} kcal</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.macrosTitle}>Macronutrients</Text>
          
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{targets.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{targets.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{targets.fats}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </Card>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <Text style={styles.tipText}>• Log your meals to track progress</Text>
          <Text style={styles.tipText}>• Use the camera for quick AI analysis</Text>
          <Text style={styles.tipText}>• Check your dashboard daily</Text>
          <Text style={styles.tipText}>• Stay consistent for best results</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Tracking"
          onPress={handleStartTracking}
          loading={saving}
          disabled={saving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  targetLabel: {
    fontSize: FontSize.base,
    color: Colors.textLight,
  },
  targetValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  macrosTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  macroLabel: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  tipsContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
  },
  tipsTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
