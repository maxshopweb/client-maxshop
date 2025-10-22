
"use client";
import { ProductosTable } from './ProductoTable';
import { ProductosPagination } from './ProductoPaginacion';
import { BulkActions } from './BulkActions';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductosFilters } from '@/app/hooks/productos/useProductFilter';
import { useProductosTable } from '@/app/hooks/productos/useProductosTable';
import type { IProductos } from '@/app/types/producto.type';

interface ProductosTableWrapperProps {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    onBulkDelete: (ids: number[]) => void;
}

export function ProductosTableWrapper(props: ProductosTableWrapperProps) {
    const { filters } = useProductosFilters();
    const { pagination } = useProductos({ filters });
    const tableState = useProductosTable();

    return (
        <div className="space-y-4">
            {tableState.selectedIds.length > 0 && (
                <BulkActions
                    selectedIds={tableState.selectedIds}
                    onClearSelection={tableState.clearSelection}
                    onBulkDelete={props.onBulkDelete}
                />
            )}

            <ProductosTable
                {...props}
                tableState={tableState} // ✅ Pasar el estado
            />

            {pagination && <ProductosPagination pagination={pagination} />}
        </div>
    );
}