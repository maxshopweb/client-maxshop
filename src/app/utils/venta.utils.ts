/**
 * Devuelve el código de operación a mostrar al usuario (ej. MAX-00000001).
 * Usado en checkout resultado y en panel admin.
 */
export function getNumeroPedidoDisplay(
  cod_interno?: string | null,
  id_venta?: string | number
): string | null {
  if (cod_interno) return cod_interno;
  if (id_venta != null && id_venta !== '') {
    const n = Number(id_venta);
    if (!Number.isNaN(n)) return 'MAX-' + String(n).padStart(8, '0');
  }
  return null;
}
