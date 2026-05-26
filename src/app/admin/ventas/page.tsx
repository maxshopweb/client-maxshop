'use client';

import { useCallback, useState } from 'react';
import { Plus, RefreshCw, FileSpreadsheet, ShoppingCart, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { VentasFilters } from '@/app/components/tables/Ventas/VentasFilters';
import { VentasTableWrapper } from '@/app/components/tables/Ventas/VentasTableWrapper';
import { Button } from '@/app/components/ui/Button';
import { DeleteVentaModal } from '@/app/components/modals/Venta/DeleteVenta';
import { BulkDeleteVentasModal } from '@/app/components/modals/Venta/BulkDeleteVentasModal';
import { ConfirmActionWithPasswordModal } from '@/app/components/modals/ConfirmActionWithPasswordModal';
import { CreateVentaModal } from '@/app/components/modals/Venta/CreateWrapper';
import { EditVentaModal } from '@/app/components/modals/Venta/EditWrapper';
import { ViewVentaModal } from '@/app/components/modals/Venta/ViewVentaModal';
import { EnviarFacturaModal } from '@/app/components/modals/Venta/EnviarFacturaModal';
import { FacturasPendientesCard } from '@/app/components/Ventas/FacturasPendientesCard';
import { useVentasPage } from '@/app/hooks/ventas/useVentasPage';
import { useVentasStats } from '@/app/hooks/ventas/useVentasStats';
import { AnimatedStatCard } from '@/app/components/ui/AnimatedStatCard';
import { formatPrecio } from '@/app/types/ventas.type';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { ventasService } from '@/app/services/venta.service';
import { VentasFiltersProvider } from '@/app/hooks/ventas/useVentasFilters';

export default function VentasPage() {
    return (
        <VentasFiltersProvider>
            <VentasPageContent />
        </VentasFiltersProvider>
    );
}

function VentasPageContent() {
    const {
        modal,
        bulkDeleteIds,
        highlightId,
        isFetching,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        openViewDialog,
        openEnviarFacturaModal,
        openBulkDeleteDialog,
        closeModal,
        refetch,
    } = useVentasPage();

    const stats = useVentasStats();
    const [isDownloadingFtp, setIsDownloadingFtp] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => () => Promise<void>) | null>(null);

    const handleRequestPasswordConfirm = useCallback((perform: () => Promise<void>) => {
        setPendingAction(() => perform);
        setShowPasswordModal(true);
        closeModal();
    }, [closeModal]);

    const handlePasswordConfirm = useCallback(async () => {
        const getAction = pendingAction;
        if (!getAction || typeof getAction !== 'function') return;
        const action = getAction();
        if (typeof action === 'function') {
            await action();
        }
        setPendingAction(null);
        setShowPasswordModal(false);
    }, [pendingAction]);

    const handleDownloadFtpExcel = useCallback(async () => {
        setIsDownloadingFtp(true);
        try {
            const blob = await ventasService.downloadVentasExcelFtp();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Ventas.xlsx';
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Descarga iniciada', { description: 'Ventas.xlsx desde el FTP.' });
        } catch (e) {
            toast.error('No se pudo descargar el Excel', {
                description: e instanceof Error ? e.message : 'Error desconocido.',
            });
        } finally {
            setIsDownloadingFtp(false);
        }
    }, []);

    const handleBulkDownload = useCallback(async (ids: number[]) => {
        try {
            const blob = await ventasService.exportVentas(ids);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ventas-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Descarga iniciada', {
                description: `${ids.length} venta(s) exportada(s) a CSV.`,
            });
        } catch (e) {
            toast.error('Error al exportar', {
                description: e instanceof Error ? e.message : 'No se pudo descargar el archivo.',
            });
        }
    }, []);

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
                    <Button
                        type="button"
                        onClick={handleDownloadFtpExcel}
                        disabled={isDownloadingFtp}
                        variant="outline-primary"
                        className="flex items-center gap-2 justify-center"
                    >
                        <FileSpreadsheet className={`h-4 w-4 ${isDownloadingFtp ? 'animate-pulse' : ''}`} />
                        Descargar EXCEL FTP
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

                <FacturasPendientesCard />

                <VentasTableWrapper
                    onEdit={openEditModal}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    onEnviarFactura={openEnviarFacturaModal}
                    onBulkDelete={openBulkDeleteDialog}
                    onBulkDownload={handleBulkDownload}
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
                <DeleteVentaModal
                    venta={modal.venta}
                    onClose={closeModal}
                    onRequestPasswordConfirm={handleRequestPasswordConfirm}
                />
            )}

            {modal.type === 'bulk-delete' && bulkDeleteIds.length > 0 && (
                <BulkDeleteVentasModal
                    ventaIds={bulkDeleteIds}
                    onClose={closeModal}
                    onRequestPasswordConfirm={handleRequestPasswordConfirm}
                />
            )}

            <ConfirmActionWithPasswordModal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    setPendingAction(null);
                }}
                title="Confirmar con tu contraseña"
                message="Para completar la acción, ingresá tu contraseña actual."
                confirmLabel="Confirmar y ejecutar"
                onConfirm={handlePasswordConfirm}
            />

            {modal.type === 'view' && modal.venta && (
                <ViewVentaModal
                    venta={modal.venta}
                    onClose={closeModal}
                    isOpen={true}
                />
            )}

            {modal.type === 'enviar-factura' && modal.venta && (
                <EnviarFacturaModal
                    venta={modal.venta}
                    onClose={closeModal}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
}

