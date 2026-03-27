"use client";
import { ProductosTable } from './ProductoTable';
import { ProductosPagination } from './ProductoPaginacion';
import { BulkActions } from './BulkActions';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';
import { useProductosTable } from '@/app/hooks/productos/useProductosTable';
import {
    useReanudarSincronizacionErp,
    useRestaurarProductoDesdeErp,
    useBulkReanudarSincronizacionErp,
    useBulkRestaurarDesdeErp,
} from '@/app/hooks/productos/useProductosMutations';
import type { IProductos } from '@/app/types/producto.type';

interface ProductosTableWrapperProps {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onTogglePublicado: (producto: IProductos) => void;
    onToggleCuotas?: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    onCambiarImagen?: (producto: IProductos) => void;
    onBulkDelete: (ids: number[]) => void;
}

export function ProductosTableWrapper(props: ProductosTableWrapperProps) {
    const { backendFilters: filters } = useProductFilters();
    const { pagination } = useProductos({ filters });
    const tableState = useProductosTable();

    const { reanudarSincronizacionErp } = useReanudarSincronizacionErp();
    const { restaurarProductoDesdeErp } = useRestaurarProductoDesdeErp();

    const { bulkReanudarErp, isBulkReanudandoErp } = useBulkReanudarSincronizacionErp({
        onSuccess: () => tableState.clearSelection(),
    });
    const { bulkRestaurarDesdeErp, isBulkRestaurandoDesdeErp } = useBulkRestaurarDesdeErp({
        onSuccess: () => tableState.clearSelection(),
    });

    const handleReanudarSyncErp = (producto: IProductos) => {
        if (
            !window.confirm(
                'Se quitará el bloqueo de sincronización FTP: stock y precios se actualizarán en la próxima importación automática (no ahora). ¿Continuar?'
            )
        ) {
            return;
        }
        reanudarSincronizacionErp(producto.id_prod);
    };

    const handleActualizarDesdeErp = (producto: IProductos) => {
        if (
            !window.confirm(
                'Se conectará al FTP, se descargarán los datos y se aplicarán a este producto ahora. ¿Continuar?'
            )
        ) {
            return;
        }
        restaurarProductoDesdeErp(producto.id_prod);
    };

    const handleBulkReanudarErp = (ids: number[]) => {
        bulkReanudarErp(ids);
    };

    const handleBulkRestaurarDesdeErp = (ids: number[]) => {
        if (
            !window.confirm(
                `Se descargará el FTP y se aplicará a ${ids.length} producto(s). Puede tardar bastante. ¿Continuar?`
            )
        ) {
            return;
        }
        bulkRestaurarDesdeErp(ids);
    };

    return (
        <div className="space-y-4">
            {tableState.selectedIds.length > 0 && (
                <BulkActions
                    selectedIds={tableState.selectedIds}
                    onClearSelection={tableState.clearSelection}
                    onBulkDelete={props.onBulkDelete}
                    onBulkReanudarErp={handleBulkReanudarErp}
                    onBulkRestaurarDesdeErp={handleBulkRestaurarDesdeErp}
                    isBulkReanudandoErp={isBulkReanudandoErp}
                    isBulkRestaurandoDesdeErp={isBulkRestaurandoDesdeErp}
                />
            )}

            <ProductosTable
                {...props}
                onReanudarSyncErp={handleReanudarSyncErp}
                onActualizarDesdeErp={handleActualizarDesdeErp}
                tableState={tableState}
            />

            {pagination && <ProductosPagination pagination={pagination} />}
        </div>
    );
}
