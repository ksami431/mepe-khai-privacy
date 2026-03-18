import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const styles = createStyles(theme);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigate to welcome screen (index route)
              router.replace('/');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logoContainer}>
        <Logo size="medium" showText={false} />
      </View>
      
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>Current Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>{profile?.weight_kg || '-'} kg</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Height</Text>
          <Text style={styles.statValue}>{profile?.height_cm || '-'} cm</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Goal</Text>
          <Text style={styles.statValue}>
            {profile?.goal === 'lose' ? 'Lose Weight' : profile?.goal === 'maintain' ? 'Maintain Weight' : profile?.goal === 'gain' ? 'Gain Weight' : '-'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Activity Level</Text>
          <Text style={styles.statValue}>{profile?.activity_level || '-'}</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          onPress={() => router.push('/edit-profile')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Settings"
          onPress={() => router.push('/settings')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundGray,
  },
  content: {
    padding: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    fontSize: 40,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSize.base,
    color: theme.textLight,
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  statLabel: {
    fontSize: FontSize.base,
    color: theme.textLight,
  },
  statValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    width: '100%',
  },
  version: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    textAlign: 'center',
  },
});
