"use client";

import { useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import { ShippingFormData } from "../../schemas/shippingForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCotizarEnvio } from "./useCotizarEnvio";

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
  const { isAuthenticated } = useAuth();
  const cotizarEnvioMutation = useCotizarEnvio();

  const tipoEntrega = watch('tipoEntrega');
  const address = watch('address');
  const city = watch('city');
  const state = watch('state');
  const postalCode = watch('postalCode');

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

  // Cotizar automáticamente cuando TODOS los campos de dirección estén completos
  useEffect(() => {
    if (!enabled) return;

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
    isAuthenticated,
    cotizarEnvioMutation.isPending,
    cotizarEnvioMutation,
    setCostoEnvio,
  ]);

  return {
    isCotizando: cotizarEnvioMutation.isPending,
    tipoEntrega,
  };
}

