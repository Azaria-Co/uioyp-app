import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_URL } from '../api/config';
import { getIdUs } from './auth';

export async function registerPushTokenIfPossible() {
  try {
    const perms = await Notifications.getPermissionsAsync();
    if (perms.status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') return;
    }
    const tokenResult = await Notifications.getExpoPushTokenAsync();
    const expoToken = (tokenResult as any)?.data || (tokenResult as any)?.token;
    const id_us = await getIdUs();
    if (!expoToken || !id_us) return;
    await fetch(`${API_URL}/push/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_us, token: expoToken, platform: Platform.OS }),
    });
  } catch (e) {
    // noop
  }
}
