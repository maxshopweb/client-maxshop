/**
 * Utilidades para refrescar el token de Firebase cuando expire
 */

import { auth } from '../lib/firebase.config';
import { useAuthStore } from '../stores/userStore';
import { setAuthToken } from './cookies';

/**
 * Refresca el token de Firebase y actualiza el store y las cookies
 * @returns El nuevo token o null si no se pudo refrescar
 */
export async function refreshFirebaseToken(): Promise<string | null> {
  try {
    // Verificar si hay un usuario de Firebase autenticado
    let currentUser = auth.currentUser;
    
    // Si no hay usuario actual, esperar un momento y verificar de nuevo
    // (puede ser que Firebase aún no haya inicializado)
    if (!currentUser) {
      console.log('🔄 [TokenRefresh] Esperando usuario de Firebase...');
      
      // Esperar hasta 2 segundos para que Firebase se inicialice
      let attempts = 0;
      while (!currentUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentUser = auth.currentUser;
        attempts++;
      }
    }
    
    if (!currentUser) {
      console.warn('⚠️ [TokenRefresh] No hay usuario autenticado en Firebase');
      
      // Intentar obtener el usuario del store y verificar si hay sesión activa
      const storeUsuario = useAuthStore.getState().usuario;
      if (storeUsuario) {
        console.log('ℹ️ [TokenRefresh] Hay usuario en store pero no en Firebase. Puede que la sesión haya expirado.');
      }
      
      return null;
    }

    console.log('🔄 [TokenRefresh] Refrescando token de Firebase...');
    
    // Forzar renovación del token (true = force refresh)
    const newToken = await currentUser.getIdToken(true);
    
    if (!newToken) {
      console.warn('⚠️ [TokenRefresh] No se pudo obtener nuevo token');
      return null;
    }
    
    // Actualizar el store
    const { setToken } = useAuthStore.getState();
    setToken(newToken);
    
    // Actualizar las cookies
    setAuthToken(newToken);
    
    console.log('✅ [TokenRefresh] Token refrescado exitosamente');
    return newToken;
  } catch (error: any) {
    console.error('❌ [TokenRefresh] Error al refrescar token:', error);
    
    // Si el error es de sesión expirada, limpiar el store
    if (error?.code === 'auth/user-token-expired' || error?.message?.includes('expired')) {
      console.warn('⚠️ [TokenRefresh] Sesión de Firebase expirada');
      const { logout } = useAuthStore.getState();
      logout();
    }
    
    return null;
  }
}

/**
 * Verifica si un error es de token expirado
 */
export function isTokenExpiredError(error: any): boolean {
  if (!error) return false;
  
  // Si es un 401, probablemente es token expirado o inválido
  if (error?.response?.status === 401) {
    const errorMessage = String(error?.response?.data?.error || error?.message || '').toLowerCase();
    
    // Verificar mensajes específicos de token expirado
    if (
      errorMessage.includes('id-token-expired') ||
      errorMessage.includes('token has expired') ||
      errorMessage.includes('token expired') ||
      errorMessage.includes('expired') ||
      errorMessage.includes('invalid token') ||
      errorMessage.includes('token inválido')
    ) {
      return true;
    }
    
    // Si es 401 y no hay mensaje específico, asumir que puede ser token expirado
    // (mejor intentar refrescar que fallar directamente)
    return true;
  }
  
  return false;
}

/**
 * Verifica si el token está próximo a expirar o ya expiró (menos de 5 minutos o ya expirado)
 */
export function isTokenNearExpiry(token: string | null): boolean {
  if (!token) return true;
  
  try {
    // Decodificar el token JWT (sin verificar la firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return true;
    
    // Verificar si expira en menos de 5 minutos (300 segundos) o ya expiró
    const expiresIn = exp - Math.floor(Date.now() / 1000);
    
    // Si ya expiró (expiresIn < 0) o está próximo a expirar (< 5 minutos)
    return expiresIn < 300; // 5 minutos o ya expirado
  } catch (error) {
    // Si no se puede decodificar, asumir que está próximo a expirar o expirado
    console.warn('⚠️ [TokenRefresh] Error al decodificar token:', error);
    return true;
  }
}

/**
 * Verifica si el token ya expiró completamente
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return true;
    
    const expiresIn = exp - Math.floor(Date.now() / 1000);
    return expiresIn <= 0; // Ya expiró
  } catch (error) {
    console.warn('⚠️ [TokenRefresh] Error al verificar expiración del token:', error);
    return true;
  }
}

