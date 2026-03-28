import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface OnboardingHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function OnboardingHeader({ showBack = false, onBack }: OnboardingHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleCancel = async () => {
    console.log('🔴 Cancel button PRESSED!!!');
    Alert.alert(
      'Cancel Onboarding?',
      "You'll need to start over next time you sign in.",
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    console.log('🔵 Back button PRESSED!!!');
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {showBack ? (
          <Pressable 
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed
            ]} 
            onPress={handleBack}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <Pressable 
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.pressed
          ]} 
          onPress={handleCancel}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.cancelText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    zIndex: 9999,
    elevation: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.md,
    minWidth: 80,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  placeholder: {
    width: 80,
  },
  cancelButton: {
    padding: Spacing.md,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 28,
    color: Colors.textLight,
    fontWeight: FontWeight.bold,
  },
  pressed: {
    opacity: 0.5,
  },
});
