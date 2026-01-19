"use client";
import { VentasTable } from './VentasTable';
import { VentasPagination } from './VentasPaginacion';
import { BulkActions } from './BulkActions';
import { useVentas } from '@/app/hooks/ventas/useVentas';
import { useVentasFilters } from '@/app/hooks/ventas/useVentasFilters';
import { useVentasTable } from '@/app/hooks/ventas/useVentasTable';
import type { IVenta } from '@/app/types/ventas.type';

interface VentasTableWrapperProps {
    onEdit: (venta: IVenta) => void;
    onDelete: (venta: IVenta) => void;
    onView: (venta: IVenta) => void;
    onBulkDelete: (ids: number[]) => void;
    highlightId?: number;
}

export function VentasTableWrapper(props: VentasTableWrapperProps) {
    const { filters } = useVentasFilters();
    const { pagination } = useVentas({ filters });
    const tableState = useVentasTable();
    const { highlightId, ...tableProps } = props;

    return (
        <div className="space-y-4">
            {tableState.selectedIds.length > 0 && (
                <BulkActions
                    selectedIds={tableState.selectedIds}
                    onClearSelection={tableState.clearSelection}
                    onBulkDelete={props.onBulkDelete}
                />
            )}

            <VentasTable
                {...tableProps}
                tableState={tableState}
                highlightId={highlightId}
            />

            {pagination && <VentasPagination pagination={pagination} />}
        </div>
    );
}

