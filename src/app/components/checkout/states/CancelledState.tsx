"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useAuth } from "@/app/context/AuthContext";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

interface CancelledStateProps {
  id_venta?: string | number;
  cod_interno?: string | null;
}

export default function CancelledState({ id_venta, cod_interno }: CancelledStateProps) {
  const { isGuest } = useAuth();
  const wasGuest = useCheckoutStore((state) => state.wasGuest);
  const isGuestUser = wasGuest || isGuest;
  const config = useCheckoutResultConfig('cancelled', undefined, isGuestUser);

  return (
    <>
      <ResultHeader
        icono={config.icono}
        titulo={config.titulo}
        color={config.color}
      />
      <ResultMessage mensaje={config.mensaje} id_venta={id_venta} cod_interno={cod_interno} />
      <ResultActions acciones={config.acciones} />
    </>
  );
}

