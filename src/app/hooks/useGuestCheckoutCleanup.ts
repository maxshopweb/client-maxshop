"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Hook para cerrar sesión de invitados cuando salen de /checkout sin completar la compra
 * Este hook debe usarse solo dentro del layout o componentes de /checkout
 */
export function useGuestCheckoutCleanup() {
  const pathname = usePathname();
  const { isGuest, logout, loading } = useAuth();
  const wasInCheckoutRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    const currentPath = pathname || '';
    const isInCheckout = currentPath.startsWith('/checkout');
    
    if (isInCheckout) {
      wasInCheckoutRef.current = true;
      return () => {
        if (wasInCheckoutRef.current && isGuest) {
          // No llamar logout() desde el cleanup si estamos en resultado: la página ya llamó logout(true).
          // Si llamáramos logout() aquí, sería logout(false) y redirigiría a /.
          if (currentPath.startsWith('/checkout/resultado')) return;
          logout().catch(console.error);
          wasInCheckoutRef.current = false;
        }
      };
    }

    if (wasInCheckoutRef.current && !isInCheckout && isGuest) {
      logout().catch(console.error);
      wasInCheckoutRef.current = false;
    }
  }, [pathname, isGuest, logout, loading]);
}

