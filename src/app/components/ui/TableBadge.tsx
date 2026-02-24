'use client';

import type { ReactNode } from 'react';
import {
  ESTADO_PAGO_OPTIONS,
  ESTADO_ENVIO_OPTIONS,
  METODO_PAGO_OPTIONS,
} from '@/app/types/ventas.type';
import { Badge, type BadgeVariant } from './Badge';

export type TableBadgeKind = 'estado_pago' | 'estado_envio' | 'metodo_pago';

type TableBadgeByKind = {
  kind: TableBadgeKind;
  value: string | null | undefined;
  label?: string;
};

type TableBadgeByVariant = {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
};

export type TableBadgeProps = TableBadgeByKind | TableBadgeByVariant;

function isKindProps(p: TableBadgeProps): p is TableBadgeByKind {
  return 'kind' in p && 'value' in p;
}

function getVariantForKindValue(kind: TableBadgeKind, value: string): BadgeVariant {
  if (kind === 'estado_pago') {
    switch (value) {
      case 'pendiente': return 'principal';
      case 'aprobado': return 'success';
      case 'rechazado': return 'error';
      case 'vencido': return 'errorDark';
      default: return 'neutral';
    }
  }
  if (kind === 'estado_envio') {
    switch (value) {
      case 'pendiente': return 'principal';
      case 'preparando': return 'info';
      case 'enviado': return 'purple';
      case 'en_transito': return 'indigo';
      case 'entregado': return 'success';
      default: return 'neutral';
    }
  }
  if (kind === 'metodo_pago') {
    switch (value) {
      case 'efectivo': return 'success';
      case 'transferencia': return 'principal';
      case 'mercadopago': return 'mercadopago';
      default: return 'neutral';
    }
  }
  return 'neutral';
}

function getLabelForKindValue(
  kind: TableBadgeKind,
  value: string,
  labelOverride?: string
): string {
  if (labelOverride) return labelOverride;
  if (kind === 'estado_pago') {
    return ESTADO_PAGO_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
  }
  if (kind === 'estado_envio') {
    return ESTADO_ENVIO_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
  }
  if (kind === 'metodo_pago') {
    return METODO_PAGO_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
  }
  return value;
}

export function TableBadge(props: TableBadgeProps) {
  if (isKindProps(props)) {
    const { kind, value, label: labelOverride } = props;
    if (value == null || value === '') {
      return <span className="text-gray-400">-</span>;
    }
    const variant = getVariantForKindValue(kind, value);
    const label = getLabelForKindValue(kind, value, labelOverride);
    return <Badge variant={variant}>{label}</Badge>;
  }

  const byVariant = props as TableBadgeByVariant;
  return (
    <Badge variant={byVariant.variant} className={byVariant.className}>
      {byVariant.children}
    </Badge>
  );
}
