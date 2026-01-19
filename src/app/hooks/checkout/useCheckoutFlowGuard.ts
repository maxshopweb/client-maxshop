"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "./useCheckoutStore";

export type GuardResult = {
  isValid: boolean;
  reason?: "no-auth" | "no-cart" | "no-step2" | "no-step3";
  redirectTo?: string;
};

/**
 * Hook para validar el acceso al flujo de checkout
 * 
 * Validaciones:
 * - Usuario debe estar autenticado (normal o invitado)
 * - Carrito debe tener al menos un producto (opcional si requireCart = false)
 * - Para Step 3: debe venir del Step 2 (tener personalData)
 * - Para Step 4: debe venir del Step 3 (tener shippingData)
 */
export function useCheckoutFlowGuard(options: {
  requiredStep?: 2 | 3 | 4;
  redirectOnFail?: boolean;
  requireCart?: boolean; // Por defecto true, pero puede ser false para páginas de resultado
} = {}): GuardResult {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items } = useCartStore();
  const { personalData, shippingData, currentStep } = useCheckoutStore();
  const { requireCart = true } = options;

  const result = useMemo<GuardResult>(() => {
    // No validar mientras carga la autenticación
    if (authLoading) {
      return { isValid: true }; // Temporal, esperar a que cargue
    }

    // Validar autenticación
    if (!isAuthenticated) {
      return {
        isValid: false,
        reason: "no-auth",
        redirectTo: `/login?redirect=${encodeURIComponent("/checkout")}`,
      };
    }

    // Validar carrito (solo si se requiere)
    if (requireCart && (!items || items.length === 0)) {
      return {
        isValid: false,
        reason: "no-cart",
        redirectTo: "/",
      };
    }

    // Validar Step 2 completado (para Step 3 y 4)
    if (options.requiredStep === 3 || options.requiredStep === 4) {
      if (!personalData) {
        return {
          isValid: false,
          reason: "no-step2",
          redirectTo: "/checkout?step=2",
        };
      }
    }

    // Validar Step 3 completado (solo para Step 4)
    if (options.requiredStep === 4) {
      if (!shippingData) {
        return {
          isValid: false,
          reason: "no-step3",
          redirectTo: "/checkout?step=3",
        };
      }
    }

    return { isValid: true };
  }, [authLoading, isAuthenticated, items, personalData, shippingData, options.requiredStep, requireCart]);

  // Redirigir automáticamente si está configurado
  useEffect(() => {
    if (options.redirectOnFail && !result.isValid && result.redirectTo) {
      router.push(result.redirectTo);
    }
  }, [result.isValid, result.redirectTo, options.redirectOnFail, router]);

  return result;
}

