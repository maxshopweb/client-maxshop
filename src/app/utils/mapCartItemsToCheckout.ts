import type { ICartItem } from "@/app/types/cart.type";
import type { CartItem } from "@/app/hooks/checkout/useCheckoutStore";

/** Fingerprint estable del carrito (ids + cantidades) para detectar mutaciones. */
export function getCartFingerprint(items: ICartItem[]): string {
  return [...items]
    .sort((a, b) => a.id_prod - b.id_prod)
    .map((item) => `${item.id_prod}:${item.cantidad}`)
    .join("|");
}

/** Total de unidades en el carrito (para recotizar envío). */
export function getCartQuantityTotal(items: ICartItem[]): number {
  return items.reduce((sum, item) => sum + (item.cantidad || 1), 0);
}

/** Mapeo único cartStore → checkoutStore.cartItems */
export function mapCartItemsToCheckout(items: ICartItem[]): CartItem[] {
  return items.map((item) => {
    const precioSinImpuestos =
      item.precio_unitario_sin_iva ?? item.producto?.precio_sin_iva ?? 0;
    const subtotalSinImpuestos =
      item.subtotal_sin_iva ?? precioSinImpuestos * (item.cantidad || 1);

    return {
      id: item.id_prod,
      nombre: item.producto?.nombre || "Producto sin nombre",
      precio: item.precio_unitario || 0,
      precioSinImpuestos,
      cantidad: item.cantidad || 1,
      img_principal: item.producto?.img_principal || "",
      subtotal: item.subtotal || 0,
      subtotalSinImpuestos,
    };
  });
}
