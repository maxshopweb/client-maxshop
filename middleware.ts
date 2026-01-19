import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas de autenticación que NO deben ser protegidas
  const authRoutes = ['/register', '/login', '/register/verify-email', '/register/complete-perfil', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Si es ruta de autenticación, permitir acceso
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Rutas que requieren autenticación (estado 3 - perfil completo)
  // Solo /admin y /mi-cuenta requieren autenticación
  // Todo lo demás en (main) es público
  const isAdminRoute = pathname.startsWith('/admin');
  const isMiCuentaRoute = pathname === '/mi-cuenta' || pathname.startsWith('/mi-cuenta/');

  if (isAdminRoute || isMiCuentaRoute) {
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

    // Verificar que el estado es 3 (perfil completo)
    // Si el estado es 1 o 2, redirigir a complete-perfil
    if (estado && estado !== '3' && estado !== 'null') {
      const estadoNum = parseInt(estado);
      if (estadoNum === 1 || estadoNum === 2) {
        const completePerfilUrl = new URL('/register/complete-perfil', request.url);
        return NextResponse.redirect(completePerfilUrl);
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
  // La ruta raíz (/) y todas las demás rutas en (main) son públicas
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