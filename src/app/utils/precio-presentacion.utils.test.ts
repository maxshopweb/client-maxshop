import { describe, it, expect } from 'vitest';
import {
  getPresentacionPrecioProducto,
  calcularPreviewPrecioLista,
  getPrecioSinIvaListaActiva,
} from './precio-presentacion.utils';
import type { IProductos } from '@/app/types/producto.type';

describe('getPresentacionPrecioProducto', () => {
  it('usa precio_anterior para bonificación, no precio_venta_referencia', () => {
    const producto = {
      precio: 1089,
      precio_anterior: 1210,
      monto_bonificacion: 121,
      bonificacion_porcentaje: 10,
      lista_precio_activa: 'O',
      precio_venta_referencia: 620000,
    } as IProductos;

    const p = getPresentacionPrecioProducto(producto);
    expect(p.precioFinal).toBe(1089);
    expect(p.precioTachado).toBe(1210);
    expect(p.tipoDescuento).toBe('bonificacion');
    expect(p.etiqueta).toBe('Bonificación 10%');
  });

  it('usa precio_venta_referencia solo sin bonificación y lista ≠ V', () => {
    const producto = {
      precio: 318000,
      lista_precio_activa: 'O',
      precio_venta_referencia: 388000,
      bonificacion_porcentaje: null,
    } as IProductos;

    const p = getPresentacionPrecioProducto(producto);
    expect(p.tipoDescuento).toBe('oferta');
    expect(p.precioTachado).toBe(388000);
    expect(p.etiqueta).toMatch(/OFF/);
  });
});

describe('calcularPreviewPrecioLista', () => {
  it('aplica 10% sobre lista con IVA (caso 8182)', () => {
    const r = calcularPreviewPrecioLista(1000, 21, 10);
    expect(r.listaConIva).toBe(1210);
    expect(r.finalConIva).toBe(1089);
    expect(r.montoBonificacion).toBe(121);
  });
});

describe('getPrecioSinIvaListaActiva', () => {
  it('resuelve lista O desde precio_especial', () => {
    expect(
      getPrecioSinIvaListaActiva('O', {
        precio_especial: 1000,
        precio_venta: 512397,
      })
    ).toBe(1000);
  });
});
