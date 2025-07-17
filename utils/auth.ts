// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'uioyp-token';

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando token', error);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error obteniendo token', error);
    return null;
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error eliminando token', error);
  }
}
