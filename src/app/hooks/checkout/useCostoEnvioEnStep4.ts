"use client";

import { useEffect, useRef, useState } from "react";
import { useCheckoutStore } from "./useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useCotizarEnvio } from "./useCotizarEnvio";
import { toast } from "sonner";

/**
 * Calcula el costo de envío en Step 4 cuando hay código postal en el store.
 * Un solo efecto: si tipo es envío, CP válido e items, y no hay costo ya para ese CP → cotizar.
 */
export function useCostoEnvioEnStep4() {
  const { codigoPostal, tipoEntrega, costoEnvio, setCostoEnvio } = useCheckoutStore();
  const { items } = useCartStore();
  const cotizarEnvioMutation = useCotizarEnvio();
  const lastCalculatedCPRef = useRef<string | null>(null);
  const prevCPFromStoreRef = useRef<string | null>(codigoPostal);
  const [isCalculando, setIsCalculando] = useState(false);

  useEffect(() => {
    if (tipoEntrega !== "envio") {
      if (tipoEntrega === "retiro") setCostoEnvio(0);
      return;
    }

    const cpValid = codigoPostal && /^[0-9]{4}$/.test(codigoPostal);
    if (!cpValid || !items.length) return;

    const cpChanged = codigoPostal !== prevCPFromStoreRef.current;
    prevCPFromStoreRef.current = codigoPostal;

    if (cpChanged && costoEnvio != null && costoEnvio !== 0) {
      setCostoEnvio(null);
      lastCalculatedCPRef.current = null;
    }

    const alreadyHasCost = costoEnvio != null && costoEnvio !== 0;
    const sameCP = codigoPostal === lastCalculatedCPRef.current;
    if (!cpChanged && alreadyHasCost) {
      lastCalculatedCPRef.current = codigoPostal;
      return;
    }

    if (cotizarEnvioMutation.isPending || sameCP) {
      if (cotizarEnvioMutation.isPending) setIsCalculando(true);
      return;
    }

    lastCalculatedCPRef.current = codigoPostal;
    setIsCalculando(true);

    cotizarEnvioMutation
      .mutateAsync({ codigoPostal, ciudad: undefined, provincia: undefined })
      .then((data) => {
        const precio = typeof data?.precio === "number" ? data.precio : parseFloat(String(data?.precio || 0));
        if (isNaN(precio) || precio <= 0) {
          setCostoEnvio(null);
          lastCalculatedCPRef.current = null;
          return;
        }
        setCostoEnvio(precio);
      })
      .catch(() => {
        setCostoEnvio(null);
        lastCalculatedCPRef.current = null;
        toast.error("Error al calcular envío", {
          description: "No se pudo calcular el costo de envío. Podés continuar con el pedido.",
        });
      })
      .finally(() => setIsCalculando(false));
  }, [codigoPostal, tipoEntrega, items.length, setCostoEnvio, cotizarEnvioMutation.isPending]);

  const isCalculandoEnvio =
    tipoEntrega === "envio" &&
    codigoPostal != null &&
    (costoEnvio == null || costoEnvio === 0) &&
    (isCalculando || cotizarEnvioMutation.isPending);

  return { isCalculandoEnvio };
}
