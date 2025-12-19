import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/cookies';
import { refreshFirebaseToken, isTokenExpiredError, isTokenNearExpiry, isTokenExpired } from '../utils/tokenRefresh';

// Determinar la URL base según el entorno
const getBaseURL = (): string => {
  // Si hay una variable de entorno definida, usarla (tiene prioridad)
  // if (process.env.NEXT_PUBLIC_API_URL) {
  //   return process.env.NEXT_PUBLIC_API_URL;
  // }
  
  // Por defecto: backend en puerto 3001
  const baseURL = 'http://localhost:3001/api';
  return baseURL;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en cada request
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // Intentar obtener token de las cookies primero
      let token = getAuthToken();
      
      // Si no hay token en cookies, intentar obtenerlo del store de Zustand como respaldo
      if (!token) {
        try {
          const { useAuthStore } = require('../stores/userStore');
          const storeToken = useAuthStore.getState().token;
          if (storeToken) {
            token = storeToken;
            // Intentar guardar en cookies para futuras peticiones
            const { setAuthToken } = require('../utils/cookies');
            setAuthToken(storeToken);
          }
        } catch (e) {
          // Si falla, continuar sin token
          console.warn('No se pudo obtener el token del store:', e);
        }
      }
      
      // Si hay token, verificar si está próximo a expirar o ya expiró y refrescarlo
      if (token) {
        const needsRefresh = isTokenNearExpiry(token);
        const alreadyExpired = isTokenExpired(token);
        
        if (needsRefresh || alreadyExpired) {
          try {
            console.log(`🔄 [Axios] Token ${alreadyExpired ? 'expirado' : 'próximo a expirar'}, refrescando...`);
            
            // Refrescar el token
            const newToken = await refreshFirebaseToken();
            if (newToken) {
              token = newToken;
              console.log('✅ [Axios] Token refrescado exitosamente');
            } else {
              console.warn('⚠️ [Axios] No se pudo obtener nuevo token');
            }
          } catch (error) {
            // Si falla el refresh, usar el token actual (aunque esté expirado)
            // El interceptor de respuesta lo manejará
            console.warn('⚠️ [Axios] Error al refrescar el token:', error);
          }
        }
      }
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Manejar errores comunes
    if (error.response?.status === 401) {
      // Siempre intentar refrescar el token en un 401 (no solo cuando detectamos el mensaje específico)
      // Esto cubre casos donde el token expiró pero el mensaje puede variar
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          console.log('🔄 [Axios] Token expirado o inválido, intentando refrescar...');
          
          // Intentar refrescar el token
          const newToken = await refreshFirebaseToken();
          
          if (newToken && originalRequest.headers) {
            console.log('✅ [Axios] Token refrescado, reintentando petición...');
            
            // Actualizar el header con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Reintentar la petición original con el nuevo token
            return axiosInstance(originalRequest);
          } else {
            console.warn('⚠️ [Axios] No se pudo refrescar el token');
          }
        } catch (refreshError) {
          console.error('❌ [Axios] Error al refrescar token:', refreshError);
          // Si falla el refresh, continuar con el flujo normal de error 401
        }
      }
      
      // Token inválido o expirado (y no se pudo refrescar)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        
        // NO redirigir automáticamente si estamos en checkout
        // El componente manejará el error y mostrará un mensaje apropiado
        if (currentPath.startsWith('/checkout')) {
          // Solo limpiar cookies si realmente el token es inválido
          // Pero NO redirigir, dejar que el componente maneje el error
          return Promise.reject(error);
        }
        
        // Limpiar cookies y redirigir a login con la página actual como redirect
        const { clearAuthCookies } = require('../utils/cookies');
        clearAuthCookies();
        
        // No agregar redirect si ya estamos en una ruta de auth
        if (currentPath.startsWith('/login') || currentPath.startsWith('/register') || currentPath.startsWith('/forgot-password')) {
          window.location.href = '/login';
        } else {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    
    if (error.response?.status === 403) {
      // Usuario sin permisos
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
    
    if (error.response?.status === 500) {
      // Error del servidor
      console.error('Error del servidor:', error.response.data);
    }
    
    // Log para debugging
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      console.error('❌ Error de conexión:', {
        message: 'No se pudo conectar al servidor',
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        suggestion: 'Verifica que el backend esté corriendo en http://localhost:3001'
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
