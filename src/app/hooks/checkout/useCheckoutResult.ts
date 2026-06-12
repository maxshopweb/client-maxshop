"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  ICheckoutResult,
  LocalPaymentMethod,
} from "../../types/checkout-result.type";
import {
  parseVentaIdFromExternalReference,
  resolveCheckoutResultStatus,
} from "../../utils/checkoutResult.utils";

/**
 * Hook para obtener el resultado del checkout desde los parámetros de la URL
 */
export function useCheckoutResult(): ICheckoutResult {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const statusParam = searchParams.get("status");
    const metodo = searchParams.get("metodo") as LocalPaymentMethod | null;
    const idVentaParam = searchParams.get("id_venta");
    const cod_interno = searchParams.get("cod_interno") || undefined;
    const metodo_pago = searchParams.get("metodo_pago");
    const payment_status = searchParams.get("payment_status");
    const collection_status = searchParams.get("collection_status");
    const external_reference = searchParams.get("external_reference");
    const payment_id =
      searchParams.get("payment_id") ||
      searchParams.get("collection_id") ||
      null;
    const preference_id = searchParams.get("preference_id");
    const collection_id = searchParams.get("collection_id");

    const id_venta =
      idVentaParam ||
      parseVentaIdFromExternalReference(external_reference) ||
      undefined;

    const resolved = resolveCheckoutResultStatus({
      statusParam,
      payment_status,
      collection_status,
      metodo,
      metodo_pago,
      id_venta,
      payment_id,
      external_reference,
      preference_id,
      collection_id,
    });

    return {
      status: resolved.status,
      mensaje: resolved.mensaje,
      id_venta: id_venta || undefined,
      cod_interno: cod_interno || undefined,
      metodo_pago: metodo_pago || metodo || undefined,
      payment_id: payment_id || undefined,
      external_reference: external_reference || undefined,
    };
  }, [searchParams]);
}
