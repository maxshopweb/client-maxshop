'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProductosFilters } from '@/app/components/tables/Productos/ProductosFilters';
import { ProductosTableWrapper } from '@/app/components/tables/Productos/ProductoTableWrapper';
import type { IProductos } from '@/app/types/producto.type';
import { Button } from '@/app/components/ui/Button';
import { CreateProductoModal } from '@/app/components/modals/Producto/CreateWrapper';
import { EditProductoModal } from '@/app/components/modals/Producto/EditWrapper';
import { DeleteProductoModal } from '@/app/components/modals/Producto/DeleteProduct';
import { BulkDeleteProductosModal } from '@/app/components/modals/Producto/BulkDeleteProductosModal';

type ModalType = 'create' | 'edit' | 'delete' | 'stock' | 'bulk-delete' | null;

interface ModalState {
    type: ModalType;
    producto?: IProductos;
}

export default function ProductosPage() {
    const [modal, setModal] = useState<ModalState>({ type: null });
    const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);

    const openCreateModal = () => setModal({ type: 'create' });
    const openEditModal = (producto: IProductos) => setModal({ type: 'edit', producto });
    const openDeleteDialog = (producto: IProductos) => setModal({ type: 'delete', producto });
    const openStockDialog = (producto: IProductos) => setModal({ type: 'stock', producto });
    const closeModal = () => {
        setModal({ type: null });
        setBulkDeleteIds([]);
    };

    const openBulkDeleteDialog = (ids: number[]) => {
        setBulkDeleteIds(ids);
        setModal({ type: 'bulk-delete' });
    };

    const handleToggleDestacado = (producto: IProductos) => {
        console.log('Toggle destacado:', producto);
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

                        <Button onClick={openCreateModal}>
                            <Plus className="h-5 w-5" />
                            Nuevo Producto
                        </Button>
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