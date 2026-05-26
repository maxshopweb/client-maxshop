import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '../cartStore';
import type { IProductos } from '@/app/types/producto.type';

vi.mock('../../utils/producto.utils', () => ({
  getPrecioConImpuestos: vi.fn((producto: any) => producto?.precio ?? 0),
  getPrecioSinImpuestos: vi.fn((producto: any) => producto?.precio_sin_iva ?? 0),
  getMontoBonificacionUnitario: vi.fn(() => 0),
}));

const createProducto = (id: number, overrides: Partial<IProductos> = {}): IProductos => ({
  id_prod: id,
  codi_arti: `ART${id}`,
  nombre: `Product ${id}`,
  precio: 100,
  precio_sin_iva: 80,
  ...overrides,
});

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({
      items: [],
      checkoutState: { step: 1, items: [], datosEnvio: null, datosFacturacion: null, datosPago: null },
      summary: { subtotal: 0, subtotalSinImpuestos: 0, descuentos: 0, envio: 0, total: 0, totalSinImpuestos: 0, impuestos: 0, cantidadItems: 0 },
    });
  });

  it('should have correct initial state', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.checkoutState).toEqual({ step: 1, items: [], datosEnvio: null, datosFacturacion: null, datosPago: null });
    expect(state.summary).toEqual({ subtotal: 0, subtotalSinImpuestos: 0, descuentos: 0, envio: 0, total: 0, totalSinImpuestos: 0, impuestos: 0, cantidadItems: 0 });
  });

  it('should add a new item to the cart', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 2);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      id_prod: 1,
      cantidad: 2,
      precio_unitario: 100,
      precio_unitario_sin_iva: 80,
      descuento: 0,
      subtotal: 200,
      subtotal_sin_iva: 160,
    });
    expect(state.summary).toMatchObject({
      subtotal: 200,
      subtotalSinImpuestos: 160,
      descuentos: 0,
      envio: 0,
      total: 200,
      totalSinImpuestos: 160,
      impuestos: 40,
      cantidadItems: 2,
    });
  });

  it('should add item with default quantity of 1', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto);

    const state = useCartStore.getState();
    expect(state.items[0].cantidad).toBe(1);
    expect(state.items[0].subtotal).toBe(100);
    expect(state.summary.cantidadItems).toBe(1);
  });

  it('should increase quantity when adding an existing item', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 1);
    useCartStore.getState().addItem(producto, 2);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].cantidad).toBe(3);
    expect(state.items[0].subtotal).toBe(300);
    expect(state.summary.cantidadItems).toBe(3);
  });

  it('should handle multiple different items', () => {
    const prod1 = createProducto(1);
    const prod2 = createProducto(2, { precio: 200, precio_sin_iva: 160 });
    useCartStore.getState().addItem(prod1, 1);
    useCartStore.getState().addItem(prod2, 2);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.summary.subtotal).toBe(500);
    expect(state.summary.cantidadItems).toBe(3);
  });

  it('should add item with custom price from product data', () => {
    const producto = createProducto(1, { precio: 250, precio_sin_iva: 200 });
    useCartStore.getState().addItem(producto, 3);

    const state = useCartStore.getState();
    expect(state.items[0].precio_unitario).toBe(250);
    expect(state.items[0].subtotal).toBe(750);
    expect(state.summary.subtotal).toBe(750);
    expect(state.summary.impuestos).toBe(150);
  });

  it('should remove an existing item', () => {
    const prod1 = createProducto(1);
    const prod2 = createProducto(2);
    useCartStore.getState().addItem(prod1, 1);
    useCartStore.getState().addItem(prod2, 2);
    useCartStore.getState().removeItem(1);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id_prod).toBe(2);
  });

  it('should not change state when removing a non-existent item', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 1);
    useCartStore.getState().removeItem(999);

    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('should recalculate summary after removing an item', () => {
    const prod1 = createProducto(1, { precio: 100 });
    const prod2 = createProducto(2, { precio: 200 });
    useCartStore.getState().addItem(prod1, 1);
    useCartStore.getState().addItem(prod2, 1);
    useCartStore.getState().removeItem(1);

    const state = useCartStore.getState();
    expect(state.summary.subtotal).toBe(200);
    expect(state.summary.cantidadItems).toBe(1);
  });

  it('should update quantity of an existing item', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 1);
    useCartStore.getState().updateQuantity(1, 5);

    const state = useCartStore.getState();
    expect(state.items[0].cantidad).toBe(5);
    expect(state.items[0].subtotal).toBe(500);
    expect(state.summary.subtotal).toBe(500);
    expect(state.summary.cantidadItems).toBe(5);
  });

  it('should remove item when updating quantity to 0', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 2);
    useCartStore.getState().updateQuantity(1, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should remove item when updating quantity to negative', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 2);
    useCartStore.getState().updateQuantity(1, -1);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should not change state when updating quantity of non-existent item', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 1);
    useCartStore.getState().updateQuantity(999, 5);

    expect(useCartStore.getState().items[0].cantidad).toBe(1);
  });

  it('should clear the cart', () => {
    const prod1 = createProducto(1);
    const prod2 = createProducto(2);
    useCartStore.getState().addItem(prod1, 1);
    useCartStore.getState().addItem(prod2, 2);
    useCartStore.getState().clearCart();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.summary).toEqual({
      subtotal: 0, subtotalSinImpuestos: 0, descuentos: 0, envio: 0,
      total: 0, totalSinImpuestos: 0, impuestos: 0, cantidadItems: 0,
    });
  });

  it('should set datos de envio', () => {
    const datosEnvio = { tipo: 'envio' as const, calle: 'Av Siempre Viva', numero: '742' };
    useCartStore.getState().setDatosEnvio(datosEnvio);

    expect(useCartStore.getState().checkoutState.datosEnvio).toEqual(datosEnvio);
  });

  it('should set datos de facturacion', () => {
    const datosFacturacion = {
      tipo: 'consumidor_final' as const, nombre_completo: 'Juan Perez',
      email: 'juan@test.com', telefono: '123456789',
    };
    useCartStore.getState().setDatosFacturacion(datosFacturacion);

    expect(useCartStore.getState().checkoutState.datosFacturacion).toEqual(datosFacturacion);
  });

  it('should set datos de pago', () => {
    const datosPago = { metodo: 'efectivo' as const };
    useCartStore.getState().setDatosPago(datosPago);

    expect(useCartStore.getState().checkoutState.datosPago).toEqual(datosPago);
  });

  it('should set checkout step', () => {
    useCartStore.getState().setStep(2);
    expect(useCartStore.getState().checkoutState.step).toBe(2);

    useCartStore.getState().setStep(3);
    expect(useCartStore.getState().checkoutState.step).toBe(3);
  });

  it('should reset checkout state but keep items', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 1);
    useCartStore.getState().setDatosEnvio({ tipo: 'envio', calle: 'Test' });
    useCartStore.getState().setStep(2);
    useCartStore.getState().resetCheckout();

    const state = useCartStore.getState();
    expect(state.checkoutState.step).toBe(1);
    expect(state.checkoutState.datosEnvio).toBeNull();
    expect(state.checkoutState.datosFacturacion).toBeNull();
    expect(state.checkoutState.datosPago).toBeNull();
    expect(state.checkoutState.items).toHaveLength(1);
    expect(state.items).toHaveLength(1);
  });

  it('should calculate summary without mutating state', () => {
    const producto = createProducto(1);
    useCartStore.getState().addItem(producto, 2);

    const calculated = useCartStore.getState().calculateSummary();
    expect(calculated).toMatchObject({
      subtotal: 200,
      subtotalSinImpuestos: 160,
      descuentos: 0,
      envio: 0,
      total: 200,
      totalSinImpuestos: 160,
      impuestos: 40,
      cantidadItems: 2,
    });
  });
});
