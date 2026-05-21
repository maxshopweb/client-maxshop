import type { IProductos } from '@/app/types/producto.type';
import {
  getPrecioConImpuestos,
  getPrecioAnterior,
  getBonificacionPorcentaje,
  tieneBonificacionProducto,
} from '@/app/utils/producto.utils';

export type TipoDescuentoPrecio = 'bonificacion' | 'oferta' | null;

export interface PresentacionPrecioProducto {
  precioFinal: number;
  precioTachado: number | null;
  mostrarTachado: boolean;
  tipoDescuento: TipoDescuentoPrecio;
  etiqueta: string | null;
}

/**
 * Reglas unificadas de precio en tienda y admin:
 * - Bonificación: tachado = lista activa con IVA (precio_anterior), nunca precio_venta_referencia.
 * - Oferta/campaña (lista ≠ V, sin boni): tachado = precio_venta_referencia y % OFF calculado.
 */
export function getPresentacionPrecioProducto(producto: IProductos): PresentacionPrecioProducto {
  const precioFinal = getPrecioConImpuestos(producto) ?? 0;
  const precioAnteriorBoni = getPrecioAnterior(producto);
  const boniPct = getBonificacionPorcentaje(producto);

  if (
    tieneBonificacionProducto(producto) &&
    precioAnteriorBoni != null &&
    precioAnteriorBoni > precioFinal
  ) {
    return {
      precioFinal,
      precioTachado: precioAnteriorBoni,
      mostrarTachado: true,
      tipoDescuento: 'bonificacion',
      etiqueta: boniPct != null ? `Bonificación ${boniPct}%` : 'Bonificación',
    };
  }

  const ref = producto.precio_venta_referencia;
  const codiLista = (producto.lista_precio_activa || producto.lista_activa?.codi_lista || 'V').toUpperCase();
  if (
    ref != null &&
    ref > precioFinal &&
    codiLista !== 'V' &&
    !tieneBonificacionProducto(producto)
  ) {
    const pct = ref > 0 ? Math.round((1 - precioFinal / ref) * 100) : 0;
    return {
      precioFinal,
      precioTachado: ref,
      mostrarTachado: true,
      tipoDescuento: 'oferta',
      etiqueta: pct > 0 ? `${pct}% OFF` : null,
    };
  }

  return {
    precioFinal,
    precioTachado: null,
    mostrarTachado: false,
    tipoDescuento: null,
    etiqueta: null,
  };
}

/** Precio sin IVA de la lista activa (para preview en formulario admin). */
export function getPrecioSinIvaListaActiva(
  lista: string | undefined,
  precios: {
    precio_venta?: number;
    precio_especial?: number;
    precio_pvp?: number;
    precio_campanya?: number;
    precio_manual?: number;
  }
): number | null {
  const codi = (lista || 'V').toUpperCase();
  const pick = (v: number | undefined) =>
    v != null && !Number.isNaN(v) && v > 0 ? v : null;
  if (codi === 'E') return pick(precios.precio_manual);
  if (codi === 'V') return pick(precios.precio_venta);
  if (codi === 'O') return pick(precios.precio_especial);
  if (codi === 'P') return pick(precios.precio_pvp);
  if (codi === 'Q') return pick(precios.precio_campanya);
  return (
    pick(precios.precio_venta) ??
    pick(precios.precio_especial) ??
    pick(precios.precio_pvp) ??
    pick(precios.precio_campanya) ??
    pick(precios.precio_manual)
  );
}

/** Preview en Step2: lista con IVA, bonificación y final. */
export function calcularPreviewPrecioLista(
  precioSinIvaLista: number | null,
  porcentajeIva: number,
  bonificacionPct: number | null | undefined
): {
  listaConIva: number | null;
  finalConIva: number | null;
  montoBonificacion: number | null;
} {
  if (precioSinIvaLista == null || precioSinIvaLista <= 0) {
    return { listaConIva: null, finalConIva: null, montoBonificacion: null };
  }
  const iva = Number.isFinite(porcentajeIva) ? porcentajeIva : 0;
  const listaConIva = Math.round(precioSinIvaLista * (1 + iva / 100) * 100) / 100;
  const boni = bonificacionPct != null && bonificacionPct > 0 ? Math.min(100, bonificacionPct) : 0;
  if (boni <= 0) {
    return { listaConIva, finalConIva: listaConIva, montoBonificacion: null };
  }
  const finalConIva = Math.round(listaConIva * (1 - boni / 100) * 100) / 100;
  const montoBonificacion = Math.round((listaConIva - finalConIva) * 100) / 100;
  return { listaConIva, finalConIva, montoBonificacion };
}
