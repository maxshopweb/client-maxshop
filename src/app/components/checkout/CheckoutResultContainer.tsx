"use client";

import { ICheckoutResult } from "../../types/checkout-result.type";
import ApprovedState from "./states/ApprovedState";
import PendingState from "./states/PendingState";
import RejectedState from "./states/RejectedState";
import AuthorizedState from "./states/AuthorizedState";
import InProcessState from "./states/InProcessState";
import InMediationState from "./states/InMediationState";
import CancelledState from "./states/CancelledState";
import RefundedState from "./states/RefundedState";
import ChargedBackState from "./states/ChargedBackState";
import TransferState from "./states/TransferState";
import ProcessingState from "./states/ProcessingState";

interface CheckoutResultContainerProps {
  result: ICheckoutResult;
}

export default function CheckoutResultContainer({ result }: CheckoutResultContainerProps) {
  const { status, id_venta, datos_bancarios, metodo_pago } = result;

  // Renderizar según el estado de Mercado Pago o método local
  switch (status) {
    // Estados de Mercado Pago
    case 'approved':
      return <ApprovedState id_venta={id_venta} />;

    case 'pending':
      return <PendingState id_venta={id_venta} />;

    case 'authorized':
      return <AuthorizedState id_venta={id_venta} />;

    case 'in_process':
      return <InProcessState id_venta={id_venta} />;

    case 'in_mediation':
      return <InMediationState id_venta={id_venta} />;

    case 'rejected':
      return <RejectedState id_venta={id_venta} />;

    case 'cancelled':
      return <CancelledState id_venta={id_venta} />;

    case 'refunded':
      return <RefundedState id_venta={id_venta} />;

    case 'charged_back':
      return <ChargedBackState id_venta={id_venta} />;

    // Métodos de pago locales
    case 'transferencia':
      return (
        <TransferState
          id_venta={id_venta}
          datos_bancarios={datos_bancarios}
          metodo="transferencia"
        />
      );

    case 'efectivo':
      return (
        <TransferState
          id_venta={id_venta}
          datos_bancarios={datos_bancarios}
          metodo="efectivo"
        />
      );

    // Estados de procesamiento/error
    case 'processing':
    default:
      return <ProcessingState id_venta={id_venta} />;
  }
}

