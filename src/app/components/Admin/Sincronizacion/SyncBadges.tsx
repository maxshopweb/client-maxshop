'use client';

import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { TableBadge } from '@/app/components/ui/TableBadge';
import type { BadgeVariant } from '@/app/components/ui/Badge';
import type { SyncRun } from '@/app/services/sincronizacion.service';

const RESULTADO_CONFIG: Record<
  SyncRun['resultado'],
  { variant: BadgeVariant; label: string; Icon: LucideIcon }
> = {
  COMPLETA: { variant: 'success', label: 'Completa', Icon: CheckCircle2 },
  PARCIAL: { variant: 'warning', label: 'Parcial', Icon: AlertTriangle },
  FALLIDA: { variant: 'error', label: 'Fallida', Icon: XCircle },
};

const TRIGGER_CONFIG: Record<
  SyncRun['trigger'],
  { variant: BadgeVariant; label: string; Icon?: LucideIcon }
> = {
  AUTO: { variant: 'info', label: 'Auto', Icon: RefreshCw },
  ON_DEMAND: { variant: 'purple', label: 'Manual' },
};

export function SyncResultadoBadge({ resultado }: { resultado: SyncRun['resultado'] }) {
  const { variant, label, Icon } = RESULTADO_CONFIG[resultado];
  return (
    <TableBadge variant={variant} className="gap-1">
      <Icon size={11} aria-hidden />
      {label}
    </TableBadge>
  );
}

export function SyncTriggerBadge({ trigger }: { trigger: SyncRun['trigger'] }) {
  const { variant, label, Icon } = TRIGGER_CONFIG[trigger];
  return (
    <TableBadge variant={variant} className="gap-1">
      {Icon && <Icon size={10} aria-hidden />}
      {label}
    </TableBadge>
  );
}

export function SyncErroresCountBadge({ count }: { count: number }) {
  return (
    <TableBadge
      variant="error"
      className="min-w-5 h-5 justify-center px-1.5 py-0 font-bold"
    >
      {count}
    </TableBadge>
  );
}
