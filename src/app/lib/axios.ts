import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/cookies';
import { refreshFirebaseToken, isTokenExpiredError } from '../utils/tokenRefresh';

// Determinar la URL base según el entorno
const getBaseURL = (): string => {
  // Si hay una variable de entorno definida, usarla (tiene prioridad)
  // if (process.env.NEXT_PUBLIC_API_URL) {
  //   return process.env.NEXT_PUBLIC_API_URL;
  // }
  
  // Por defecto: backend en puerto 3001
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return baseURL;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints públicos que no requieren autenticación
const PUBLIC_ENDPOINTS = [
  '/auth/check-email',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

// Verifica si un endpoint es público (no requiere token)
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Interceptor para agregar token en cada request
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Con FormData no enviar Content-Type para que axios/navegador use multipart/form-data con boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const requestUrl = config.url || '';
      const isPublic = isPublicEndpoint(requestUrl);
      
      // Intentar obtener token de las cookies primero
      let token = getAuthToken();
      let tokenSource = 'cookies';
      
      // Si no hay token en cookies, intentar obtenerlo del store de Zustand como respaldo
      if (!token) {
        try {
          const { useAuthStore } = require('../stores/userStore');
          const storeToken = useAuthStore.getState().token;
          if (storeToken) {
            token = storeToken;
            tokenSource = 'store';
            // Intentar guardar en cookies para futuras peticiones
            const { setAuthToken } = require('../utils/cookies');
            setAuthToken(storeToken);
          }
        } catch (e) {
          // Si falla, continuar sin token
          console.warn('No se pudo obtener el token del store:', e);
        }
      }
      
      // Verificar si ya hay un header de Authorization establecido (por ejemplo, por los servicios)
      const hasExistingAuthHeader = config.headers?.Authorization;
      
      // Logs detallados para debugging solo en rutas específicas, endpoints no públicos, y cuando no hay header ya establecido
      if (!isPublic && !hasExistingAuthHeader && (currentPath.startsWith('/mi-cuenta') || currentPath.startsWith('/checkout'))) {
        // Verificar también el store para comparar
        let storeToken = null;
        try {
          const { useAuthStore } = require('../stores/userStore');
          storeToken = useAuthStore.getState().token;
        } catch (e) {
          // Ignorar
        }
        
        
        // Si no hay token pero hay en el store, intentar sincronizar
        if (!token && storeToken) {
          console.warn('⚠️ [Axios] Token no encontrado en cookies pero sí en store - sincronizando...');
          const { setAuthToken } = require('../utils/cookies');
          setAuthToken(storeToken);
          token = storeToken;
          tokenSource = 'store (sincronizado)';
        }
      }
      
      // NO refrescar el token preventivamente en el interceptor de request
      // Esto causa problemas porque:
      // 1. Puede detectar incorrectamente que el token está expirado
      // 2. Genera múltiples refreshes simultáneos
      // 3. Ralentiza cada request innecesariamente
      // 
      // En su lugar, solo refrescar cuando realmente falle (401 en el interceptor de response)
      // Esto es más seguro y eficiente
      
      // Solo agregar token si existe, el endpoint no es público, y no hay header ya establecido
      if (token && config.headers && !isPublic && !hasExistingAuthHeader) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // Log adicional para verificar que se está agregando
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/mi-cuenta') || currentPath.startsWith('/checkout')) {}
        }
      } else if (!token && !isPublic && !hasExistingAuthHeader) {
        // Si no hay token, el endpoint NO es público, y no hay header ya establecido, log de advertencia
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/mi-cuenta') || currentPath.startsWith('/checkout')) {
            console.error('❌ [Axios] NO HAY TOKEN para agregar al header', {
              'URL': config.url,
              'Método': config.method?.toUpperCase(),
            });
          }
        }
      }
      // Si es endpoint público o ya tiene header de Authorization, no hacer nada
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
      // Verificar si el error es por token expirado
      const isExpired = isTokenExpiredError(error);
      
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const requestUrl = error.config?.url || 'unknown';
        
        // Obtener información del token actual
        let currentToken = null;
        let tokenFromStore = null;
        try {
          currentToken = getAuthToken();
          const { useAuthStore } = require('../stores/userStore');
          tokenFromStore = useAuthStore.getState().token;
        } catch (e) {
          // Ignorar
        }
        
        // Verificar si el token está expirado
        let tokenExpired = false;
        let tokenExpiryTime = null;
        if (currentToken || tokenFromStore) {
          try {
            const tokenToCheck = currentToken || tokenFromStore;
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            tokenExpired = payload.exp < now;
            tokenExpiryTime = new Date(payload.exp * 1000).toISOString();
          } catch (e) {
            // Ignorar si no se puede decodificar
          }
        }
        
        console.error('🚨 [Axios] Error 401 recibido:', {
          'Ruta actual': currentPath,
          'URL del request': requestUrl,
          'Método': error.config?.method?.toUpperCase(),
          'Timestamp': new Date().toISOString(),
          'Token en cookies': !!currentToken,
          'Token en store': !!tokenFromStore,
          'Token expirado': tokenExpired,
          'Token expira en': tokenExpiryTime,
          'Header Authorization enviado': error.config?.headers?.Authorization ? 'SÍ' : 'NO',
          'Error del servidor': error.response?.data,
          'Es error de token expirado': isExpired,
        });
        
        // Si es error de token expirado y no se ha reintentado, intentar refrescar el token
        if (isExpired && !originalRequest._retry) {
          try {
            originalRequest._retry = true;
            
            // Refrescar el token
            const newToken = await refreshFirebaseToken(true);
            
            if (newToken) {
              
              // Actualizar el header con el nuevo token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              
              // Reintentar la petición original
              return axiosInstance(originalRequest);
            } else {
              // No se pudo refrescar el token - la sesión expiró completamente
              // Limpiar estado y redirigir al login silenciosamente
              console.warn('⚠️ [Axios] No se pudo refrescar el token - sesión expirada, limpiando estado...');
              
              const { clearAuthCookies } = require('../utils/cookies');
              const { useAuthStore } = require('../stores/userStore');
              
              // Limpiar cookies y store
              clearAuthCookies();
              useAuthStore.getState().logout();
              
              // Redirigir al login solo si no estamos ya en una ruta de auth
              if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register') && !currentPath.startsWith('/forgot-password')) {
                const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
                window.location.href = redirectUrl;
              }
              
              // Rechazar el error sin mostrar mensajes al usuario
              return Promise.reject(new Error('Sesión expirada'));
            }
          } catch (refreshError) {
            // Error al refrescar - limpiar estado y redirigir
            console.warn('⚠️ [Axios] Error al refrescar token - limpiando estado...');
            
            const { clearAuthCookies } = require('../utils/cookies');
            const { useAuthStore } = require('../stores/userStore');
            
            // Limpiar cookies y store
            clearAuthCookies();
            useAuthStore.getState().logout();
            
            // Redirigir al login solo si no estamos ya en una ruta de auth
            if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register') && !currentPath.startsWith('/forgot-password')) {
              const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
              window.location.href = redirectUrl;
            }
            
            // Rechazar el error sin mostrar mensajes al usuario
            return Promise.reject(new Error('Sesión expirada'));
          }
        }
        
        // NO redirigir automáticamente si estamos en checkout o mi-cuenta
        // Estos componentes manejarán el error y mostrarán un mensaje apropiado
        // o simplemente mostrarán skeleton/loading sin redirigir
        if (currentPath.startsWith('/checkout') || currentPath.startsWith('/mi-cuenta')) {
          return Promise.reject(error);
        }
        
        console.warn('⚠️ [Axios] Redirigiendo a /login desde', currentPath);
        
        // Limpiar cookies y redirigir a login con la página actual como redirect
        const { clearAuthCookies } = require('../utils/cookies');
        clearAuthCookies();
        
        // No agregar redirect si ya estamos en una ruta de auth
        if (currentPath.startsWith('/login') || currentPath.startsWith('/register') || currentPath.startsWith('/forgot-password')) {
          window.location.href = '/login';
        } else {
          const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
          window.location.href = redirectUrl;
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
