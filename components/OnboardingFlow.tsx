import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Input } from '@/components/Input';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { data, updatePersonalInfo, updateBodyMetrics, updateGoals, updatePreferences } = useOnboarding();
  
  console.log('OnboardingFlow render, currentStep:', currentStep);
  
  // Local state for each step
  const [name, setName] = useState(data.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [gender, setGender] = useState(data.gender);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderWelcome = () => (
    <View style={styles.container}>
      <ProgressBar current={1} total={5} />
      <View style={styles.content}>
        <Text style={styles.logo}>🥗</Text>
        <Text style={styles.title}>Welcome to Mepe Khai!</Text>
        <Text style={styles.tagline}>Measure, Track, Transform</Text>
        <View style={styles.benefits}>
          <Text style={styles.benefitText}>📊 Track nutrition with AI</Text>
          <Text style={styles.benefitText}>🎯 Personalized health goals</Text>
          <Text style={styles.benefitText}>📈 Detailed insights</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Let's Get Started" onPress={nextStep} />
      </View>
    </View>
  );

  const renderPersonalInfo = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ProgressBar current={2} total={5} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Input label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
          <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" />
          <View style={styles.buttonContainer}>
            <Button 
              title="Continue" 
              onPress={() => {
                updatePersonalInfo({ fullName: name, dateOfBirth, gender: gender as any });
                nextStep();
              }} 
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderComplete = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>✅</Text>
        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.description}>Your profile is complete! Use the tabs below to navigate.</Text>
      </View>
    </View>
  );

  const steps = [
    renderWelcome,
    renderPersonalInfo,
    () => <Text style={styles.title}>Step 3</Text>,
    () => <Text style={styles.title}>Step 4</Text>,
    () => <Text style={styles.title}>Step 5</Text>,
    renderComplete,
  ];

  return steps[currentStep]();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  tagline: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
  benefits: {
    marginTop: Spacing.xl,
  },
  benefitText: {
    fontSize: FontSize.base,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    padding: Spacing.lg,
  },
});
