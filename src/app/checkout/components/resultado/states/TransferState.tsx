"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import BankDetails from "../BankDetails";
import { IResultConfig, IBankDetails } from "../../types/checkout-result.type";

interface TransferStateProps {
  id_venta?: string | number;
  datos_bancarios?: IBankDetails;
  metodo: 'transferencia' | 'efectivo';
}

export default function TransferState({ id_venta, datos_bancarios, metodo }: TransferStateProps) {
  const isTransferencia = metodo === 'transferencia';

  const config: IResultConfig = {
    titulo: isTransferencia ? "Pedido Reservado" : "Pedido Confirmado",
    mensaje: isTransferencia
      ? "Tu pedido fue reservado exitosamente. Realiza la transferencia bancaria con los datos que aparecen a continuación. Una vez confirmado el pago, te notificaremos por email."
      : "Tu pedido fue confirmado. El pago se realizará al momento de la entrega. Recibirás un email con los detalles de tu compra.",
    icono: "CheckCircle2",
    color: "info",
    mostrarDatosBancarios: isTransferencia && !!datos_bancarios,
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
      <ResultMessage mensaje={config.mensaje} id_venta={id_venta}>
        {config.mostrarDatosBancarios && datos_bancarios && (
          <BankDetails datos={datos_bancarios} id_venta={id_venta} />
        )}
      </ResultMessage>
      <ResultActions acciones={config.acciones} />
    </>
  );
}

