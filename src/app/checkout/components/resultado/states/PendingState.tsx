"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface PendingStateProps {
  id_venta?: string | number;
}

export default function PendingState({ id_venta }: PendingStateProps) {
  const config: IResultConfig = {
    titulo: "Pago Pendiente",
    mensaje: "Tu pago está siendo procesado. Te notificaremos por email cuando sea confirmado. Esto puede tardar unos minutos.",
    icono: "Clock",
    color: "warning",
    acciones: [
      {
        label: "Ver Mis Pedidos",
        variant: "primary",
        href: "/mi-cuenta",
      },
      {
        label: "Volver al Inicio",
        variant: "outline-primary",
        href: "/",
      },
    ],
  };

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

