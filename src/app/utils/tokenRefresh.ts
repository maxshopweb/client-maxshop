/**
 * Utilidades para refrescar el token de Firebase cuando expire
 */

import { auth } from '../lib/firebase.config';
import { useAuthStore } from '../stores/userStore';
import { setAuthToken } from './cookies';
import { onAuthStateChanged } from 'firebase/auth';

// Variable para evitar múltiples refreshes simultáneos
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresca el token de Firebase y actualiza el store y las cookies
 * @param forceRefresh Si es true, fuerza la renovación incluso si el token actual es válido
 * @returns El nuevo token o el token actual si es válido, o null si no se pudo obtener
 */
export async function refreshFirebaseToken(forceRefresh: boolean = false): Promise<string | null> {
  // Si ya hay un refresh en progreso, esperar a que termine
  if (refreshPromise && !forceRefresh) {
    return refreshPromise;
  }

  // Crear la promesa de refresh
  refreshPromise = (async (): Promise<string | null> => {
    try {
      // Primero, verificar si hay un token válido en el store
      const storeToken = useAuthStore.getState().token;
      const storeUsuario = useAuthStore.getState().usuario;
      
      // Si hay token en el store y no está expirado, y no se fuerza el refresh
      if (storeToken && storeUsuario && !forceRefresh) {
        const tokenExpired = isTokenExpired(storeToken);
        
        // Si el token no está expirado, devolverlo sin refrescar
        // No verificar si está próximo a expirar aquí, solo si realmente expiró
        // El refresh preventivo puede causar problemas
        if (!tokenExpired) {
          return storeToken;
        }
      }
      
      // Verificar si hay un usuario de Firebase autenticado
      let currentUser = auth.currentUser;
      
      // Si no hay usuario actual, esperar a que Firebase se inicialice usando onAuthStateChanged
      // Pero con un timeout más corto y mejor manejo
      if (!currentUser) {
        // Primero verificar si hay token válido en el store antes de esperar
        if (storeToken && storeUsuario && !isTokenExpired(storeToken)) {
          return storeToken;
        }
        
        // Esperar hasta 1 segundo para que Firebase se inicialice (reducido de 3 segundos)
        const userPromise = new Promise<typeof currentUser>((resolve) => {
          let resolved = false;
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
          }, 1000); // Reducido a 1 segundo
          
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!resolved && user) {
              resolved = true;
              clearTimeout(timeout);
              unsubscribe();
              resolve(user);
            }
          });
          
          // Si ya hay un usuario, resolver inmediatamente
          if (auth.currentUser) {
            resolved = true;
            clearTimeout(timeout);
            unsubscribe();
            resolve(auth.currentUser);
          }
        });
        
        currentUser = await userPromise;
      }
      
      // Si no hay usuario de Firebase pero hay token válido en el store, usar ese token
      if (!currentUser) {
        if (storeToken && storeUsuario) {
          const tokenExpired = isTokenExpired(storeToken);
          
          if (!tokenExpired) {
            return storeToken;
          } else {
            // Token expirado y no hay usuario en Firebase - intentar reactivar la sesión
            // Esto puede pasar si Firebase perdió la sesión pero el token sigue en localStorage
            try {
              // Intentar recargar el estado de autenticación de Firebase
              await auth.authStateReady();
              
              // Verificar nuevamente si hay usuario después de authStateReady
              if (auth.currentUser) {
                currentUser = auth.currentUser;
                // Continuar con el flujo normal de refresh
              } else {
                // No hay forma de refrescar sin sesión activa
                return null;
              }
            } catch (reloadError) {
              // No se pudo reactivar la sesión
              return null;
            }
          }
        } else {
          return null;
        }
      }
      
      // Forzar renovación del token solo si se fuerza explícitamente o si el token está expirado
      // No forzar si solo está próximo a expirar (evitar refreshes innecesarios)
      const shouldForceRefresh = forceRefresh || (storeToken && isTokenExpired(storeToken));
      const newToken = await currentUser.getIdToken(shouldForceRefresh);
      
      if (!newToken) {
        console.warn('⚠️ [TokenRefresh] No se pudo obtener nuevo token');
        // Si hay un token en el store que no está expirado, usarlo como respaldo
        if (storeToken && !isTokenExpired(storeToken)) {
          return storeToken;
        }
        return null;
      }
      
      // Actualizar el store
      const { setToken } = useAuthStore.getState();
      setToken(newToken);
      
      // Actualizar las cookies
      setAuthToken(newToken);
      
      return newToken;
    } catch (error: any) {
      console.error('❌ [TokenRefresh] Error al refrescar token:', error);
      
      // Si hay un token válido en el store, usarlo como respaldo
      const storeToken = useAuthStore.getState().token;
      if (storeToken && !isTokenExpired(storeToken)) {
        return storeToken;
      }
      
      // Si el error es de sesión expirada, limpiar el store
      if (error?.code === 'auth/user-token-expired' || error?.message?.includes('expired')) {
        console.warn('⚠️ [TokenRefresh] Sesión de Firebase expirada');
        const { logout } = useAuthStore.getState();
        logout();
      }
      
      return null;
    } finally {
      // Limpiar la promesa de refresh cuando termine
      refreshPromise = null;
    }
  })();

  return refreshPromise;
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

