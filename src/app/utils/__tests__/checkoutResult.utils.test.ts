import { describe, it, expect } from 'vitest';
import {
  resolveCheckoutResultStatus,
  hasCheckoutLandingContext,
  resolveEstadoPagoFormValue,
  getMercadoPagoStatusLabel,
} from '../checkoutResult.utils';

describe('resolveCheckoutResultStatus', () => {
  it('devuelve approved cuando status es válido', () => {
    expect(
      resolveCheckoutResultStatus({
        statusParam: 'approved',
        payment_status: null,
        collection_status: null,
        metodo: null,
        metodo_pago: null,
        id_venta: '1',
        payment_id: null,
        external_reference: null,
        preference_id: null,
        collection_id: null,
      }).status
    ).toBe('approved');
  });

  it('sin status pero con id_venta → pending', () => {
    const r = resolveCheckoutResultStatus({
      statusParam: null,
      payment_status: null,
      collection_status: null,
      metodo: null,
      metodo_pago: null,
      id_venta: '42',
      payment_id: null,
      external_reference: null,
      preference_id: null,
      collection_id: null,
    });
    expect(r.status).toBe('pending');
    expect(r.mensaje).toBeDefined();
  });

  it('sin ningún parámetro → error', () => {
    expect(
      resolveCheckoutResultStatus({
        statusParam: null,
        payment_status: null,
        collection_status: null,
        metodo: null,
        metodo_pago: null,
        id_venta: undefined,
        payment_id: null,
        external_reference: null,
        preference_id: null,
        collection_id: null,
      }).status
    ).toBe('error');
  });
});

describe('hasCheckoutLandingContext', () => {
  it('true para estados MP', () => {
    expect(hasCheckoutLandingContext({ status: 'approved' })).toBe(true);
  });

  it('true para error (pantalla de error)', () => {
    expect(hasCheckoutLandingContext({ status: 'error' })).toBe(true);
  });

  it('true para pending (estado MP válido)', () => {
    expect(hasCheckoutLandingContext({ status: 'pending' })).toBe(true);
  });
});

describe('resolveEstadoPagoFormValue', () => {
  it('acepta vencido', () => {
    expect(resolveEstadoPagoFormValue('vencido')).toBe('vencido');
  });

  it('rechaza valores desconocidos', () => {
    expect(resolveEstadoPagoFormValue('approved')).toBeUndefined();
  });
});

describe('getMercadoPagoStatusLabel', () => {
  it('traduce approved', () => {
    expect(getMercadoPagoStatusLabel('approved')).toBe('Aprobado');
  });
});
