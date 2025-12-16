import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas que comienzan con /admin
  if (pathname.startsWith('/admin')) {
    // Obtener token y rol de las cookies (el middleware se ejecuta en el servidor)
    const token = request.cookies.get('auth-token')?.value;
    const role = request.cookies.get('user-role')?.value;

    // Verificar que existe el token
    if (!token) {
      // Redirigir al login si no hay token
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el rol es ADMIN
    if (role !== 'ADMIN') {
      // Redirigir a la página principal si no es admin
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Permitir continuar si pasa todas las validaciones
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