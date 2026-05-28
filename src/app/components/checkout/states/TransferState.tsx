"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import BankDetails from "../BankDetails";
import { IBankDetails, type CheckoutStateDisplayProps } from "@/app/types/checkout-result.type";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useCheckoutResultGuest } from "@/app/hooks/checkout/useCheckoutResultGuest";

interface TransferStateProps extends CheckoutStateDisplayProps {
  datos_bancarios?: IBankDetails;
  metodo: "transferencia" | "efectivo";
}

export default function TransferState({
  id_venta,
  cod_interno,
  payment_id,
  mensaje,
  datos_bancarios,
  metodo,
}: TransferStateProps) {
  const isGuestUser = useCheckoutResultGuest();
  const config = useCheckoutResultConfig(metodo, undefined, isGuestUser);

  return (
    <>
      <ResultHeader
        icono={config.icono}
        titulo={config.titulo}
        color={config.color}
      />
      <ResultMessage mensaje={mensaje ?? config.mensaje} id_venta={id_venta} cod_interno={cod_interno} payment_id={payment_id}>
        {config.mostrarDatosBancarios && datos_bancarios && (
          <BankDetails datos={datos_bancarios} id_venta={id_venta} cod_interno={cod_interno} />
        )}
      </ResultMessage>
      <ResultActions acciones={config.acciones} />
    </>
  );
}

