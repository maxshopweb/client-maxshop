"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface RefundedStateProps {
  id_venta?: string | number;
}

export default function RefundedState({ id_venta }: RefundedStateProps) {
  const config: IResultConfig = {
    titulo: "Pago Reembolsado",
    mensaje: "Tu pago fue reembolsado exitosamente. El dinero será acreditado en tu cuenta según los tiempos de tu banco o método de pago. Si tienes dudas, contacta con nuestro soporte.",
    icono: "Info",
    color: "info",
    acciones: [
      {
        label: "Ver Mis Pedidos",
        variant: "primary",
        href: "/mi-cuenta",
      },
      {
        label: "Contactar Soporte",
        variant: "outline-primary",
        href: "/contacto",
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

