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
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';

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
            <AdminPageContainer>
                <AdminPageHeader
                    title="Ventas"
                    description="Gestiona todas las ventas y pedidos"
                >
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
                </AdminPageHeader>

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
            </AdminPageContainer>

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

