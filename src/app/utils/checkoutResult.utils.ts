import type {
  CheckoutResultStatus,
  ICheckoutResult,
  MercadoPagoStatus,
} from "@/app/types/checkout-result.type";

const MERCADO_PAGO_STATUSES: MercadoPagoStatus[] = [
  "pending",
  "approved",
  "authorized",
  "in_process",
  "in_mediation",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
];

export function isMercadoPagoCheckoutStatus(status: CheckoutResultStatus): boolean {
  return MERCADO_PAGO_STATUSES.includes(status as MercadoPagoStatus);
}

const MERCADO_PAGO_STATUS_SET = new Set<string>(MERCADO_PAGO_STATUSES);

/** Etiquetas legibles del estado en Mercado Pago (pasarela), no confundir con estado_pago de la venta */
export const MERCADO_PAGO_STATUS_LABELS: Record<MercadoPagoStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  authorized: "Autorizado",
  in_process: "En revisión",
  in_mediation: "En mediación",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  charged_back: "Contracargo",
};

export function getMercadoPagoStatusLabel(
  status: string | null | undefined
): string {
  if (!status) return "Sin registro en Mercado Pago";
  if (isMercadoPagoPaymentStatus(status)) {
    return MERCADO_PAGO_STATUS_LABELS[status];
  }
  return status;
}

/** Extrae id_venta desde external_reference de MP (formato venta_{id}) */
export function parseVentaIdFromExternalReference(
  externalReference: string | null | undefined
): string | undefined {
  if (!externalReference) return undefined;
  const match = externalReference.match(/^venta_(\d+)$/);
  return match ? match[1] : undefined;
}

export function isMercadoPagoPaymentStatus(
  value: string | null | undefined
): value is MercadoPagoStatus {
  return value != null && MERCADO_PAGO_STATUS_SET.has(value);
}

export interface ResolveCheckoutStatusInput {
  statusParam: string | null;
  payment_status: string | null;
  collection_status: string | null;
  metodo: string | null;
  metodo_pago: string | null;
  id_venta: string | undefined;
  payment_id: string | null;
  external_reference: string | null;
  preference_id: string | null;
  collection_id: string | null;
}

export interface ResolveCheckoutStatusResult {
  status: CheckoutResultStatus;
  mensaje?: string;
}

/**
 * Resuelve el estado de la pantalla de resultado sin dejar "processing" indefinido.
 */
export function resolveCheckoutResultStatus(
  input: ResolveCheckoutStatusInput
): ResolveCheckoutStatusResult {
  const {
    statusParam,
    payment_status,
    collection_status,
    metodo,
    metodo_pago,
    id_venta,
    payment_id,
    external_reference,
    preference_id,
    collection_id,
  } = input;

  if (statusParam && isMercadoPagoPaymentStatus(statusParam)) {
    return { status: statusParam };
  }

  if (statusParam?.trim()) {
    const pedidoHint = id_venta ? ` (pedido #${id_venta})` : "";
    return {
      status: "error",
      mensaje: `Recibimos una respuesta de pago no reconocida ("${statusParam}")${pedidoHint}. Tu pedido puede estar registrado; contactanos con el número de operación si lo tenés.`,
    };
  }

  if (payment_status && isMercadoPagoPaymentStatus(payment_status)) {
    return { status: payment_status };
  }

  if (collection_status && isMercadoPagoPaymentStatus(collection_status)) {
    return { status: collection_status };
  }

  if (metodo === "transferencia" || metodo === "efectivo") {
    return { status: metodo };
  }

  if (metodo_pago === "transferencia" || metodo_pago === "efectivo") {
    return { status: metodo_pago };
  }

  if (metodo_pago && isMercadoPagoPaymentStatus(metodo_pago)) {
    return { status: metodo_pago };
  }

  const hasOrder = Boolean(id_venta);
  const hasMpHints = Boolean(
    payment_id || external_reference || preference_id || collection_id
  );

  if (hasOrder || hasMpHints) {
    return {
      status: "pending",
      mensaje:
        "Tu pedido fue registrado correctamente. Estamos confirmando el pago con Mercado Pago; te avisaremos por email cuando se acredite. Si ya pagaste, guardá el número de operación que aparece abajo.",
    };
  }

  return {
    status: "error",
    mensaje:
      "No pudimos identificar el resultado de tu compra. Volvé al checkout para intentar de nuevo o contactanos si el pago ya fue realizado.",
  };
}

/** Si debe mostrarse la pantalla de aterrizaje (sin redirigir a /checkout) */
export function hasCheckoutLandingContext(result: ICheckoutResult): boolean {
  if (result.status === "transferencia" || result.status === "efectivo") {
    return true;
  }
  if (isMercadoPagoCheckoutStatus(result.status)) {
    return true;
  }
  if (result.status === "error") {
    return true;
  }
  if (result.status === "pending") {
    return Boolean(result.id_venta || result.payment_id);
  }
  return false;
}

/** Estado de pago de negocio para el formulario admin (sin mezclar con MP) */
export function resolveEstadoPagoFormValue(
  estado: string | null | undefined
): "pendiente" | "aprobado" | "rechazado" | "cancelado" | "vencido" | undefined {
  const valid = ["pendiente", "aprobado", "rechazado", "cancelado", "vencido"] as const;
  if (estado && (valid as readonly string[]).includes(estado)) {
    return estado as (typeof valid)[number];
  }
  return undefined;
}
