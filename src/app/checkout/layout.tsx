'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/app/context/AuthContext";
import { getUserRole } from "@/app/utils/cookies";
import { type UserRole } from "@/app/types/user";
import { useGuestCheckoutCleanup } from '@/app/hooks/useGuestCheckoutCleanup';
import { CheckoutTransitionLoader } from '@/app/components/checkout/CheckoutTransitionLoader';

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { role: contextRole, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Cerrar sesión de invitados cuando salen de /checkout
  useGuestCheckoutCleanup();

  useEffect(() => {
    // No hacer nada mientras carga
    if (loading) {
      return;
    }

    // Leer el rol de las cookies como fallback
    const cookieRole = getUserRole();
    const role = contextRole || (cookieRole as UserRole | null);

    // Si el usuario es ADMIN y está en una ruta no-admin, redirigir a /admin
    if (role === 'ADMIN' && pathname && !pathname.startsWith('/admin')) {
      setIsRedirecting(true);
      router.replace('/admin');
    }
  }, [contextRole, loading, pathname, router]);

  // Si es admin, no renderizar nada mientras redirige
  const cookieRole = typeof window !== 'undefined' ? getUserRole() : null;
  const role = contextRole || (cookieRole as UserRole | null);
  
  if (isRedirecting || (role === 'ADMIN' && pathname && !pathname.startsWith('/admin'))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Layout sin navbar ni footer - solo el contenido del checkout
  return (
    <>
      {/* Loader global durante la creación del pedido y transición */}
      <CheckoutTransitionLoader />
      {children}
    </>
  );
}

