/**
 * Configuración centralizada de rutas protegidas
 * Esta configuración puede ser compartida entre el middleware y los componentes
 */

import { type UserRole } from '../types/user';

/**
 * Configuración de rutas protegidas
 */
export const routeConfig = {
  // Rutas públicas (no requieren autenticación)
  public: ['/login', '/register', '/forgot-password', '/register/verify-email'],
  
  // Rutas de autenticación (solo accesibles si NO estás autenticado)
  authOnly: ['/login', '/register', '/forgot-password'],
  
  // Rutas protegidas por rol
  protected: {
    '/admin': ['ADMIN'] as UserRole[],
    '/admin/home': ['ADMIN'] as UserRole[],
    '/admin/productos': ['ADMIN'] as UserRole[],
  },
  
  // Rutas que requieren autenticación pero cualquier rol puede acceder
  authenticated: ['/cliente', '/profile', '/dashboard'],
} as const;

/**
 * Verifica si una ruta es pública
 */
export function isPublicRoute(pathname: string): boolean {
  return routeConfig.public.some(route => pathname.startsWith(route));
}

/**
 * Verifica si una ruta es solo para usuarios no autenticados
 */
export function isAuthOnlyRoute(pathname: string): boolean {
  return routeConfig.authOnly.some(route => pathname.startsWith(route));
}

/**
 * Obtiene el rol requerido para una ruta protegida
 */
export function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(routeConfig.protected)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  
  // Verifica si es una ruta que requiere autenticación (cualquier rol)
  if (routeConfig.authenticated.some(route => pathname.startsWith(route))) {
    return []; // Array vacío significa "cualquier rol autenticado"
  }
  
  return null;
}

/**
 * Verifica si un usuario tiene el rol necesario para acceder a una ruta
 */
export function hasRequiredRole(userRole: UserRole | null, requiredRoles: UserRole[]): boolean {
  if (requiredRoles.length === 0) {
    // Si no hay roles requeridos, solo necesita estar autenticado
    return userRole !== null;
  }
  
  if (!userRole) {
    return false;
  }
  
  return requiredRoles.includes(userRole);
}

