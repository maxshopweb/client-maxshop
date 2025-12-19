'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { VentasFilters } from '@/app/components/tables/Ventas/VentasFilters';
import { VentasTableWrapper } from '@/app/components/tables/Ventas/VentasTableWrapper';
import type { IVenta } from '@/app/types/ventas.type';
import { Button } from '@/app/components/ui/Button';
import { DeleteVentaModal } from '@/app/components/modals/Venta/DeleteVenta';
import { BulkDeleteVentasModal } from '@/app/components/modals/Venta/BulkDeleteVentasModal';
import { CreateVentaModal } from '@/app/components/modals/Venta/CreateWrapper';
import { EditVentaModal } from '@/app/components/modals/Venta/EditWrapper';
import { ViewVentaModal } from '@/app/components/modals/Venta/ViewVentaModal';

type ModalType = 'create' | 'edit' | 'delete' | 'view' | 'bulk-delete' | null;

interface ModalState {
    type: ModalType;
    venta?: IVenta;
}

export default function VentasPage() {
    const [modal, setModal] = useState<ModalState>({ type: null });
    const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);

    const openCreateModal = () => setModal({ type: 'create' });
    const openEditModal = (venta: IVenta) => setModal({ type: 'edit', venta });
    const openDeleteDialog = (venta: IVenta) => setModal({ type: 'delete', venta });
    const openViewDialog = (venta: IVenta) => setModal({ type: 'view', venta });

    const closeModal = () => {
        setModal({ type: null });
        setBulkDeleteIds([]);
    };

    const openBulkDeleteDialog = (ids: number[]) => {
        setBulkDeleteIds(ids);
        setModal({ type: 'bulk-delete' });
    };

    return (
        <div className="min-h-screen">
            <div className="">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text">Ventas</h1>
                            <p className="mt-1 text-sm text-text">
                                Gestiona todas las ventas y pedidos
                            </p>
                        </div>

                        <Button onClick={openCreateModal}>
                            <Plus className="h-5 w-5" />
                            Nueva venta
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <VentasFilters />

                    <VentasTableWrapper
                        onEdit={openEditModal}
                        onDelete={openDeleteDialog}
                        onView={openViewDialog}
                        onBulkDelete={openBulkDeleteDialog}
                    />
                </div>
            </div>

            {/* MODALES */}
            {modal.type === 'create' && (
                <CreateVentaModal onClose={closeModal} />
            )}

            {modal.type === 'edit' && modal.venta && (
                <EditVentaModal venta={modal.venta} onClose={closeModal} />
            )}

            {modal.type === 'delete' && modal.venta && (
                <DeleteVentaModal venta={modal.venta} onClose={closeModal} />
            )}

            {modal.type === 'bulk-delete' && bulkDeleteIds.length > 0 && (
                <BulkDeleteVentasModal
                    ventaIds={bulkDeleteIds}
                    onClose={closeModal}
                />
            )}

            {modal.type === 'view' && modal.venta && (
                <ViewVentaModal
                    venta={modal.venta}
                    onClose={closeModal}
                    isOpen={true}
                />
            )}
        </div>
    );
}

