import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Water reminder times (8 times a day)
const WATER_REMINDER_TIMES = [
  { hour: 8, minute: 0 },   // 8:00 AM
  { hour: 10, minute: 0 },  // 10:00 AM
  { hour: 12, minute: 0 },  // 12:00 PM
  { hour: 14, minute: 0 },  // 2:00 PM
  { hour: 16, minute: 0 },  // 4:00 PM
  { hour: 18, minute: 0 },  // 6:00 PM
  { hour: 20, minute: 0 },  // 8:00 PM
  { hour: 22, minute: 0 },  // 10:00 PM
];

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleWaterReminders = async () => {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return false;
    }

    // Cancel existing water reminders
    await cancelWaterReminders();

    // Schedule 8 daily reminders
    for (const time of WATER_REMINDER_TIMES) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Time to Hydrate!',
          body: "Don't forget to drink water and stay hydrated throughout the day.",
          sound: true,
          data: { type: 'water_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
        },
      });
    }

    console.log('Water reminders scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling water reminders:', error);
    return false;
  }
};

export const cancelWaterReminders = async () => {
  try {
    // Get all scheduled notifications
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Filter and cancel only water reminders
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'water_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    console.log('Water reminders cancelled');
  } catch (error) {
    console.error('Error cancelling water reminders:', error);
  }
};

export const getWaterReminderStatus = async (): Promise<boolean> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.some(
      notification => notification.content.data?.type === 'water_reminder'
    );
  } catch (error) {
    console.error('Error checking water reminder status:', error);
    return false;
  }
};
