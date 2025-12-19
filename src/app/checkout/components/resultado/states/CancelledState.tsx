"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface CancelledStateProps {
  id_venta?: string | number;
}

export default function CancelledState({ id_venta }: CancelledStateProps) {
  const config: IResultConfig = {
    titulo: "Pago Cancelado",
    mensaje: "Tu pago fue cancelado. Si realizaste el pago por error o deseas intentar nuevamente, puedes volver al carrito y completar tu compra.",
    icono: "XCircle",
    color: "error",
    acciones: [
      {
        label: "Volver al Carrito",
        variant: "primary",
        href: "/checkout?step=3",
      },
      {
        label: "Ver Mis Pedidos",
        variant: "outline-primary",
        href: "/mi-cuenta",
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

