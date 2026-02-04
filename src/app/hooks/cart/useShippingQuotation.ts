"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { useCartStore } from "@/app/stores/cartStore";
import { useCotizarEnvio } from "@/app/hooks/checkout/useCotizarEnvio";
import { useDebounce } from "@/app/hooks/useDebounce";
import type { DatosEnvioFormData } from "@/app/schemas/envio.schema";

interface UseShippingQuotationParams {
  watch: UseFormWatch<DatosEnvioFormData>;
  tipoEnvio: 'envio' | 'retiro';
}

interface ShippingQuotationState {
  costoEnvio: number | null;
  isCotizando: boolean;
  errorCotizacion: string | null;
  reset: () => void;
}

/**
 * Hook responsible for automatic shipping cost quotation.
 * Handles debouncing, validation, and prevents duplicate quotations.
 */
export function useShippingQuotation({
  watch,
  tipoEnvio,
}: UseShippingQuotationParams): ShippingQuotationState {
  const { items } = useCartStore();
  const cotizarEnvioMutation = useCotizarEnvio();
  
  const codigo_postal = watch('codigo_postal');
  const ciudad = watch('ciudad');
  const provincia = watch('provincia');

  const [costoEnvio, setCostoEnvio] = useState<number | null>(null);
  const [isCotizando, setIsCotizando] = useState(false);
  const [errorCotizacion, setErrorCotizacion] = useState<string | null>(null);
  
  const ultimoCodigoPostalCotizado = useRef<string | null>(null);
  const codigoPostalDebounced = useDebounce(codigo_postal, 800);

  // Reset quotation state
  const reset = () => {
    setCostoEnvio(0);
    setErrorCotizacion(null);
    ultimoCodigoPostalCotizado.current = null;
  };

  // Auto-quote shipping when valid postal code is available
  useEffect(() => {
    if (tipoEnvio !== 'envio') {
      reset();
      return;
    }

    const codigoPostalValido = codigoPostalDebounced && /^[0-9]{4}$/.test(codigoPostalDebounced);
    const tieneCiudad = ciudad && ciudad.trim().length >= 2;
    const tieneProvincia = provincia && provincia.trim().length >= 1;
    const tieneItems = items && items.length > 0;

    const shouldQuote =
      codigoPostalValido &&
      tieneCiudad &&
      tieneProvincia &&
      tieneItems &&
      codigoPostalDebounced !== ultimoCodigoPostalCotizado.current &&
      !cotizarEnvioMutation.isPending;

    if (shouldQuote) {
      setIsCotizando(true);
      setErrorCotizacion(null);
      ultimoCodigoPostalCotizado.current = codigoPostalDebounced;

      cotizarEnvioMutation.mutate(
        {
          codigoPostal: codigoPostalDebounced,
          ciudad: ciudad,
          provincia: provincia,
        },
        {
          onSuccess: (data) => {
            setCostoEnvio(data.precio);
            setIsCotizando(false);
            setErrorCotizacion(null);
          },
          onError: (error: any) => {
            console.error('Error al cotizar envío:', error);
            setErrorCotizacion(
              error.message || 'Error al calcular el costo de envío. Podés continuar con el pedido.'
            );
            setCostoEnvio(null);
            setIsCotizando(false);
            // Allow retry with same postal code on failure
            ultimoCodigoPostalCotizado.current = null;
          },
        }
      );
    }
  }, [
    tipoEnvio,
    codigoPostalDebounced,
    ciudad,
    provincia,
    items.length,
    cotizarEnvioMutation,
  ]);

  return {
    costoEnvio,
    isCotizando,
    errorCotizacion,
    reset,
  };
}
