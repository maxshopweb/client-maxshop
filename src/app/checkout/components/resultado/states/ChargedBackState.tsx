"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface ChargedBackStateProps {
  id_venta?: string | number;
}

export default function ChargedBackState({ id_venta }: ChargedBackStateProps) {
  const config: IResultConfig = {
    titulo: "Contracargo Aplicado",
    mensaje: "Se aplicó un contracargo a tu pago. Esto significa que el banco emisor de tu tarjeta revirtió el pago. Por favor, contacta con nuestro equipo de soporte para resolver esta situación.",
    icono: "XCircle",
    color: "error",
    acciones: [
      {
        label: "Contactar Soporte",
        variant: "primary",
        href: "/contacto",
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

