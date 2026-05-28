import { mapCartItemsToCheckout, getCartFingerprint } from '../mapCartItemsToCheckout';
import type { ICartItem } from '@/app/types/cart.type';

const mockItem = (id: number, cantidad: number): ICartItem => ({
  id_prod: id,
  cantidad,
  precio_unitario: 100,
  precio_unitario_sin_iva: 80,
  subtotal: 100 * cantidad,
  subtotal_sin_iva: 80 * cantidad,
  descuento: 0,
  producto: {
    id_prod: id,
    nombre: `Producto ${id}`,
    img_principal: 'img.jpg',
    precio_sin_iva: 80,
  } as ICartItem['producto'],
});

describe('mapCartItemsToCheckout', () => {
  it('mapea todos los campos requeridos por CartSummary', () => {
    const [mapped] = mapCartItemsToCheckout([mockItem(1, 2)]);

    expect(mapped).toEqual({
      id: 1,
      nombre: 'Producto 1',
      precio: 100,
      precioSinImpuestos: 80,
      cantidad: 2,
      img_principal: 'img.jpg',
      subtotal: 200,
      subtotalSinImpuestos: 160,
    });
  });

  it('getCartFingerprint cambia al modificar cantidad', () => {
    const before = getCartFingerprint([mockItem(1, 1)]);
    const after = getCartFingerprint([mockItem(1, 3)]);

    expect(before).not.toBe(after);
    expect(before).toBe('1:1');
    expect(after).toBe('1:3');
  });
});
