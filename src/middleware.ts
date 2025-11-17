import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rutas protegidas
 */
const PROTECTED_ROUTES = {
  admin: ['/admin'],
  checkout: ['/checkout'],
  // Rutas de registro que requieren autenticación pero solo para usuarios sin completar perfil
  registration: ['/register/verify-email', '/register/complete-perfil']
};

/**
 * Rutas de autenticación que no deben ser accesibles si el usuario ya está autenticado con estado 3
 */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

/**
 * Obtiene el token de las cookies
 */
function getTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get('auth-token')?.value || null;
}

/**
 * Obtiene el rol del usuario de las cookies
 */
function getUserRoleFromCookies(request: NextRequest): string | null {
  return request.cookies.get('user-role')?.value || null;
}

/**
 * Obtiene el estado del usuario de las cookies
 */
function getUserEstadoFromCookies(request: NextRequest): number | null {
  const estado = request.cookies.get('user-estado')?.value;
  return estado ? parseInt(estado, 10) : null;
}

/**
 * Verifica el tipo de ruta protegida
 */
function getRouteType(pathname: string): 'admin' | 'checkout' | 'registration' | null {
  if (PROTECTED_ROUTES.admin.some(route => pathname.startsWith(route))) {
    return 'admin';
  }
  if (PROTECTED_ROUTES.checkout.some(route => pathname.startsWith(route))) {
    return 'checkout';
  }
  if (PROTECTED_ROUTES.registration.some(route => pathname.startsWith(route))) {
    return 'registration';
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromCookies(request);
  const estado = getUserEstadoFromCookies(request);
  const role = getUserRoleFromCookies(request);

  // Si el usuario está autenticado con estado 3 (perfil completo), no puede acceder a rutas de auth
  if (token && estado === 3) {
    // Verificar si está intentando acceder a rutas de autenticación
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    if (isAuthRoute) {
      // Redirigir según el rol
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/home', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // También bloquear rutas de registro (verify-email, complete-perfil)
    const isRegistrationRoute = PROTECTED_ROUTES.registration.some(route => pathname.startsWith(route));
    if (isRegistrationRoute) {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/home', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const routeType = getRouteType(pathname);

  // Si la ruta no está protegida, permitir acceso
  if (!routeType) {
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas de registro: requieren token, pero el estado se valida en el frontend
  if (routeType === 'registration') {
    // Si el usuario tiene estado 3 (perfil completo), no puede acceder a estas rutas
    if (estado === 3) {
      const role = getUserRoleFromCookies(request);
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/home', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Si hay token, permitir acceso (el estado puede estar sincronizando)
    // El frontend validará el estado correcto y redirigirá si es necesario
    return NextResponse.next();
  }

  // Si es ruta de admin, verificar rol
  if (routeType === 'admin') {
    const role = getUserRoleFromCookies(request);
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Checkout solo requiere autenticación (cualquier rol)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
