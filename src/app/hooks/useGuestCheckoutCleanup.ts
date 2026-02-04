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
    
    // Marcar que estaba en checkout si está ahí ahora
    if (isInCheckout) {
      wasInCheckoutRef.current = true;
      return;
    }

    // Si estaba en checkout y ahora sale (pero no a /checkout/resultado)
    // Cerrar sesión solo si realmente salió completamente de checkout
    if (wasInCheckoutRef.current && !isInCheckout && isGuest) {
      logout().catch(console.error);
      wasInCheckoutRef.current = false;
    }
  }, [pathname, isGuest, logout, loading]);
}

