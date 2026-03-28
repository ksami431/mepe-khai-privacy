import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function BodyMetricsScreen() {
  const router = useRouter();
  const { data, updateBodyMetrics } = useOnboarding();
  const [weight, setWeight] = useState(data.weight);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(data.weightUnit);
  const [height, setHeight] = useState(data.height);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(data.heightUnit);
  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const validate = () => {
    const newErrors: { weight?: string; height?: string } = {};
    
    if (!weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    if (!height) {
      newErrors.height = 'Height is required';
    } else if (isNaN(Number(height)) || Number(height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    
    // Store data in context
    updateBodyMetrics({
      weight,
      weightUnit,
      height,
      heightUnit,
    });
    
    router.push('/goals');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <OnboardingHeader showBack={true} onBack={() => router.back()} />
      <View style={{ height: 100 }} />
      <ProgressBar current={3} total={5} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Your body metrics</Text>
          <Text style={styles.subtitle}>
            We'll use this information to calculate your personalized nutrition targets.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Weight</Text>
              <View style={styles.inputWithUnit}>
                <Input
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  keyboardType="decimal-pad"
                  error={errors.weight}
                  style={styles.input}
                />
                <View style={styles.unitToggle}>
                  <TouchableOpacity
                    style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                    onPress={() => setWeightUnit('kg')}
                  >
                    <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextActive]}>
                      kg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.unitButton, weightUnit === 'lbs' && styles.unitButtonActive]}
                    onPress={() => setWeightUnit('lbs')}
                  >
                    <Text style={[styles.unitText, weightUnit === 'lbs' && styles.unitTextActive]}>
                      lbs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height</Text>
              <View style={styles.inputWithUnit}>
                <Input
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="decimal-pad"
                  error={errors.height}
                  style={styles.input}
                />
                <View style={styles.unitToggle}>
                  <TouchableOpacity
                    style={[styles.unitButton, heightUnit === 'cm' && styles.unitButtonActive]}
                    onPress={() => setHeightUnit('cm')}
                  >
                    <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>
                      cm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.unitButton, heightUnit === 'ft' && styles.unitButtonActive]}
                    onPress={() => setHeightUnit('ft')}
                  >
                    <Text style={[styles.unitText, heightUnit === 'ft' && styles.unitTextActive]}>
                      ft
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </KeyboardAvoidingView>
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
  form: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  unitButtonActive: {
    backgroundColor: Colors.primary,
  },
  unitText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  unitTextActive: {
    color: Colors.white,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
