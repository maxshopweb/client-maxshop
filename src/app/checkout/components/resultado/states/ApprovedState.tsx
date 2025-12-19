"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import { IResultConfig } from "../../types/checkout-result.type";

interface ApprovedStateProps {
  id_venta?: string | number;
}

export default function ApprovedState({ id_venta }: ApprovedStateProps) {
  const config: IResultConfig = {
    titulo: "¡Pedido Aprobado!",
    mensaje: "Tu pedido fue aprobado exitosamente. Recibirás un email con todos los detalles de tu compra y el seguimiento del envío.",
    icono: "CheckCircle2",
    color: "success",
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

