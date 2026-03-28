import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Logo } from '@/components/Logo';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <OnboardingHeader showBack={false} />
      <View style={{ height: 100 }} />
      <ProgressBar current={1} total={5} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="large" showText={true} />
        </View>
        
        <Text style={styles.subtitle}>Let's personalize your nutrition journey</Text>
        
        <View style={styles.benefitsContainer}>
          <BenefitItem icon="📊" text="Track your nutrition with AI-powered food analysis" />
          <BenefitItem icon="🎯" text="Set and achieve your personalized health goals" />
          <BenefitItem icon="📈" text="Monitor your progress with detailed insights" />
          <BenefitItem icon="💪" text="Transform your health, one meal at a time" />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Let's Get Started"
          onPress={() => router.push('/personal-info')}
        />
      </View>
    </View>
  );
}

const BenefitItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <Text style={styles.benefitIcon}>{icon}</Text>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  benefitsContainer: {
    marginTop: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  benefitText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
});
