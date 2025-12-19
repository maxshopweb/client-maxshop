"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface RejectedStateProps {
  id_venta?: string | number;
}

export default function RejectedState({ id_venta }: RejectedStateProps) {
  const config: IResultConfig = {
    titulo: "Pago Rechazado",
    mensaje: "Lo sentimos, tu pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro método de pago.",
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

