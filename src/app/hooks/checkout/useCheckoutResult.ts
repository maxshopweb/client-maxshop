"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { 
  ICheckoutResult, 
  CheckoutResultStatus,
  MercadoPagoStatus,
  LocalPaymentMethod,
} from "../../types/checkout-result.type";

/**
 * Hook para obtener el resultado del checkout desde los parámetros de la URL
 * 
 * Responsabilidad única: Parsear y normalizar los parámetros de la URL
 * No contiene lógica de UI ni validaciones de acceso
 */
export function useCheckoutResult(): ICheckoutResult {
  const searchParams = useSearchParams();

  return useMemo(() => {
    // Leer parámetros de la URL
    const status = searchParams.get('status') as MercadoPagoStatus | null;
    const metodo = searchParams.get('metodo') as LocalPaymentMethod | null;
    const id_venta = searchParams.get('id_venta');
    const cod_interno = searchParams.get('cod_interno') || undefined;
    const metodo_pago = searchParams.get('metodo_pago');
    const payment_status = searchParams.get('payment_status'); // Alternativo de Mercado Pago

    // Determinar el estado final
    // Prioridad: status > payment_status > metodo > metodo_pago
    let finalStatus: CheckoutResultStatus = 'processing';

    if (status) {
      // Si viene el parámetro 'status' (Mercado Pago)
      finalStatus = status;
    } else if (payment_status) {
      // Si viene 'payment_status' (formato alternativo de Mercado Pago)
      finalStatus = payment_status as MercadoPagoStatus;
    } else if (metodo) {
      // Si es transferencia o efectivo
      finalStatus = metodo;
    } else if (metodo_pago) {
      // Si viene el método de pago en otro formato
      if (metodo_pago === 'transferencia' || metodo_pago === 'efectivo') {
        finalStatus = metodo_pago;
      } else {
        // Intentar interpretar como estado de Mercado Pago
        const mercadoPagoStatuses: MercadoPagoStatus[] = [
          'pending', 'approved', 'authorized', 'in_process', 
          'in_mediation', 'rejected', 'cancelled', 'refunded', 'charged_back'
        ];
        if (mercadoPagoStatuses.includes(metodo_pago as MercadoPagoStatus)) {
          finalStatus = metodo_pago as MercadoPagoStatus;
        }
      }
    }

    return {
      status: finalStatus,
      id_venta: id_venta || undefined,
      cod_interno: cod_interno || undefined,
      metodo_pago: metodo_pago || metodo || undefined,
    };
  }, [searchParams]);
}

