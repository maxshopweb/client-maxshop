import type { ICartItem } from "@/app/types/cart.type";
import type { IProductos } from "@/app/types/producto.type";

/** Mensaje genérico para el cliente (sin cantidades ni detalle de stock). */
export const MENSAJE_LIMITE_STOCK = "Límite alcanzado";

export function getStockDisponible(producto: IProductos): number {
  return producto.stock ?? 0;
}

/** Cantidad pedida vs stock del producto (datos del cliente; el API valida en BD). */
export function validateCantidadVsStock(producto: IProductos, cantidad: number): string | null {
  const max = getStockDisponible(producto);
  if (cantidad > max) {
    return MENSAJE_LIMITE_STOCK;
  }
  return null;
}

/**
 * Al agregar al carrito: cantidad ya en carrito + cantidad a sumar no puede superar el stock.
 */
export function validateAgregarAlCarrito(
  producto: IProductos,
  cantidadEnCarrito: number,
  cantidadAAgregar: number
): string | null {
  const max = getStockDisponible(producto);
  const total = cantidadEnCarrito + cantidadAAgregar;
  if (total > max) {
    return MENSAJE_LIMITE_STOCK;
  }
  return null;
}

export function validateCarritoCompleto(items: ICartItem[]): { ok: true } | { ok: false; message: string } {
  for (const item of items) {
    const err = validateCantidadVsStock(item.producto, item.cantidad);
    if (err) {
      return { ok: false, message: err };
    }
  }
  return { ok: true };
}

export function isCarritoStockOk(items: ICartItem[]): boolean {
  return validateCarritoCompleto(items).ok;
}
