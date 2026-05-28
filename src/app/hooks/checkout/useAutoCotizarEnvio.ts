"use client";

import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { ShippingFormData } from "../../schemas/shippingForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCotizarEnvio } from "./useCotizarEnvio";
import { getCartFingerprint } from "@/app/utils/mapCartItemsToCheckout";

interface UseAutoCotizarEnvioProps {
  watch: UseFormWatch<ShippingFormData>;
  enabled?: boolean;
}

/**
 * Hook que cotiza automáticamente el envío cuando se completan
 * todos los campos de dirección requeridos.
 */
export function useAutoCotizarEnvio({ watch, enabled = true }: UseAutoCotizarEnvioProps) {
  const { setCostoEnvio, setTipoEntrega } = useCheckoutStore();
  const { items } = useCartStore();
  const cartFingerprint = getCartFingerprint(items);
  const prevCartFingerprintRef = useRef<string | null>(null);
  const { isAuthenticated } = useAuth();
  const cotizarEnvioMutation = useCotizarEnvio();

  const tipoEntrega = watch('tipoEntrega');
  const address = watch('address');
  const city = watch('city');
  const state = watch('state');
  const postalCode = watch('postalCode');
  const isAndreaniManualMode = process.env.NEXT_PUBLIC_ANDREANI_MODO_MANUAL === 'true';

  // Actualizar tipoEntrega en el store cuando cambie
  useEffect(() => {
    if (tipoEntrega) {
      setTipoEntrega(tipoEntrega);
      // Si cambia a retiro, limpiar costo de envío
      if (tipoEntrega === 'retiro') {
        setCostoEnvio(0);
      }
    }
  }, [tipoEntrega, setTipoEntrega, setCostoEnvio]);

  // Invalidar costo al cambiar cantidad o productos del carrito
  useEffect(() => {
    if (
      prevCartFingerprintRef.current !== null &&
      prevCartFingerprintRef.current !== cartFingerprint &&
      tipoEntrega === "envio"
    ) {
      setCostoEnvio(null);
    }
    prevCartFingerprintRef.current = cartFingerprint;
  }, [cartFingerprint, tipoEntrega, setCostoEnvio]);

  // Cotizar automáticamente cuando TODOS los campos de dirección estén completos
  useEffect(() => {
    if (!enabled) return;

    if (isAndreaniManualMode) {
      if (tipoEntrega === 'envio') setCostoEnvio(0);
      return;
    }

    const shouldCotizar = 
      tipoEntrega === 'envio' &&
      address && address.length >= 5 &&
      city && city.length >= 2 &&
      state && state.length >= 1 &&
      postalCode && /^\d{4,5}$/.test(postalCode) &&
      items.length > 0 &&
      isAuthenticated &&
      !cotizarEnvioMutation.isPending;

    if (shouldCotizar) {
      // Debounce: esperar 800ms después de que el usuario termine de escribir
      const timeoutId = setTimeout(() => {
        cotizarEnvioMutation.mutate(
          {
            codigoPostal: postalCode,
            ciudad: city,
            provincia: state,
          },
          {
            onSuccess: (data) => {
              setCostoEnvio(data.precio);
            },
            onError: (error: any) => {
              console.error('Error al cotizar envío:', error);
              setCostoEnvio(null);
            },
          }
        );
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [
    enabled,
    tipoEntrega,
    address,
    city,
    state,
    postalCode,
    items.length,
    cartFingerprint,
    isAuthenticated,
    cotizarEnvioMutation.isPending,
    cotizarEnvioMutation,
    setCostoEnvio,
    isAndreaniManualMode,
  ]);

  return {
    isCotizando: cotizarEnvioMutation.isPending,
    tipoEntrega,
  };
}

