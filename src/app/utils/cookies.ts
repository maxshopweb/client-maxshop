/**
 * Utilidades para manejar cookies
 * Necesarias para que el middleware de Next.js pueda leer el estado de autenticación
 */

/**
 * Configuración de cookies
 */
const COOKIE_CONFIG = {
  token: 'auth-token',
  role: 'user-role',
  estado: 'user-estado',
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
} as const;

/**
 * Establece una cookie de forma síncrona y verifica que se guardó
 */
export function setCookie(name: string, value: string, days: number = 7): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieValue = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${COOKIE_CONFIG.path}; SameSite=${COOKIE_CONFIG.sameSite}${COOKIE_CONFIG.secure ? '; Secure' : ''}`;
  
  document.cookie = cookieValue;
  
  // Verificar que se guardó correctamente
  const saved = getCookie(name);
  return saved === value;
}

/**
 * Obtiene el valor de una cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

/**
 * Elimina una cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_CONFIG.path};`;
}

/**
 * Guarda el token de autenticación en una cookie y sessionStorage como respaldo
 */
export function setAuthToken(token: string): void {
  const days = COOKIE_CONFIG.maxAge / (24 * 60 * 60);
  setCookie(COOKIE_CONFIG.token, token, days);
  // Guardar también en sessionStorage como respaldo para rutas de registro
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth-token-backup', token);
  }
}

/**
 * Guarda el rol del usuario en una cookie y sessionStorage como respaldo
 */
export function setUserRole(role: string): void {
  const days = COOKIE_CONFIG.maxAge / (24 * 60 * 60);
  setCookie(COOKIE_CONFIG.role, role, days);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('user-role-backup', role);
  }
}

/**
 * Guarda el estado del usuario en una cookie y sessionStorage como respaldo
 */
export function setUserEstado(estado: number | null): void {
  if (estado !== null) {
    const days = COOKIE_CONFIG.maxAge / (24 * 60 * 60);
    setCookie(COOKIE_CONFIG.estado, estado.toString(), days);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user-estado-backup', estado.toString());
    }
  } else {
    deleteCookie(COOKIE_CONFIG.estado);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user-estado-backup');
    }
  }
}

/**
 * Obtiene el token de autenticación de las cookies
 */
export function getAuthToken(): string | null {
  return getCookie(COOKIE_CONFIG.token);
}

/**
 * Obtiene el rol del usuario de las cookies
 */
export function getUserRole(): string | null {
  return getCookie(COOKIE_CONFIG.role);
}

/**
 * Elimina todas las cookies de autenticación y sessionStorage
 */
export function clearAuthCookies(): void {
  deleteCookie(COOKIE_CONFIG.token);
  deleteCookie(COOKIE_CONFIG.role);
  deleteCookie(COOKIE_CONFIG.estado);
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth-token-backup');
    sessionStorage.removeItem('user-role-backup');
    sessionStorage.removeItem('user-estado-backup');
  }
}

/**
 * Sincroniza el estado de autenticación con las cookies
 * Debe llamarse cuando el token, rol o estado cambien
 * Retorna una promesa que se resuelve cuando las cookies están guardadas
 */
export function syncAuthCookies(token: string | null, role: string | null, estado?: number | null): Promise<void> {
  return new Promise((resolve) => {
    if (token && role) {
      setAuthToken(token);
      setUserRole(role);
      if (estado !== undefined) {
        setUserEstado(estado);
      }
      // Esperar más tiempo para asegurar que las cookies se hayan guardado completamente
      // Esto es crítico para que el middleware pueda leerlas después de la redirección
      setTimeout(() => {
        // Verificar que las cookies se guardaron correctamente
        const tokenSaved = getCookie(COOKIE_CONFIG.token);
        const roleSaved = getCookie(COOKIE_CONFIG.role);
        if (tokenSaved === token && roleSaved === role) {
          resolve();
        } else {
          // Si no se guardaron, intentar de nuevo
          setAuthToken(token);
          setUserRole(role);
          if (estado !== undefined) {
            setUserEstado(estado);
          }
          setTimeout(() => resolve(), 200);
        }
      }, 300);
    } else {
      clearAuthCookies();
      resolve();
    }
  });
}

