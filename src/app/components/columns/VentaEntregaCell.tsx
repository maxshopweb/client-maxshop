'use client';

import { Store, Truck } from 'lucide-react';
import type { IVenta } from '@/app/types/ventas.type';
import { TableBadge } from '@/app/components/ui/TableBadge';
import { Badge } from '@/app/components/ui/Badge';
import {
  getRetiroOperativoEstado,
  getRetiroOperativoBadgeConfig,
} from '@/app/utils/venta.utils';
import { isVentaRetiroEnTienda } from '@/app/utils/venta-envio.validation';

export function VentaEntregaCell({ venta }: { venta: IVenta }) {
  const esRetiro = isVentaRetiroEnTienda(venta.observaciones);

  if (esRetiro) {
    const operativo = getRetiroOperativoBadgeConfig(getRetiroOperativoEstado(venta));
    return (
      <div className="flex flex-col items-start gap-0.5">
        <Badge variant="warning" className="gap-1 pl-1.5 pr-2 py-0.5">
          <Store className="w-3 h-3 shrink-0" aria-hidden />
          Retiro
        </Badge>
        {operativo && (
          <Badge variant={operativo.variant} className="px-1.5">
            {operativo.label}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5" title="Envío a domicilio o sucursal">
      <Badge variant="info" className="gap-1 pl-1.5 pr-2 py-0.5">
        <Truck className="w-3 h-3 shrink-0" aria-hidden />
        Envío
      </Badge>
      <TableBadge kind="estado_envio" value={venta.estado_envio} />
    </div>
  );
}
