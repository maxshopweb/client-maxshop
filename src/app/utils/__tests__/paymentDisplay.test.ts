import { describe, it, expect } from 'vitest';
import {
  mapPaymentMethodToLabel,
  mapPaymentTypeToLabel,
  getModoPagoDisplay,
} from '../paymentDisplay.utils';

describe('mapPaymentMethodToLabel', () => {
  it('maps account_money', () => {
    expect(mapPaymentMethodToLabel('account_money')).toBe('Dinero en Cuenta');
  });

  it('maps credit_card', () => {
    expect(mapPaymentMethodToLabel('credit_card')).toBe('Tarjeta de Crédito');
  });

  it('maps debit_card', () => {
    expect(mapPaymentMethodToLabel('debit_card')).toBe('Tarjeta de Débito');
  });

  it('maps ticket', () => {
    expect(mapPaymentMethodToLabel('ticket')).toBe('Ticket (Rapi Pago, Pago Fácil, etc.)');
  });

  it('maps bank_transfer', () => {
    expect(mapPaymentMethodToLabel('bank_transfer')).toBe('Transferencia Bancaria');
  });

  it('maps atm', () => {
    expect(mapPaymentMethodToLabel('atm')).toBe('Cajero Automático');
  });

  it('maps digital_currency', () => {
    expect(mapPaymentMethodToLabel('digital_currency')).toBe('Moneda Digital');
  });

  it('returns unknown as-is', () => {
    expect(mapPaymentMethodToLabel('some_unknown_method')).toBe('some_unknown_method');
  });

  it('returns empty string for null', () => {
    expect(mapPaymentMethodToLabel(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(mapPaymentMethodToLabel(undefined)).toBe('');
  });

  it('is case insensitive', () => {
    expect(mapPaymentMethodToLabel('CREDIT_CARD')).toBe('Tarjeta de Crédito');
    expect(mapPaymentMethodToLabel('Account_Money')).toBe('Dinero en Cuenta');
  });
});

describe('mapPaymentTypeToLabel', () => {
  it('maps account_money', () => {
    expect(mapPaymentTypeToLabel('account_money')).toBe('Dinero en Cuenta');
  });

  it('detects Visa from cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'visa' })).toBe('Visa');
  });

  it('detects Mastercard from cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'master' })).toBe('Mastercard');
  });

  it('detects American Express from cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'amex' })).toBe('American Express');
  });

  it('detects Naranja from cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'naranja' })).toBe('Naranja');
  });

  it('detects Cabal from cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'cabal' })).toBe('Cabal');
  });

  it('detects card by substring in payment_method_id', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'mastercard_debit' })).toBe('Mastercard');
  });

  it('falls back to credit_card label without cardInfo', () => {
    expect(mapPaymentTypeToLabel('credit_card')).toBe('Tarjeta de Crédito');
  });

  it('falls back to debit_card label without cardInfo', () => {
    expect(mapPaymentTypeToLabel('debit_card')).toBe('Tarjeta de Débito');
  });

  it('returns unknown type as-is', () => {
    expect(mapPaymentTypeToLabel('unknown_type')).toBe('unknown_type');
  });

  it('returns empty string for null', () => {
    expect(mapPaymentTypeToLabel(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(mapPaymentTypeToLabel(undefined)).toBe('');
  });

  it('is case insensitive for typeId', () => {
    expect(mapPaymentTypeToLabel('CREDIT_CARD')).toBe('Tarjeta de Crédito');
  });

  it('detects card brand case insensitively', () => {
    expect(mapPaymentTypeToLabel('credit_card', { payment_method_id: 'VISA' })).toBe('Visa');
  });
});

describe('getModoPagoDisplay', () => {
  it('returns method – type when both differ', () => {
    expect(getModoPagoDisplay(
      { payment_method_id: 'credit_card', payment_type_id: 'credit_card', card_info: { payment_method_id: 'visa' } },
      null
    )).toBe('Tarjeta de Crédito – Visa');
  });

  it('returns method when method equals type', () => {
    expect(getModoPagoDisplay(
      { payment_method_id: 'account_money', payment_type_id: 'account_money' },
      null
    )).toBe('Dinero en Cuenta');
  });

  it('returns method when type is missing', () => {
    expect(getModoPagoDisplay(
      { payment_method_id: 'credit_card' },
      null
    )).toBe('Tarjeta de Crédito');
  });

  it('returns type when method is missing', () => {
    expect(getModoPagoDisplay(
      { payment_type_id: 'debit_card' },
      null
    )).toBe('Tarjeta de Débito');
  });

  it('returns - when mpPayment has no identifiers', () => {
    expect(getModoPagoDisplay({}, null)).toBe('-');
  });

  it('returns - when mpPayment is null', () => {
    expect(getModoPagoDisplay(null, null)).toBe('-');
  });

  it('returns - when mpPayment is undefined', () => {
    expect(getModoPagoDisplay(undefined, null)).toBe('-');
  });

  it('maps efectivo', () => {
    expect(getModoPagoDisplay(null, 'efectivo')).toBe('Efectivo');
  });

  it('maps tarjeta_debito', () => {
    expect(getModoPagoDisplay(null, 'tarjeta_debito')).toBe('Tarjeta de Débito');
  });

  it('maps tarjeta_credito', () => {
    expect(getModoPagoDisplay(null, 'tarjeta_credito')).toBe('Tarjeta de Crédito');
  });

  it('maps transferencia', () => {
    expect(getModoPagoDisplay(null, 'transferencia')).toBe('Transferencia');
  });

  it('maps mercadopago', () => {
    expect(getModoPagoDisplay(null, 'mercadopago')).toBe('MercadoPago');
  });

  it('maps otro', () => {
    expect(getModoPagoDisplay(null, 'otro')).toBe('Otro');
  });

  it('returns metodoPagoVenta as-is if unknown', () => {
    expect(getModoPagoDisplay(null, 'some_unknown')).toBe('some_unknown');
  });

  it('returns - when no data at all', () => {
    expect(getModoPagoDisplay(null, null)).toBe('-');
  });

  it('prefers MP over metodoPagoVenta', () => {
    expect(getModoPagoDisplay(
      { payment_method_id: 'account_money' },
      'efectivo'
    )).toBe('Dinero en Cuenta');
  });
});
