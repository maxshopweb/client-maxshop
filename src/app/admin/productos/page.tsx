'use client';

import { useState, Suspense } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { ProductosFilters } from '@/app/components/tables/Productos/ProductosFilters';
import { ProductosTableWrapper } from '@/app/components/tables/Productos/ProductoTableWrapper';
import type { IProductos } from '@/app/types/producto.type';
import { Button } from '@/app/components/ui/Button';
import { CreateProductoModal } from '@/app/components/modals/Producto/CreateWrapper';
import { EditProductoModal } from '@/app/components/modals/Producto/EditWrapper';
import { CambiarImagenModal } from '@/app/components/modals/Producto/CambiarImagenModal';
import { DeleteProductoModal } from '@/app/components/modals/Producto/DeleteProduct';
import { BulkDeleteProductosModal } from '@/app/components/modals/Producto/BulkDeleteProductosModal';
import { useToggleDestacado, useUpdateProducto } from '@/app/hooks/productos/useProductosMutations';
import { useTogglePublicado } from '@/app/hooks/productos/usePublicadoMutations';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';

type ModalType = 'create' | 'edit' | 'delete' | 'stock' | 'bulk-delete' | 'cambiar-imagen' | null;

interface ModalState {
    type: ModalType;
    producto?: IProductos;
}

function ProductosPageContent() {
    const [modal, setModal] = useState<ModalState>({ type: null });
    const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);
    
    // Obtener filtros y paginación desde URL usando el hook (igual que en la tienda)
    const { backendFilters, filters, page, limit } = useProductFilters();
    
    // Obtener productos del backend con paginación y filtros aplicados
    const { refetch, isFetching } = useProductos({ 
        filters: backendFilters,
        enabled: true,
        keepPreviousData: true, // Mantener datos mientras cargan nuevos (mejor UX)
    });

    const openCreateModal = () => setModal({ type: 'create' });
    const openEditModal = (producto: IProductos) => setModal({ type: 'edit', producto });
    const openCambiarImagenModal = (producto: IProductos) => setModal({ type: 'cambiar-imagen', producto });
    const openDeleteDialog = (producto: IProductos) => setModal({ type: 'delete', producto });
    const openStockDialog = (producto: IProductos) => setModal({ type: 'stock', producto });
    const { toggleDestacado } = useToggleDestacado();
    const { togglePublicado } = useTogglePublicado();
    const { updateProducto } = useUpdateProducto();

    const closeModal = () => {
        setModal({ type: null });
        setBulkDeleteIds([]);
    };

    const openBulkDeleteDialog = (ids: number[]) => {
        setBulkDeleteIds(ids);
        setModal({ type: 'bulk-delete' });
    };

    const handleToggleDestacado = (producto: IProductos) => {
        toggleDestacado(producto.id_prod);
    };

    const handleTogglePublicado = (producto: IProductos) => {
        togglePublicado(producto.id_prod);
    };

    const handleToggleCuotas = (producto: IProductos) => {
        const next = producto.cuotas_habilitadas === true ? false : true;
        updateProducto({ id: producto.id_prod, data: { cuotas_habilitadas: next } });
    };

    return (
        <div className="min-h-screen">
            <AdminPageContainer>
                <AdminPageHeader
                    title="Productos"
                    description="Gestiona tu catálogo de productos"
                >
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        variant="outline-primary"
                        className="flex items-center gap-2 justify-center"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        Refrescar
                    </Button>
                    <Button onClick={openCreateModal}>
                        <Plus className="h-5 w-5" />
                        Nuevo Producto
                    </Button>
                </AdminPageHeader>

                <ProductosFilters />

                <ProductosTableWrapper
                        onEdit={openEditModal}
                        onDelete={openDeleteDialog}
                        onToggleDestacado={handleToggleDestacado}
                        onTogglePublicado={handleTogglePublicado}
                        onToggleCuotas={handleToggleCuotas}
                        onUpdateStock={openStockDialog}
                        onCambiarImagen={openCambiarImagenModal}
                        onBulkDelete={openBulkDeleteDialog}
                    />
            </AdminPageContainer>

            {/* MODALES */}
            {modal.type === 'create' && (
                <CreateProductoModal onClose={closeModal} />
            )}

            {modal.type === 'edit' && modal.producto && (
                <EditProductoModal producto={modal.producto} onClose={closeModal} />
            )}

            {modal.type === 'cambiar-imagen' && modal.producto && (
                <CambiarImagenModal product={modal.producto} onClose={closeModal} />
            )}

            {modal.type === 'delete' && modal.producto && (
                <DeleteProductoModal producto={modal.producto} onClose={closeModal} />
            )}

            {modal.type === 'bulk-delete' && bulkDeleteIds.length > 0 && (
                <BulkDeleteProductosModal
                    productIds={bulkDeleteIds}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default function ProductosPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen">
                    <AdminPageContainer>
                        <div className="bg-card border border-card p-4 rounded-lg shadow-lg animate-pulse">
                            <div className="h-10 bg-input rounded"></div>
                        </div>
                        <div className="bg-card border border-card rounded-lg shadow-lg animate-pulse">
                            <div className="h-96"></div>
                        </div>
                    </AdminPageContainer>
                </div>
            }
        >
            <ProductosPageContent />
        </Suspense>
    );
}
