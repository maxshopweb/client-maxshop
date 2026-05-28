"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useAuth } from "@/app/context/AuthContext";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import type { CheckoutStateDisplayProps } from "@/app/types/checkout-result.type";

export default function CancelledState({
  id_venta,
  cod_interno,
  payment_id,
  mensaje,
}: CheckoutStateDisplayProps) {
  const { isGuest } = useAuth();
  const wasGuest = useCheckoutStore((state) => state.wasGuest);
  const isGuestUser = wasGuest || isGuest;
  const config = useCheckoutResultConfig("cancelled", undefined, isGuestUser);

  return (
    <>
      <ResultHeader icono={config.icono} titulo={config.titulo} color={config.color} />
      <ResultMessage
        mensaje={mensaje ?? config.mensaje}
        id_venta={id_venta}
        cod_interno={cod_interno}
        payment_id={payment_id}
      />
      <ResultActions acciones={config.acciones} />
    </>
  );
}
