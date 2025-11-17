import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/cookies';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
        // Limpiar cookies y redirigir a login
        const { clearAuthCookies } = require('../utils/cookies');
        clearAuthCookies();
        window.location.href = '/login';
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
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
