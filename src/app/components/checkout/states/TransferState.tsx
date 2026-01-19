"use client";

import ResultHeader from "../ResultHeader";
import ResultMessage from "../ResultMessage";
import ResultActions from "../ResultActions";
import BankDetails from "../BankDetails";
import { IBankDetails } from "@/app/types/checkout-result.type";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig";
import { useAuth } from "@/app/context/AuthContext";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

interface TransferStateProps {
  id_venta?: string | number;
  datos_bancarios?: IBankDetails;
  metodo: 'transferencia' | 'efectivo';
}

/**
 * Componente para mostrar el resultado de pedidos con transferencia o efectivo
 * Usa configuración centralizada desde useCheckoutResultConfig
 */
export default function TransferState({ id_venta, datos_bancarios, metodo }: TransferStateProps) {
  const { isGuest } = useAuth();
  const wasGuest = useCheckoutStore((state) => state.wasGuest);
  // Usar wasGuest del store si está disponible, sino usar isGuest del contexto
  const isGuestUser = wasGuest || isGuest;
  const config = useCheckoutResultConfig(metodo, undefined, isGuestUser);

  return (
    <>
      <ResultHeader
        icono={config.icono}
        titulo={config.titulo}
        color={config.color}
      />
      <ResultMessage mensaje={config.mensaje} id_venta={id_venta}>
        {config.mostrarDatosBancarios && datos_bancarios && (
          <BankDetails datos={datos_bancarios} id_venta={id_venta} metodo={metodo} />
        )}
      </ResultMessage>
      <ResultActions acciones={config.acciones} />
    </>
  );
}

