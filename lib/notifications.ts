import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  snackTime: string;
  logRemindersEnabled: boolean;
  dailySummaryEnabled: boolean;
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // For Android, create notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });

      await Notifications.setNotificationChannelAsync('meal-reminders', {
        name: 'Meal Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });

      await Notifications.setNotificationChannelAsync('log-reminders', {
        name: 'Log Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        lightColor: '#10b981',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Schedule meal reminder
async function scheduleMealNotification(
  mealType: 'breakfast' | 'lunch' | 'dinner',
  time: string,
  enabled: boolean
) {
  if (!enabled) return;

  const [hours, minutes] = time.split(':').map(Number);
  
  const mealEmojis = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
  };

  const mealMessages = {
    breakfast: "Time for breakfast! Don't forget to fuel your day.",
    lunch: "Lunch time! Keep your energy up with a healthy meal.",
    dinner: "Dinner time! End your day with a nutritious meal.",
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${mealEmojis[mealType]} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Reminder`,
      body: mealMessages[mealType],
      data: { type: 'meal-reminder', mealType },
      categoryIdentifier: 'meal-reminder',
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

// Schedule log reminder (30 minutes after each meal)
async function scheduleLogReminder(
  mealType: 'breakfast' | 'lunch' | 'dinner',
  mealTime: string,
  enabled: boolean
) {
  if (!enabled) return;

  const [hours, minutes] = mealTime.split(':').map(Number);
  
  // Add 30 minutes to meal time
  let reminderHour = hours;
  let reminderMinute = minutes + 30;
  
  if (reminderMinute >= 60) {
    reminderMinute -= 60;
    reminderHour = (reminderHour + 1) % 24;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📝 Don\'t Forget to Log!',
      body: `Did you log your ${mealType}? Track your meal to stay on target.`,
      data: { type: 'log-reminder', mealType },
      categoryIdentifier: 'log-reminder',
    },
    trigger: {
      hour: reminderHour,
      minute: reminderMinute,
      repeats: true,
    },
  });
}

// Schedule daily summary notification (8 PM)
async function scheduleDailySummary(enabled: boolean) {
  if (!enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Daily Summary',
      body: 'Check out your nutrition summary for today!',
      data: { type: 'daily-summary' },
      categoryIdentifier: 'daily-summary',
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
}

// Schedule all notifications based on settings
export async function scheduleAllNotifications(settings: NotificationSettings) {
  // Cancel all existing notifications first
  await cancelAllNotifications();

  if (!settings.enabled) return;

  // Schedule meal reminders
  await scheduleMealNotification('breakfast', settings.breakfastTime, settings.enabled);
  await scheduleMealNotification('lunch', settings.lunchTime, settings.enabled);
  await scheduleMealNotification('dinner', settings.dinnerTime, settings.enabled);

  // Schedule log reminders (30 min after meals)
  if (settings.logRemindersEnabled) {
    await scheduleLogReminder('breakfast', settings.breakfastTime, settings.enabled);
    await scheduleLogReminder('lunch', settings.lunchTime, settings.enabled);
    await scheduleLogReminder('dinner', settings.dinnerTime, settings.enabled);
  }

  // Schedule daily summary
  if (settings.dailySummaryEnabled) {
    await scheduleDailySummary(settings.enabled);
  }
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Send immediate test notification
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Test Notification',
      body: 'Notifications are working! You\'re all set.',
      data: { type: 'test' },
    },
    trigger: null, // Send immediately
  });
}

// Handle notification response (when user taps notification)
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Parse time string to Date object for today
export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format time for display
export function formatTime(timeString: string): string {
  const date = parseTimeString(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
