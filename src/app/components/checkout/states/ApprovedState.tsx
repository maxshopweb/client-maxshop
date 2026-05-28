"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useCheckoutResultGuest } from "@/app/hooks/checkout/useCheckoutResultGuest";
import type { CheckoutStateDisplayProps } from "@/app/types/checkout-result.type";

export default function ApprovedState({
  id_venta,
  cod_interno,
  payment_id,
  mensaje,
}: CheckoutStateDisplayProps) {
  const isGuestUser = useCheckoutResultGuest();
  const config = useCheckoutResultConfig('approved', undefined, isGuestUser);

  return (
    <>
      <ResultHeader
        icono={config.icono}
        titulo={config.titulo}
        color={config.color}
      />
      <ResultMessage mensaje={mensaje ?? config.mensaje} id_venta={id_venta} cod_interno={cod_interno} payment_id={payment_id} />
      <ResultActions acciones={config.acciones} />
    </>
  );
}

