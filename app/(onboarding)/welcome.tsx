import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleBack = async () => {
    console.log('Back button pressed!');
    Alert.alert(
      'Exit Onboarding?',
      'You can complete your profile later. Do you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            console.log('Signing out from onboarding...');
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    console.log('Sign out button pressed!');
    try {
      await signOut();
      console.log('Sign out successful, navigating to welcome...');
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
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
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
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
  signOutButton: {
    marginTop: Spacing.sm,
  },
});
