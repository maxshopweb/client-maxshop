"use client";

import { useEffect, useState } from "react";
import { ventasService } from "@/app/services/venta.service";
import type { CheckoutResultStatus } from "@/app/types/checkout-result.type";

function mapEstadoPagoToCheckoutStatus(
  estadoPago: string | null | undefined
): CheckoutResultStatus | null {
  if (!estadoPago) return null;
  switch (estadoPago) {
    case "aprobado":
      return "approved";
    case "rechazado":
      return "rejected";
    case "pendiente":
      return "pending";
    case "cancelado":
      return "cancelled";
    default:
      return null;
  }
}

export interface CheckoutMpSyncState {
  isSyncing: boolean;
  syncedStatus: CheckoutResultStatus | null;
  estadoPago: string | null;
  error: string | null;
}

export function useCheckoutMpSync(input: {
  payment_id?: string | null;
  id_venta?: string | number;
  external_reference?: string | null;
}): CheckoutMpSyncState {
  const [state, setState] = useState<CheckoutMpSyncState>({
    isSyncing: false,
    syncedStatus: null,
    estadoPago: null,
    error: null,
  });

  useEffect(() => {
    const paymentId = input.payment_id?.trim();
    if (!paymentId) {
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isSyncing: true, error: null }));

    ventasService
      .syncMercadoPagoPayment({
        payment_id: paymentId,
        id_venta: input.id_venta,
        external_reference: input.external_reference ?? undefined,
      })
      .then((data) => {
        if (cancelled) return;
        const estadoPago = data.venta?.estado_pago ?? null;
        setState({
          isSyncing: false,
          syncedStatus: mapEstadoPagoToCheckoutStatus(estadoPago),
          estadoPago,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "No se pudo sincronizar el pago";
        setState({
          isSyncing: false,
          syncedStatus: null,
          estadoPago: null,
          error: message,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [input.payment_id, input.id_venta, input.external_reference]);

  return state;
}
