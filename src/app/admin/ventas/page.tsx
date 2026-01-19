'use client';

import { Plus, RefreshCw, ShoppingCart, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { VentasFilters } from '@/app/components/tables/Ventas/VentasFilters';
import { VentasTableWrapper } from '@/app/components/tables/Ventas/VentasTableWrapper';
import { Button } from '@/app/components/ui/Button';
import { DeleteVentaModal } from '@/app/components/modals/Venta/DeleteVenta';
import { BulkDeleteVentasModal } from '@/app/components/modals/Venta/BulkDeleteVentasModal';
import { CreateVentaModal } from '@/app/components/modals/Venta/CreateWrapper';
import { EditVentaModal } from '@/app/components/modals/Venta/EditWrapper';
import { ViewVentaModal } from '@/app/components/modals/Venta/ViewVentaModal';
import { useVentasPage } from '@/app/hooks/ventas/useVentasPage';
import { useVentasStats } from '@/app/hooks/ventas/useVentasStats';
import { AnimatedStatCard } from '@/app/components/ui/AnimatedStatCard';
import { formatPrecio } from '@/app/types/ventas.type';

export default function VentasPage() {
    const {
        modal,
        bulkDeleteIds,
        highlightId,
        isFetching,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        openViewDialog,
        openBulkDeleteDialog,
        closeModal,
        refetch,
    } = useVentasPage();

    const stats = useVentasStats();

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

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={refetch}
                                disabled={isFetching}
                                variant="outline-primary"
                                className="flex items-center gap-2 justify-center"
                            >
                                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                                Refrescar
                            </Button>
                            <Button onClick={openCreateModal}>
                                <Plus className="h-5 w-5" />
                                Nueva venta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <AnimatedStatCard
                            title="Total ventas"
                            value={stats.totalVentas}
                            icon={ShoppingCart}
                            iconColor="text-blue-500"
                        />
                        <AnimatedStatCard
                            title="Total vendido"
                            value={stats.totalVendido}
                            icon={DollarSign}
                            iconColor="text-green-500"
                            formatValue={(val) => formatPrecio(val)}
                        />
                        <AnimatedStatCard
                            title="Promedio por venta"
                            value={stats.promedioVenta}
                            icon={TrendingUp}
                            iconColor="text-purple-500"
                            formatValue={(val) => formatPrecio(val)}
                        />
                        <AnimatedStatCard
                            title="Ventas aprobadas"
                            value={stats.ventasAprobadas}
                            icon={CheckCircle2}
                            iconColor="text-green-600"
                        />
                    </div>

                    <VentasFilters />

                    <VentasTableWrapper
                        onEdit={openEditModal}
                        onDelete={openDeleteDialog}
                        onView={openViewDialog}
                        onBulkDelete={openBulkDeleteDialog}
                        highlightId={highlightId}
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

