import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { scheduleAllNotifications } from '@/lib/notifications';
import { scheduleWaterReminders, cancelWaterReminders } from '@/lib/waterReminders';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, theme } = useTheme();
  const { profile, updateProfile, deleteAccount } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: profile?.notifications_enabled ?? true,
    breakfastTime: profile?.breakfast_reminder_time || '08:00:00',
    lunchTime: profile?.lunch_reminder_time || '12:30:00',
    dinnerTime: profile?.dinner_reminder_time || '19:00:00',
    snackTime: profile?.snack_reminder_time || '15:00:00',
    logRemindersEnabled: profile?.log_reminder_enabled ?? true,
    dailySummaryEnabled: profile?.daily_summary_enabled ?? true,
  });
  const [waterGoal, setWaterGoal] = useState(String(profile?.daily_water_goal_ml || 2000));
  const [waterRemindersEnabled, setWaterRemindersEnabled] = useState(profile?.water_reminder_enabled ?? true);

  useEffect(() => {
    if (profile) {
      setNotificationSettings({
        enabled: profile.notifications_enabled ?? true,
        breakfastTime: profile.breakfast_reminder_time || '08:00:00',
        lunchTime: profile.lunch_reminder_time || '12:30:00',
        dinnerTime: profile.dinner_reminder_time || '19:00:00',
        snackTime: profile.snack_reminder_time || '15:00:00',
        logRemindersEnabled: profile.log_reminder_enabled ?? true,
        dailySummaryEnabled: profile.daily_summary_enabled ?? true,
      });
      setWaterGoal(String(profile.daily_water_goal_ml || 2000));
      setWaterRemindersEnabled(profile.water_reminder_enabled ?? true);
    }
  }, [profile]);

  const handleNotificationSettingsUpdate = async (newSettings: typeof notificationSettings) => {
    setNotificationSettings(newSettings);
    
    // Update profile in database
    try {
      await updateProfile({
        notifications_enabled: newSettings.enabled,
        breakfast_reminder_time: newSettings.breakfastTime,
        lunch_reminder_time: newSettings.lunchTime,
        dinner_reminder_time: newSettings.dinnerTime,
        snack_reminder_time: newSettings.snackTime,
        log_reminder_enabled: newSettings.logRemindersEnabled,
        daily_summary_enabled: newSettings.dailySummaryEnabled,
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const handleWaterGoalUpdate = async () => {
    const goalValue = parseInt(waterGoal);
    if (isNaN(goalValue) || goalValue < 500 || goalValue > 5000) {
      Alert.alert('Invalid Goal', 'Please enter a water goal between 500ml and 5000ml');
      return;
    }

    try {
      await updateProfile({ daily_water_goal_ml: goalValue });
      Alert.alert('Success', 'Water goal updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update water goal');
    }
  };

  const handleWaterRemindersToggle = async (enabled: boolean) => {
    setWaterRemindersEnabled(enabled);
    
    try {
      if (enabled) {
        const success = await scheduleWaterReminders();
        if (!success) {
          Alert.alert('Permission Required', 'Please enable notifications to receive water reminders');
          setWaterRemindersEnabled(false);
          return;
        }
      } else {
        await cancelWaterReminders();
      }
      
      await updateProfile({ water_reminder_enabled: enabled });
    } catch (error) {
      console.error('Error toggling water reminders:', error);
      Alert.alert('Error', 'Failed to update water reminder settings');
      setWaterRemindersEnabled(!enabled);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account?',
      'This will permanently delete your account and all data. This action cannot be undone.\n\nAre you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Final Confirmation',
              'Please confirm this is what you want. All your data including:\n\n• Food logs\n• Water logs\n• Weight logs\n• Activity logs\n• Favorites\n• Meal plans\n\nWill be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
                      router.replace('/');
                    } catch (error: any) {
                      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleOpenLink = (url: string, title: string) => {
    Alert.alert(
      title,
      'This is a placeholder. In production, this would open:\n\n' + url,
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NotificationSettings 
        settings={notificationSettings}
        onUpdate={handleNotificationSettingsUpdate}
      />

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>💧 Water Intake</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Daily Water Goal</Text>
            <Text style={styles.settingDescription}>Target daily water intake</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="number-pad"
              onBlur={handleWaterGoalUpdate}
              placeholder="2000"
            />
            <Text style={styles.unitLabel}>ml</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Water Reminders (8x Daily)</Text>
            <Text style={styles.settingDescription}>Get reminded 8 times a day to drink water</Text>
          </View>
          <Switch
            value={waterRemindersEnabled}
            onValueChange={handleWaterRemindersToggle}
            trackColor={{ false: theme.borderLight, true: theme.primary }}
            thumbColor={theme.white}
          />
        </View>

        {waterRemindersEnabled && (
          <View style={styles.reminderTimes}>
            <Text style={styles.reminderTimesTitle}>Reminder Times:</Text>
            <Text style={styles.reminderTimesText}>
              8:00 AM • 10:00 AM • 12:00 PM • 2:00 PM{"\n"}
              4:00 PM • 6:00 PM • 8:00 PM • 10:00 PM
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>🌙 Dark Mode</Text>
            <Text style={styles.settingDescription}>Toggle dark theme</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.borderLight, true: theme.primary }}
            thumbColor={theme.white}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>Mepe Khai</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tagline</Text>
          <Text style={styles.infoValue}>Measure, Track, Transform</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Description</Text>
          <Text style={styles.infoDescription}>
            AI-powered diet tracker with photo analysis, meal type categorization, and personalized nutrition targets.
          </Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL('https://github.com/ksami431/mepe-khai-privacy/blob/main/PRIVACY_POLICY.md')}
        >
          <Text style={styles.linkLabel}>Privacy Policy</Text>
          <Text style={styles.linkArrow}>➜</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => handleOpenLink('https://mepekhai.com/terms', 'Terms of Service')}
        >
          <Text style={styles.linkLabel}>Terms of Service</Text>
          <Text style={styles.linkArrow}>➜</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Sami Khan</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Brand</Text>
          <Text style={styles.infoValue}>Sami Khan Fitness</Text>
        </View>
      </Card>

      <Card style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
        
        <Text style={styles.deleteWarning}>
          This will permanently delete your account and all associated data. This action cannot be undone.
        </Text>
      </Card>

      <Text style={styles.footer}>
        Powered by Sami Khan Fitness
      </Text>
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: theme.text,
  },
  infoDescription: {
    fontSize: FontSize.base,
    color: theme.text,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  linkLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: theme.primary,
  },
  linkArrow: {
    fontSize: FontSize.lg,
    color: theme.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.borderLight,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    color: theme.textLight,
  },
  footer: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  input: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSize.base,
    color: theme.text,
    width: 80,
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: FontSize.base,
    color: theme.textLight,
    fontWeight: FontWeight.medium,
  },
  reminderTimes: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: theme.backgroundGray,
    borderRadius: BorderRadius.md,
  },
  reminderTimesTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  reminderTimesText: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    lineHeight: 20,
  },
  dangerSection: {
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  dangerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#dc2626',
    marginBottom: Spacing.md,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  deleteWarning: {
    fontSize: FontSize.sm,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
