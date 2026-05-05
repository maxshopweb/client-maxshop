import { NextRequest, NextResponse } from "next/server";

const _maintenanceCache = { active: false, expiresAt: 0 };

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001";
  return base.replace(/\/+$/, "");
}

async function isMaintenanceModeActive(): Promise<boolean> {
  if (Date.now() < _maintenanceCache.expiresAt) {
    return _maintenanceCache.active;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${getApiBaseUrl()}/config/tienda/`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; data?: { modo_mantenimiento?: boolean } };
      const active = Boolean(json?.data?.modo_mantenimiento);
      _maintenanceCache.active = active;
      _maintenanceCache.expiresAt = Date.now() + 30_000;
    }
  } catch {
    // Mantener valor cacheado anterior
  }
  return _maintenanceCache.active;
}

function isMaintenanceExemptPath(pathname: string): boolean {
  return (
    pathname === "/mantenimiento" ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/auth-action" ||
    pathname.startsWith("/auth-action/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isMaintenanceExemptPath(pathname)) {
    const maintenanceOn = await isMaintenanceModeActive();
    if (maintenanceOn) {
      const url = new URL("/mantenimiento", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Rutas de autenticación que son PÚBLICAS (no requieren autenticación)
  // forgot-password y reset-password son para usuarios no logueados (recuperar contraseña)
  const publicAuthRoutes = ["/register", "/login", "/forgot-password", "/reset-password"];
  const isPublicAuthRoute = publicAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Si es ruta pública de autenticación, permitir acceso
  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  // Rutas que requieren autenticación:
  // 1. /admin y todo lo que esté en admin
  // 2. /mi-cuenta y todo lo que esté en mi-cuenta
  // 3. Rutas de auth protegidas: /register/verify-email, /register/complete-perfil (forgot/reset son públicas)
  const isAdminRoute = pathname.startsWith("/admin");
  const isMiCuentaRoute = pathname === "/mi-cuenta" || pathname.startsWith("/mi-cuenta/");
  const isProtectedAuthRoute =
    pathname === "/register/verify-email" ||
    pathname.startsWith("/register/verify-email/") ||
    pathname === "/register/complete-perfil" ||
    pathname.startsWith("/register/complete-perfil/");

  // Si es una ruta protegida, verificar autenticación
  if (isAdminRoute || isMiCuentaRoute || isProtectedAuthRoute) {
    const token = request.cookies.get("auth-token")?.value;
    const role = request.cookies.get("user-role")?.value;
    const estado = request.cookies.get("user-estado")?.value;

    console.log("🛡️ [middleware] Verificando ruta protegida:", {
      pathname,
      isAdminRoute,
      isMiCuentaRoute,
      isProtectedAuthRoute,
      token: token ? "EXISTS" : "MISSING",
      role,
      estado,
      allCookies: Object.fromEntries(request.cookies.getAll().map((c) => [c.name, c.value ? "EXISTS" : "MISSING"])),
    });

    if (!token) {
      console.log("❌ [middleware] No hay token, redirigiendo a login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute || isMiCuentaRoute) {
      if (estado && estado !== "3" && estado !== "null") {
        const estadoNum = parseInt(estado, 10);
        if (estadoNum === 1 || estadoNum === 2) {
          console.log("⚠️ [middleware] Estado incompleto, redirigiendo a completar perfil:", estado);
          const completePerfilUrl = new URL("/register/complete-perfil", request.url);
          return NextResponse.redirect(completePerfilUrl);
        }
      }
    }

    if (isAdminRoute) {
      console.log("🔐 [middleware] Verificando rol para ruta admin:", {
        role,
        expected: "ADMIN",
        match: role === "ADMIN",
        type: typeof role,
      });
      if (role !== "ADMIN") {
        console.log("❌ [middleware] Rol no es ADMIN, redirigiendo a home. Role recibido:", role);
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
      }
      console.log("✅ [middleware] Rol ADMIN verificado, permitiendo acceso");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/admin/:path*",
  ],
};
