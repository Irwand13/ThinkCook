import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_KEY = 'thinkcook:reminder';
const REMINDER_HOUR = 5;
const REMINDER_MINUTE = 0;

export function setupNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    return true;
  }
  const next = await Notifications.requestPermissionsAsync();
  return next.status === 'granted';
}

export async function isReminderEnabled(): Promise<boolean> {
  const id = await AsyncStorage.getItem(REMINDER_KEY);
  return id !== null;
}

export async function setDailyReminder(enabled: boolean): Promise<boolean> {
  if (enabled) {
    const granted = await ensurePermission();
    if (!granted) {
      return false;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Pengingat Masak',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Waktunya masak',
        body: 'Mau masak apa hari ini? Buka ThinkCook dan cari resep baru.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
      },
    });
    await AsyncStorage.setItem(REMINDER_KEY, id);
    return true;
  }

  const id = await AsyncStorage.getItem(REMINDER_KEY);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(REMINDER_KEY);
  }
  return true;
}

// Notifikasi favorit hanya dikirim kalau izin sudah diberikan — jangan
// minta izin di tengah pengguna menyimpan favorit.
export async function notifyFavoriteAdded(title: string): Promise<void> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'granted') {
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Resep disimpan',
        body: `"${title}" sudah masuk daftar favoritmu.`,
      },
      trigger: null,
    });
  } catch {
    // notifikasi gagal tidak boleh mengganggu
  }
}
