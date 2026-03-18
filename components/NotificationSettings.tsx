import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from './Card';
import { Button } from './Button';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { requestNotificationPermissions, scheduleAllNotifications, sendTestNotification, formatTime, NotificationSettings as NotificationSettingsType } from '@/lib/notifications';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: NotificationSettingsType) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [tempTime, setTempTime] = useState(new Date());

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'web') {
      setHasPermission(false);
      return;
    }
    const hasPerms = await requestNotificationPermissions();
    setHasPermission(hasPerms);
  };

  const handleRequestPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);
    
    if (granted) {
      Alert.alert('Success', 'Notification permissions granted!');
      // Enable notifications by default when permissions are granted
      const newSettings = { ...settings, enabled: true };
      onUpdate(newSettings);
      await scheduleAllNotifications(newSettings);
    } else {
      Alert.alert(
        'Permission Denied',
        'Please enable notifications in your device settings to receive reminders.'
      );
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && !hasPermission) {
      await handleRequestPermissions();
      return;
    }

    const newSettings = { ...settings, enabled };
    onUpdate(newSettings);
    await scheduleAllNotifications(newSettings);
  };

  const handleToggleLogReminders = async (enabled: boolean) => {
    const newSettings = { ...settings, logRemindersEnabled: enabled };
    onUpdate(newSettings);
    await scheduleAllNotifications(newSettings);
  };

  const handleToggleDailySummary = async (enabled: boolean) => {
    const newSettings = { ...settings, dailySummaryEnabled: enabled };
    onUpdate(newSettings);
    await scheduleAllNotifications(newSettings);
  };

  const handleTestNotification = async () => {
    if (!hasPermission) {
      Alert.alert('No Permission', 'Please enable notifications first');
      return;
    }

    try {
      await sendTestNotification();
      Alert.alert('Test Sent', 'Check your notifications!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleOpenTimePicker = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const timeString = mealType === 'breakfast' ? settings.breakfastTime :
                       mealType === 'lunch' ? settings.lunchTime :
                       mealType === 'dinner' ? settings.dinnerTime : settings.snackTime;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    setTempTime(date);
    setShowTimePicker(mealType);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(null);
    }
    
    if (selectedDate && showTimePicker) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:00`;
      
      const newSettings = {
        ...settings,
        [showTimePicker === 'breakfast' ? 'breakfastTime' :
         showTimePicker === 'lunch' ? 'lunchTime' :
         showTimePicker === 'dinner' ? 'dinnerTime' : 'snackTime']: timeString
      };
      
      onUpdate(newSettings);
      scheduleAllNotifications(newSettings);
      
      if (Platform.OS === 'android') {
        setShowTimePicker(null);
      }
    }
  };

  const handleCloseTimePicker = () => {
    setShowTimePicker(null);
  };

  const styles = createStyles(theme);

  if (Platform.OS === 'web') {
    return (
      <Card>
        <Text style={styles.infoText}>
          Notifications are not supported on web. Please use the mobile app to receive reminders.
        </Text>
      </Card>
    );
  }

  return (
    <View>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>🔔 Notifications</Text>
          {!hasPermission && (
            <Button
              title="Enable"
              onPress={handleRequestPermissions}
              style={styles.enableButton}
            />
          )}
        </View>

        {!hasPermission ? (
          <View style={styles.permissionWarning}>
            <Text style={styles.warningText}>
              ⚠️ Notification permissions are required to receive meal and log reminders.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>
                  Master toggle for all notifications
                </Text>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: theme.borderLight, true: theme.primary }}
                thumbColor={theme.white}
              />
            </View>

            {settings.enabled && (
              <>
                <View style={styles.divider} />

                <View style={styles.mealTimesSection}>
                  <Text style={styles.sectionTitle}>Meal Reminder Times</Text>
                  
                  <TouchableOpacity style={styles.timeRow} onPress={() => handleOpenTimePicker('breakfast')}>
                    <Text style={styles.timeEmoji}>🍳</Text>
                    <View style={styles.timeInfo}>
                      <Text style={styles.timeLabel}>Breakfast</Text>
                      <Text style={styles.timeValue}>{formatTime(settings.breakfastTime)}</Text>
                    </View>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.timeRow} onPress={() => handleOpenTimePicker('lunch')}>
                    <Text style={styles.timeEmoji}>🥗</Text>
                    <View style={styles.timeInfo}>
                      <Text style={styles.timeLabel}>Lunch</Text>
                      <Text style={styles.timeValue}>{formatTime(settings.lunchTime)}</Text>
                    </View>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.timeRow} onPress={() => handleOpenTimePicker('dinner')}>
                    <Text style={styles.timeEmoji}>🍽️</Text>
                    <View style={styles.timeInfo}>
                      <Text style={styles.timeLabel}>Dinner</Text>
                      <Text style={styles.timeValue}>{formatTime(settings.dinnerTime)}</Text>
                    </View>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.timeRow} onPress={() => handleOpenTimePicker('snack')}>
                    <Text style={styles.timeEmoji}>🍎</Text>
                    <View style={styles.timeInfo}>
                      <Text style={styles.timeLabel}>Snack</Text>
                      <Text style={styles.timeValue}>{formatTime(settings.snackTime)}</Text>
                    </View>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>

                  <Text style={styles.noteText}>
                    Tap any meal time to change it
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Log Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Remind me to log meals 30 min after eating
                    </Text>
                  </View>
                  <Switch
                    value={settings.logRemindersEnabled}
                    onValueChange={handleToggleLogReminders}
                    trackColor={{ false: theme.borderLight, true: theme.primary }}
                    thumbColor={theme.white}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Daily Summary</Text>
                    <Text style={styles.settingDescription}>
                      Daily nutrition summary at 8:00 PM
                    </Text>
                  </View>
                  <Switch
                    value={settings.dailySummaryEnabled}
                    onValueChange={handleToggleDailySummary}
                    trackColor={{ false: theme.borderLight, true: theme.primary }}
                    thumbColor={theme.white}
                  />
                </View>

                <View style={styles.divider} />

                <Button
                  title="Send Test Notification"
                  onPress={handleTestNotification}
                  variant="outline"
                />
              </>
            )}
          </>
        )}
      </Card>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              visible={true}
              transparent
              animationType="slide"
              onRequestClose={handleCloseTimePicker}
            >
              <View style={styles.timePickerModal}>
                <View style={styles.timePickerContainer}>
                  <View style={styles.timePickerHeader}>
                    <TouchableOpacity onPress={handleCloseTimePicker}>
                      <Text style={styles.timePickerButton}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                    textColor={theme.text}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  enableButton: {
    paddingHorizontal: Spacing.md,
  },
  permissionWarning: {
    backgroundColor: theme.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  warningText: {
    fontSize: FontSize.base,
    color: theme.warning,
    lineHeight: 22,
  },
  infoText: {
    fontSize: FontSize.base,
    color: theme.textLight,
    lineHeight: 22,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.borderLight,
    marginVertical: Spacing.xs,
  },
  mealTimesSection: {
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  timeEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  timeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: FontSize.base,
    color: theme.text,
  },
  timeValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.primary,
  },
  noteText: {
    fontSize: FontSize.xs,
    color: theme.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  editIcon: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  timePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timePickerContainer: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  timePickerButton: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.primary,
  },
});
