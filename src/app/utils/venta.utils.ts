/**
 * Devuelve el código de operación a mostrar al usuario (ej. MAX-00000001).
 * Usado en checkout resultado y en panel admin.
 */
import type { BadgeVariant } from '@/app/components/ui/Badge';
import { isVentaRetiroEnTienda } from '@/app/utils/venta-envio.validation';

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

export type RetiroOperativoEstado = 'sin_aviso' | 'avisado' | 'retirado' | 'no_aplica';

export function getRetiroOperativoEstado(venta: {
  observaciones?: string | null;
  estado_pago?: string | null;
  listo_retiro_avisado_en?: Date | string | null;
  retirado_en?: Date | string | null;
}): RetiroOperativoEstado {
  if (!isVentaRetiroEnTienda(venta.observaciones)) return 'no_aplica';
  if (venta.estado_pago !== 'aprobado') return 'no_aplica';
  if (venta.retirado_en) return 'retirado';
  if (venta.listo_retiro_avisado_en) return 'avisado';
  return 'sin_aviso';
}

export const RETIRO_OPERATIVO_LABELS: Record<Exclude<RetiroOperativoEstado, 'no_aplica'>, string> = {
  sin_aviso: 'Sin aviso',
  avisado: 'Por retirar',
  retirado: 'Retirado',
};

export const RETIRO_FILTRO_OPTIONS = [
  { value: 'sin_aviso', label: RETIRO_OPERATIVO_LABELS.sin_aviso },
  { value: 'avisado_sin_retirar', label: RETIRO_OPERATIVO_LABELS.avisado },
  { value: 'retirado', label: RETIRO_OPERATIVO_LABELS.retirado },
] as const;

export function getRetiroOperativoBadgeConfig(
  retiroEstado: RetiroOperativoEstado
): { variant: BadgeVariant; label: string } | null {
  if (retiroEstado === 'no_aplica') return null;
  if (retiroEstado === 'retirado') {
    return { variant: 'success', label: RETIRO_OPERATIVO_LABELS.retirado };
  }
  if (retiroEstado === 'avisado') {
    return { variant: 'info', label: RETIRO_OPERATIVO_LABELS.avisado };
  }
  return { variant: 'warning', label: RETIRO_OPERATIVO_LABELS.sin_aviso };
}
