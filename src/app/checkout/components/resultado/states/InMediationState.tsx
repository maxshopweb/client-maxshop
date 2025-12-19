"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface InMediationStateProps {
  id_venta?: string | number;
}

export default function InMediationState({ id_venta }: InMediationStateProps) {
  const config: IResultConfig = {
    titulo: "Pago en Mediación",
    mensaje: "Tu pago está en proceso de mediación. Esto ocurre cuando hay una disputa o reclamo. Estamos trabajando para resolverlo. Te mantendremos informado por email sobre el estado.",
    icono: "Info",
    color: "warning",
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

