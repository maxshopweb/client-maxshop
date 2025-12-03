import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/cookies';

// Determinar la URL base según el entorno
const getBaseURL = (): string => {
  // Si hay una variable de entorno definida, usarla (tiene prioridad)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
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
  (config: InternalAxiosRequestConfig) => {
    // Obtener token de las cookies (accesible tanto en cliente como en servidor)
    const token = typeof window !== 'undefined' ? getAuthToken() : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error: AxiosError) => {
    // Manejar errores comunes
    if (error.response?.status === 401) {
      // Token inválido o expirado
      if (typeof window !== 'undefined') {
        // Limpiar cookies y redirigir a login con la página actual como redirect
        const { clearAuthCookies } = require('../utils/cookies');
        clearAuthCookies();
        const currentPath = window.location.pathname;
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
