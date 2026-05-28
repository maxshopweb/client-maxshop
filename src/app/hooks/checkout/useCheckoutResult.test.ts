/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCheckoutResult } from './useCheckoutResult';

const searchParamsState = new Map<string, string>();

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => searchParamsState.get(key) ?? null,
  }),
}));

function setParams(params: Record<string, string>) {
  searchParamsState.clear();
  for (const [k, v] of Object.entries(params)) {
    searchParamsState.set(k, v);
  }
}

describe('useCheckoutResult', () => {
  beforeEach(() => {
    searchParamsState.clear();
  });

  it('parsea status=approved e id_venta', () => {
    setParams({ status: 'approved', id_venta: '123' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('approved');
    expect(result.current.id_venta).toBe('123');
  });

  it('prioriza status sobre payment_status', () => {
    setParams({ status: 'rejected', payment_status: 'approved' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('rejected');
  });

  it('usa payment_status si no hay status', () => {
    setParams({ payment_status: 'pending', id_venta: '50' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('pending');
  });

  it('parsea metodo=transferencia', () => {
    setParams({ metodo: 'transferencia', id_venta: '77' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('transferencia');
    expect(result.current.metodo_pago).toBe('transferencia');
  });

  it('sin parámetros devuelve error con mensaje', () => {
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('error');
    expect(result.current.mensaje).toBeTruthy();
    expect(result.current.id_venta).toBeUndefined();
  });

  it('con id_venta sin status válido infiere pending con mensaje', () => {
    setParams({ id_venta: '10' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('pending');
    expect(result.current.mensaje).toContain('registrado');
  });

  it('status inválido devuelve error con mensaje', () => {
    setParams({ status: 'aproved', id_venta: '5' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('error');
    expect(result.current.mensaje).toContain('aproved');
  });

  it('obtiene id_venta desde external_reference de Mercado Pago', () => {
    setParams({ status: 'approved', external_reference: 'venta_456' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.id_venta).toBe('456');
    expect(result.current.status).toBe('approved');
  });

  it('incluye payment_id como número de operación', () => {
    setParams({ status: 'approved', id_venta: '1', payment_id: '999888777' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.payment_id).toBe('999888777');
  });

  it('usa collection_status si no hay status ni payment_status', () => {
    setParams({ collection_status: 'pending', id_venta: '10' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('pending');
  });
});
