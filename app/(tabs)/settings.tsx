import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { scheduleAllNotifications } from '@/lib/notifications';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, theme } = useTheme();
  const { profile, updateProfile } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: profile?.notifications_enabled ?? true,
    breakfastTime: profile?.breakfast_reminder_time || '08:00:00',
    lunchTime: profile?.lunch_reminder_time || '12:30:00',
    dinnerTime: profile?.dinner_reminder_time || '19:00:00',
    snackTime: profile?.snack_reminder_time || '15:00:00',
    logRemindersEnabled: profile?.log_reminder_enabled ?? true,
    dailySummaryEnabled: profile?.daily_summary_enabled ?? true,
  });

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
          onPress={() => handleOpenLink('https://mepekhai.com/privacy', 'Privacy Policy')}
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
});
