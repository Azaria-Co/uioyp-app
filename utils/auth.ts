// utils/auth.ts
import { jwtDecode } from 'jwt-decode';
const USERID_KEY = 'uioyp-idus';
export function getIdUsFromToken(token: string): number | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id || null;
  } catch (e) {
    console.error('Error decodificando token', e);
    return null;
  }
}

export async function saveIdUs(id_us: number) {
  try {
    await AsyncStorage.setItem(USERID_KEY, id_us.toString());
  } catch (error) {
    console.error('Error guardando id_us', error);
  }
}

export async function getIdUs(): Promise<number | null> {
  try {
    const val = await AsyncStorage.getItem(USERID_KEY);
    return val ? Number(val) : null;
  } catch (error) {
    console.error('Error obteniendo id_us', error);
    return null;
  }
}

export async function clearIdUs() {
  try {
    await AsyncStorage.removeItem(USERID_KEY);
  } catch (error) {
    console.error('Error eliminando id_us', error);
  }
}
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
