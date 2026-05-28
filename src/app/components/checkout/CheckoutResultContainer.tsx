"use client";

import { ICheckoutResult } from "../../types/checkout-result.type";
import type { CheckoutStateDisplayProps } from "../../types/checkout-result.type";
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
import ErrorState from "./states/ErrorState";

interface CheckoutResultContainerProps {
  result: ICheckoutResult;
}

function displayProps(result: ICheckoutResult): CheckoutStateDisplayProps {
  return {
    id_venta: result.id_venta,
    cod_interno: result.cod_interno,
    payment_id: result.payment_id,
    mensaje: result.mensaje,
  };
}

export default function CheckoutResultContainer({ result }: CheckoutResultContainerProps) {
  const { status, datos_bancarios } = result;
  const props = displayProps(result);

  switch (status) {
    case "approved":
      return <ApprovedState {...props} />;

    case "pending":
      return <PendingState {...props} />;

    case "authorized":
      return <AuthorizedState {...props} />;

    case "in_process":
      return <InProcessState {...props} />;

    case "in_mediation":
      return <InMediationState {...props} />;

    case "rejected":
      return <RejectedState {...props} />;

    case "cancelled":
      return <CancelledState {...props} />;

    case "refunded":
      return <RefundedState {...props} />;

    case "charged_back":
      return <ChargedBackState {...props} />;

    case "transferencia":
      return (
        <TransferState
          {...props}
          datos_bancarios={datos_bancarios}
          metodo="transferencia"
        />
      );

    case "efectivo":
      return (
        <TransferState
          {...props}
          datos_bancarios={datos_bancarios}
          metodo="efectivo"
        />
      );

    case "error":
      return <ErrorState {...props} />;

    default:
      return <ErrorState {...props} mensaje={props.mensaje ?? "No pudimos mostrar el resultado de tu pedido. Contactanos si necesitás ayuda."} />;
  }
}
