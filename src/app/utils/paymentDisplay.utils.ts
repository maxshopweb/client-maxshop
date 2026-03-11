/**
 * Helpers para mostrar en el admin referencia y modo de pago (Mercado Pago y otros).
 * Alineado con los mapeos del backend (excel-formatters) para consistencia.
 */

/** Mapea payment_method_id de MP a texto en español */
export function mapPaymentMethodToLabel(methodId: string | null | undefined): string {
  if (!methodId) return '';
  const map: Record<string, string> = {
    account_money: 'Dinero en Cuenta',
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    ticket: 'Ticket (Rapi Pago, Pago Fácil, etc.)',
    bank_transfer: 'Transferencia Bancaria',
    atm: 'Cajero Automático',
    digital_currency: 'Moneda Digital',
  };
  return map[methodId.toLowerCase()] || methodId;
}

/** Mapea payment_type_id de MP a texto (ej. Visa, Mastercard) */
export function mapPaymentTypeToLabel(
  typeId: string | null | undefined,
  cardInfo?: { payment_method_id?: string } | null
): string {
  if (!typeId) return '';
  if (typeId.toLowerCase() === 'account_money') return 'Dinero en Cuenta';
  if (cardInfo?.payment_method_id) {
    const id = (cardInfo.payment_method_id as string).toLowerCase();
    if (id.includes('visa')) return 'Visa';
    if (id.includes('master')) return 'Mastercard';
    if (id.includes('amex')) return 'American Express';
    if (id.includes('naranja')) return 'Naranja';
    if (id.includes('cabal')) return 'Cabal';
  }
  const map: Record<string, string> = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
  };
  return map[typeId.toLowerCase()] || typeId;
}

/** Texto legible para "modo de pago" en el admin (MP: método + tipo; otro: método) */
export function getModoPagoDisplay(
  mpPayment: { payment_method_id?: string | null; payment_type_id?: string | null; card_info?: unknown } | null | undefined,
  metodoPagoVenta: string | null | undefined
): string {
  if (mpPayment?.payment_method_id || mpPayment?.payment_type_id) {
    const method = mapPaymentMethodToLabel(mpPayment.payment_method_id);
    const type = mapPaymentTypeToLabel(mpPayment.payment_type_id, mpPayment.card_info as { payment_method_id?: string } | null);
    if (method && type && method !== type) return `${method} – ${type}`;
    return method || type || '-';
  }
  if (metodoPagoVenta) {
    const labels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta_debito: 'Tarjeta de Débito',
      tarjeta_credito: 'Tarjeta de Crédito',
      transferencia: 'Transferencia',
      mercadopago: 'MercadoPago',
      otro: 'Otro',
    };
    return labels[metodoPagoVenta.toLowerCase()] || metodoPagoVenta;
  }
  return '-';
}
