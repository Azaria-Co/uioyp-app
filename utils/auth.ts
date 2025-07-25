// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';


const TOKEN_KEY = 'uioyp-token';
const USERNAME_KEY = 'uioyp-nombreus';
export async function saveNombreUs(nombre_us: string) {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, nombre_us);
  } catch (error) {
    console.error('Error guardando nombre_us', error);
  }
}

export async function getNombreUs(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(USERNAME_KEY);
  } catch (error) {
    console.error('Error obteniendo nombre_us', error);
    return null;
  }
}

export async function clearNombreUs() {
  try {
    await AsyncStorage.removeItem(USERNAME_KEY);
  } catch (error) {
    console.error('Error eliminando nombre_us', error);
  }
}

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
