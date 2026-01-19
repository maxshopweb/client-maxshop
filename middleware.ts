import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas de autenticación que son PÚBLICAS (no requieren autenticación)
  const publicAuthRoutes = ['/register', '/login'];
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Si es ruta pública de autenticación, permitir acceso
  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  // Rutas que requieren autenticación:
  // 1. /admin y todo lo que esté en admin
  // 2. /mi-cuenta y todo lo que esté en mi-cuenta
  // 3. Rutas de auth protegidas: /register/verify-email, /register/complete-perfil, /forgot-password, /reset-password
  const isAdminRoute = pathname.startsWith('/admin');
  const isMiCuentaRoute = pathname === '/mi-cuenta' || pathname.startsWith('/mi-cuenta/');
  const isProtectedAuthRoute = 
    pathname === '/register/verify-email' || 
    pathname.startsWith('/register/verify-email/') ||
    pathname === '/register/complete-perfil' || 
    pathname.startsWith('/register/complete-perfil/') ||
    pathname === '/forgot-password' || 
    pathname.startsWith('/forgot-password/') ||
    pathname === '/reset-password' || 
    pathname.startsWith('/reset-password/');

  // Si es una ruta protegida, verificar autenticación
  if (isAdminRoute || isMiCuentaRoute || isProtectedAuthRoute) {
    // Obtener token, rol y estado de las cookies (el middleware se ejecuta en el servidor)
    const token = request.cookies.get('auth-token')?.value;
    const role = request.cookies.get('user-role')?.value;
    const estado = request.cookies.get('user-estado')?.value;

    // Verificar que existe el token
    if (!token) {
      // Redirigir al login si no hay token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el estado es 3 (perfil completo) para rutas que lo requieren
    // Las rutas de auth protegidas pueden tener estado 1 o 2 (en proceso de registro)
    if (isAdminRoute || isMiCuentaRoute) {
      // Para admin y mi-cuenta, requerir estado 3
      if (estado && estado !== '3' && estado !== 'null') {
        const estadoNum = parseInt(estado);
        if (estadoNum === 1 || estadoNum === 2) {
          const completePerfilUrl = new URL('/register/complete-perfil', request.url);
          return NextResponse.redirect(completePerfilUrl);
        }
      }
    }

    // Para rutas admin, verificar que el rol es ADMIN
    if (isAdminRoute) {
      if (role !== 'ADMIN') {
        // Redirigir a la página principal si no es admin
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  // Permitir continuar si pasa todas las validaciones
  // La ruta raíz (/) y todas las demás rutas son públicas
  return NextResponse.next();
}

// Configurar qué rutas deben ejecutar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/admin/:path*',
  ],
};