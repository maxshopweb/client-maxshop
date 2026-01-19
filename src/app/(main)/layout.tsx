'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import UnifiedNavbar from "@/app/components/Tienda/UnifiedNavbar";
import Footer from "@/app/components/Tienda/Footer";
import PromoBanner from "@/app/components/Tienda/PromoBanner";
import { useAuth } from "@/app/context/AuthContext";
import { getUserRole } from "@/app/utils/cookies";
import { type UserRole } from "@/app/types/user";
import { useAuthStore } from "@/app/stores/userStore";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { role: contextRole, user, loading } = useAuth();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // No hacer nada mientras carga
    if (loading) {
      return;
    }

    // Solo aplicar redirecciones en rutas protegidas
    // Las rutas protegidas son: /mi-cuenta y /admin
    const isProtectedRoute = pathname?.startsWith('/mi-cuenta') || pathname?.startsWith('/admin');
    
    // Si no es una ruta protegida, permitir acceso sin restricciones
    if (!isProtectedRoute) {
      return;
    }

    // Verificar estado del usuario solo en rutas protegidas
    const currentUser = usuarioStore || user;
    if (currentUser && currentUser.estado !== 3 && currentUser.estado !== null) {
      // Si el estado es 1 o 2, debe completar perfil
      if (currentUser.estado === 1 || currentUser.estado === 2) {
        setIsRedirecting(true);
        router.replace('/register/complete-perfil');
        return;
      }
    }

    // Leer el rol de las cookies como fallback
    const cookieRole = getUserRole();
    const role = contextRole || (cookieRole as UserRole | null);

    // Si el usuario es ADMIN y está en una ruta no-admin, redirigir a /admin
    // Solo aplicar esta regla si está en una ruta protegida
    if (isProtectedRoute && role === 'ADMIN' && pathname && !pathname.startsWith('/admin')) {
      setIsRedirecting(true);
      router.replace('/admin');
    }
  }, [contextRole, user, usuarioStore, loading, pathname, router]);

  // Solo mostrar spinner si realmente está redirigiendo
  // NO redirigir ADMIN desde rutas públicas
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Banner promocional fijo - Arriba del todo */}
      <PromoBanner />
      
      {/* Navbar Unificado */}
      <div className="sticky top-10 z-50">
        <UnifiedNavbar />
      </div>
      <div className="flex flex-col min-h-screen">
        {children}
        <Footer />
      </div>
    </>
  );
}

