import { describe, it, expect } from 'vitest';
import { computePrecioMedios, computeDescuentoTransferencia } from '../precio-medios.utils';

describe('precio-medios.utils', () => {
  const configBase = {
    cuotas_sin_interes: 6,
    cuotas_sin_interes_activo: true,
    cuotas_sin_interes_minimo: 80000,
    descuento_transferencia_activo: true,
    descuento_transferencia_pct: 23,
  };

  it('muestra transferencia y cuotas sobre 1.248.000', () => {
    const r = computePrecioMedios({
      precioPublicado: 1248000,
      cuotasHabilitadas: null,
      config: configBase,
    });
    expect(r.muestraTransferencia).toBe(true);
    expect(r.precioTransferencia).toBe(960960);
    expect(r.descuentoTransferenciaPct).toBe(23);
    expect(r.muestraCuotas).toBe(true);
    expect(r.cantidadCuotas).toBe(6);
    expect(r.valorCuota).toBe(208000);
  });

  it('no muestra cuotas si el producto las tiene deshabilitadas', () => {
    const r = computePrecioMedios({
      precioPublicado: 1248000,
      cuotasHabilitadas: false,
      config: configBase,
    });
    expect(r.muestraCuotas).toBe(false);
    expect(r.muestraTransferencia).toBe(true);
  });

  it('no muestra transferencia si la regla está apagada', () => {
    const r = computePrecioMedios({
      precioPublicado: 1248000,
      cuotasHabilitadas: true,
      config: { ...configBase, descuento_transferencia_activo: false },
    });
    expect(r.muestraTransferencia).toBe(false);
    expect(r.precioTransferencia).toBeNull();
  });

  it('computeDescuentoTransferencia sobre subtotal', () => {
    expect(computeDescuentoTransferencia(1000, configBase)).toBe(230);
  });
});
