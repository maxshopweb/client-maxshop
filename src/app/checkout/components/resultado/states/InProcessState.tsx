"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface InProcessStateProps {
  id_venta?: string | number;
}

export default function InProcessState({ id_venta }: InProcessStateProps) {
  const config: IResultConfig = {
    titulo: "Pago en Revisión",
    mensaje: "Tu pago está siendo revisado. Este proceso puede tardar entre 1 y 2 días hábiles. Te notificaremos por email cuando se complete la revisión.",
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

