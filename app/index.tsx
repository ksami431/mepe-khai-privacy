import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo-full.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Mepe Khai</Text>
          <Text style={styles.subtitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Redirect authenticated users to tabs layout
  if (user && profile) {
    return <Redirect href="/(tabs)" />;
  }

  // Redirect users without profile to onboarding
  if (user && !profile) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  console.log('Rendering: Default welcome screen');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo-full.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>Mepe Khai</Text>
        <Text style={styles.subtitle}>AI Diet Tracker</Text>
        <Text style={styles.tagline}>Measure, Track, Transform</Text>
        
        <Text style={styles.description}>
          Your intelligent companion for achieving your health and fitness goals through smart nutrition tracking.
        </Text>
        
        <Text style={styles.poweredBy}>Powered by Sami Khan Fitness</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => {
            console.log('Get Started button pressed');
            router.push('/(auth)/signup');
          }}
        />
        <Button
          title="Sign In"
          onPress={() => {
            console.log('Sign In button pressed from welcome');
            router.push('/(auth)/signin');
          }}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: Spacing.xl,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  poweredBy: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
    width: '100%',
  },
  linkButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  linkButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
});
