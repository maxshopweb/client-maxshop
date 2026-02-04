"use client";

import { useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import { useCartStore } from "@/app/stores/cartStore";
import type { DatosEnvioFormData } from "@/app/schemas/envio.schema";

interface UseFormDataSyncParams {
  watch: UseFormWatch<DatosEnvioFormData>;
}

/**
 * Hook responsible for syncing form data to the cart store.
 * Persists form changes to global state for checkout flow.
 */
export function useFormDataSync({ watch }: UseFormDataSyncParams): void {
  const { setDatosEnvio } = useCartStore();

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.tipo) {
        setDatosEnvio(data as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setDatosEnvio]);
}
