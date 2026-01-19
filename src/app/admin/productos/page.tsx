'use client';

import { useState, Suspense } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { ProductosFilters } from '@/app/components/tables/Productos/ProductosFilters';
import { ProductosTableWrapper } from '@/app/components/tables/Productos/ProductoTableWrapper';
import type { IProductos } from '@/app/types/producto.type';
import { Button } from '@/app/components/ui/Button';
import { CreateProductoModal } from '@/app/components/modals/Producto/CreateWrapper';
import { EditProductoModal } from '@/app/components/modals/Producto/EditWrapper';
import { DeleteProductoModal } from '@/app/components/modals/Producto/DeleteProduct';
import { BulkDeleteProductosModal } from '@/app/components/modals/Producto/BulkDeleteProductosModal';
import { useToggleDestacado } from '@/app/hooks/productos/useProductosMutations';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';

type ModalType = 'create' | 'edit' | 'delete' | 'stock' | 'bulk-delete' | null;

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
    const openDeleteDialog = (producto: IProductos) => setModal({ type: 'delete', producto });
    const openStockDialog = (producto: IProductos) => setModal({ type: 'stock', producto });
    const { toggleDestacado } = useToggleDestacado();

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

    return (
        <div className="min-h-screen">
            <div className="">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text">Productos</h1>
                            <p className="mt-1 text-sm text-text">
                                Gestiona tu catálogo de productos
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <ProductosFilters />

                    <ProductosTableWrapper
                        onEdit={openEditModal}
                        onDelete={openDeleteDialog}
                        onToggleDestacado={handleToggleDestacado}
                        onUpdateStock={openStockDialog}
                        onBulkDelete={openBulkDeleteDialog}
                    />
                </div>
            </div>

            {/* MODALES */}
            {modal.type === 'create' && (
                <CreateProductoModal onClose={closeModal} />
            )}

            {modal.type === 'edit' && modal.producto && (
                <EditProductoModal producto={modal.producto} onClose={closeModal} />
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
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="space-y-6">
                            <div className="bg-card border border-card p-4 rounded-lg shadow-lg animate-pulse">
                                <div className="h-10 bg-input rounded"></div>
                            </div>
                            <div className="bg-card border border-card rounded-lg shadow-lg animate-pulse">
                                <div className="h-96"></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <ProductosPageContent />
        </Suspense>
    );
}
