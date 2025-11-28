import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para almacenamiento
const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

/**
 * Guarda el token de acceso de forma segura (encriptado)
 */
export async function saveAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    console.log('✅ Token de acceso guardado');
  } catch (error) {
    console.error('❌ Error al guardar token de acceso:', error);
    throw error;
  }
}

/**
 * Obtiene el token de acceso
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('❌ Error al obtener token de acceso:', error);
    return null;
  }
}

/**
 * Guarda el refresh token de forma segura (encriptado)
 */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
    console.log('✅ Refresh token guardado');
  } catch (error) {
    console.error('❌ Error al guardar refresh token:', error);
    throw error;
  }
}

/**
 * Obtiene el refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error('❌ Error al obtener refresh token:', error);
    return null;
  }
}

/**
 * Guarda los datos del usuario (menos sensibles, sin encriptar)
 */
export async function saveUserData(userData: any): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    console.log('✅ Datos de usuario guardados');
  } catch (error) {
    console.error('❌ Error al guardar datos de usuario:', error);
    throw error;
  }
}

/**
 * Obtiene los datos del usuario
 */
export async function getUserData(): Promise<any | null> {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ Error al obtener datos de usuario:', error);
    return null;
  }
}

/**
 * Elimina todos los datos de autenticación (logout)
 */
export async function clearAuthData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(KEYS.USER_DATA);
    console.log('✅ Datos de autenticación eliminados');
  } catch (error) {
    console.error('❌ Error al eliminar datos de autenticación:', error);
    throw error;
  }
}

/**
 * Guarda toda la información de autenticación (tokens + datos de usuario)
 */
export async function saveAuthData(token: string, refreshToken: string, userData: any): Promise<void> {
  await Promise.all([
    saveAccessToken(token),
    saveRefreshToken(refreshToken),
    saveUserData(userData),
  ]);
}
