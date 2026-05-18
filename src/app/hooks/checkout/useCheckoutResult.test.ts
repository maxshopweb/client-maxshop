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

  it('sin parámetros queda en processing', () => {
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.status).toBe('processing');
    expect(result.current.id_venta).toBeUndefined();
  });

  it('incluye cod_interno cuando viene en la URL', () => {
    setParams({ status: 'approved', id_venta: '1', cod_interno: 'MAX-00000001' });
    const { result } = renderHook(() => useCheckoutResult());
    expect(result.current.cod_interno).toBe('MAX-00000001');
  });
});
