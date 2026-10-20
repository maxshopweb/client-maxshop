import { describe, it, expect } from 'vitest';
import { getPrecioConImpuestos, getPrecioSinImpuestos } from '../producto.utils';
import type { IProductos } from '@/app/types/producto.type';

const base = {
  id_prod: 1,
  codi_arti: 'ART001',
  precio_venta: 1000,
  precio_especial: 800,
  precio_pvp: 1200,
  precio_campanya: 700,
  precio_manual: 650,
  iva: { porcentaje: 21 },
} as IProductos;

describe('getPrecioSinImpuestos lista E', () => {
  it('usa precio_sin_iva del backend si viene', () => {
    expect(getPrecioSinImpuestos({ ...base, lista_precio_activa: 'E', precio_sin_iva: 650 })).toBe(650);
  });

  it('si la lista es E usa precio_manual y no venta', () => {
    expect(getPrecioSinImpuestos({ ...base, lista_precio_activa: 'E', precio_sin_iva: null })).toBe(650);
  });

  it('si la lista es V no usa precio_manual', () => {
    expect(getPrecioSinImpuestos({ ...base, lista_precio_activa: 'V', precio_sin_iva: null })).toBe(1000);
  });
});

describe('getPrecioConImpuestos', () => {
  it('prefiere producto.precio del backend (lista E con IVA)', () => {
    expect(getPrecioConImpuestos({
      ...base,
      lista_precio_activa: 'E',
      precio: 786.5,
    })).toBe(786.5);
  });

  it('no vende a 0 si precio de lista E está vacío y no hay fallback de API', () => {
    const producto = {
      ...base,
      lista_precio_activa: 'E',
      precio: null,
      precio_sin_iva: null,
      precio_manual: null,
      precio_venta: null,
      precio_especial: null,
      precio_pvp: null,
      precio_campanya: null,
      precio_evento: null,
      precio_minorista: null,
    } as IProductos;
    expect(getPrecioConImpuestos(producto)).toBeNull();
  });
});
