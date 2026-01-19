"use client";

import { useState } from "react";
import { ShippingFormData } from "../../schemas/shippingForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCotizarEnvio } from "./useCotizarEnvio";

/**
 * Hook para cotizar envío al hacer submit del formulario (no automático)
 */
export function useCotizarEnvioOnSubmit() {
  const { setCostoEnvio } = useCheckoutStore();
  const { items } = useCartStore();
  const { isAuthenticated } = useAuth();
  const cotizarEnvioMutation = useCotizarEnvio();
  const [error, setError] = useState<string | null>(null);

  const cotizar = async (data: ShippingFormData): Promise<number | null> => {
    // Solo cotizar si es envío
    if (data.tipoEntrega !== 'envio') {
      setCostoEnvio(0);
      return 0;
    }

    // Validar campos requeridos
    if (!data.postalCode || !data.city || !data.state) {
      setError('Debe completar todos los campos de dirección');
      return null;
    }

    if (!items || items.length === 0) {
      setError('No hay productos en el carrito');
      return null;
    }

    if (!isAuthenticated) {
      setError('Debe estar autenticado para cotizar envío');
      return null;
    }

    setError(null);

    try {
      const result = await cotizarEnvioMutation.mutateAsync({
        codigoPostal: data.postalCode,
        ciudad: data.city,
        provincia: data.state,
      });

      setCostoEnvio(result.precio);
      return result.precio;
    } catch (error: any) {
      console.error('Error al cotizar envío:', error);
      setError(error.message || 'Error al cotizar envío');
      setCostoEnvio(null);
      return null;
    }
  };

  return {
    cotizar,
    isCotizando: cotizarEnvioMutation.isPending,
    error,
  };
}

