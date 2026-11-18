/**
 * Presentación de precio en cuotas y con transferencia.
 * El precio publicado (lista activa + bonificación) es la base.
 */

export interface PrecioMediosConfig {
  cuotas_sin_interes?: number | null;
  cuotas_sin_interes_activo?: boolean;
  cuotas_sin_interes_minimo?: number | null;
  descuento_transferencia_activo?: boolean;
  descuento_transferencia_pct?: number | null;
}

export interface PrecioMediosInput {
  precioPublicado: number;
  cuotasHabilitadas?: boolean | null;
  config: PrecioMediosConfig | null | undefined;
}

export interface PrecioMediosResult {
  precioCuotas: number;
  precioTransferencia: number | null;
  descuentoTransferenciaPct: number | null;
  cantidadCuotas: number | null;
  valorCuota: number | null;
  muestraCuotas: boolean;
  muestraTransferencia: boolean;
}

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computePrecioMedios(input: PrecioMediosInput): PrecioMediosResult {
  const precio = roundMoney(Math.max(0, Number(input.precioPublicado) || 0));
  const config = input.config;
  const pctRaw = config?.descuento_transferencia_pct != null
    ? Number(config.descuento_transferencia_pct)
    : 0;
  const pct = Number.isFinite(pctRaw) ? Math.min(100, Math.max(0, pctRaw)) : 0;
  const transferActivo = config?.descuento_transferencia_activo === true && pct > 0;
  const precioTransferencia = transferActivo
    ? roundMoney(precio * (1 - pct / 100))
    : null;

  const cuotasActivo = config?.cuotas_sin_interes_activo === true;
  const cantidad = Math.trunc(Number(config?.cuotas_sin_interes ?? 0));
  const minimo = Number(config?.cuotas_sin_interes_minimo ?? 0);
  const flag = input.cuotasHabilitadas;
  const calificaProducto =
    flag === true || (flag !== false && precio >= (Number.isFinite(minimo) ? minimo : 0));
  const muestraCuotas =
    cuotasActivo && cantidad > 1 && precio > 0 && calificaProducto;
  const valorCuota = muestraCuotas ? roundMoney(precio / cantidad) : null;

  return {
    precioCuotas: precio,
    precioTransferencia,
    descuentoTransferenciaPct: transferActivo ? pct : null,
    cantidadCuotas: muestraCuotas ? cantidad : null,
    valorCuota,
    muestraCuotas,
    muestraTransferencia: transferActivo && precioTransferencia != null && precioTransferencia < precio,
  };
}

/** Monto de descuento por transferencia sobre un subtotal de productos. */
export function computeDescuentoTransferencia(
  subtotalProductos: number,
  config: PrecioMediosConfig | null | undefined
): number {
  if (!config || config.descuento_transferencia_activo !== true) return 0;
  const pct = Number(config.descuento_transferencia_pct ?? 0);
  if (!Number.isFinite(pct) || pct <= 0) return 0;
  const sub = roundMoney(Math.max(0, subtotalProductos));
  return roundMoney((sub * Math.min(100, pct)) / 100);
}
