"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useAuth } from "@/app/context/AuthContext";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

interface InProcessStateProps {
  id_venta?: string | number;
}

export default function InProcessState({ id_venta }: InProcessStateProps) {
  const { isGuest } = useAuth();
  const wasGuest = useCheckoutStore((state) => state.wasGuest);
  const isGuestUser = wasGuest || isGuest;
  const config = useCheckoutResultConfig('in_process', undefined, isGuestUser);

  return (
    <>
      <ResultHeader
        icono={config.icono}
        titulo={config.titulo}
        color={config.color}
      />
      <ResultMessage mensaje={config.mensaje} id_venta={id_venta} />
      <ResultActions acciones={config.acciones} />
    </>
  );
}

