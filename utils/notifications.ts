// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api/config';

const REMINDER_ID_KEY = 'uioyp-daily-reminder-id';
const REMINDER_TIME_KEY = 'uioyp-daily-reminder-time'; // stores JSON: { hour, minute }
const ANDROID_CHANNEL_ID = 'daily-reminders';

// Mostrar notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Muestra el banner temporal en la parte superior
    shouldShowList: true,   // Muestra en el centro de notificaciones
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function fetchGlobalReminderTime(): Promise<{ hour: number; minute: number } | null> {
  try {
    const res = await fetch(`${API_URL}/push/reminder-time`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data.hour === 'number' && typeof data.minute === 'number') {
      return { hour: data.hour, minute: data.minute };
    }
    return null;
  } catch {
    return null;
  }
}

export async function initNotifications(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    let status = settings.status;
    if (status !== 'granted') {
      const res = await Notifications.requestPermissionsAsync();
      status = res.status;
    }
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Recordatorios diarios',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
    return true;
  } catch (e) {
    console.warn('initNotifications error', e);
    return false;
  }
}

export async function scheduleDailyReminder(hour: number = 21, minute: number = 0): Promise<string | null> {
  const hasPerm = await initNotifications();
  if (!hasPerm) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Registro de bitácora',
        body: 'No olvides registrar tu progreso de hoy en la bitácora ✍️',
        sound: false,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
      } as any,
    });

    await AsyncStorage.setItem(REMINDER_ID_KEY, id);
    await AsyncStorage.setItem(REMINDER_TIME_KEY, JSON.stringify({ hour, minute }));
    return id;
  } catch (e) {
    console.warn('scheduleDailyReminder error', e);
    return null;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  try {
    const id = await AsyncStorage.getItem(REMINDER_ID_KEY);
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await AsyncStorage.removeItem(REMINDER_ID_KEY);
    }
  } catch (e) {
    console.warn('cancelDailyReminder error', e);
  }
}

export async function rescheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  await cancelDailyReminder();
  return scheduleDailyReminder(hour, minute);
}

export async function scheduleDailyReminderIfNeeded(defaultHour: number = 21, defaultMinute: number = 0): Promise<string | null> {
  try {
    const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY);
    const existingTimeStr = await AsyncStorage.getItem(REMINDER_TIME_KEY);
    const saved = existingTimeStr ? (JSON.parse(existingTimeStr) as { hour: number; minute: number }) : null;

    const serverTime = await fetchGlobalReminderTime();

    // Si hay hora del servidor y es distinta a la guardada, reprogramar
    if (serverTime) {
      if (!saved || saved.hour !== serverTime.hour || saved.minute !== serverTime.minute) {
        return rescheduleDailyReminder(serverTime.hour, serverTime.minute);
      }
      // Si coincide, mantener el existente
      if (existingId) return existingId;
      return scheduleDailyReminder(serverTime.hour, serverTime.minute);
    }

    // Si no hay hora del servidor, usar por defecto
    if (saved) {
      if (existingId) return existingId;
      return scheduleDailyReminder(saved.hour, saved.minute);
    }
    return scheduleDailyReminder(defaultHour, defaultMinute);
  } catch (e) {
    console.warn('scheduleDailyReminderIfNeeded error', e);
    const serverTime = await fetchGlobalReminderTime();
    if (serverTime) return rescheduleDailyReminder(serverTime.hour, serverTime.minute);
    return scheduleDailyReminder(defaultHour, defaultMinute);
  }
}
