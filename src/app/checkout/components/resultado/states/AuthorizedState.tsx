"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface AuthorizedStateProps {
  id_venta?: string | number;
}

export default function AuthorizedState({ id_venta }: AuthorizedStateProps) {
  const config: IResultConfig = {
    titulo: "Pago Autorizado",
    mensaje: "Tu pago fue autorizado exitosamente. Estamos procesando la captura del pago. Recibirás una confirmación por email cuando se complete.",
    icono: "CheckCircle2",
    color: "info",
    acciones: [
      {
        label: "Ver Mis Pedidos",
        variant: "primary",
        href: "/mi-cuenta",
      },
      {
        label: "Seguir Comprando",
        variant: "outline-primary",
        href: "/tienda/productos",
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

