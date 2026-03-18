import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    console.log('Sign In button pressed!', { email, password: '***' });
    
    if (!validate()) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed, signing in...');
    setLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      console.log('Sign in successful!', { user: !!result.user });
      // Give a moment for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Sign in complete, navigating...');
      // Navigate to welcome screen which will auto-redirect based on profile
      router.replace('/');
    } catch (error: any) {
      console.log('Sign in error:', error);
      Alert.alert('Sign In Failed', error.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue tracking your nutrition</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              error={errors.email}
              autoCapitalize="none"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              error={errors.password}
            />

            <Button
              title="Forgot Password?"
              onPress={() => router.push('/(auth)/reset-password')}
              variant="outline"
              style={styles.forgotButton}
              textStyle={styles.forgotButtonText}
            />

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              style={styles.signInButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button
              title="Sign Up"
              onPress={() => router.replace('/(auth)/signup')}
              variant="outline"
              style={styles.signUpButton}
              textStyle={styles.signUpButtonText}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  forgotButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: Spacing.xs,
    minHeight: 0,
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  forgotButtonText: {
    fontSize: FontSize.sm,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: FontSize.base,
    color: Colors.textLight,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  signUpButtonText: {
    fontSize: FontSize.base,
  },
});
