"use client";

import { useState } from 'react';
import { ClientesFilters } from '@/app/components/tables/Clientes/ClientesFilters';
import { ClientesTableWrapper } from '@/app/components/tables/Clientes/ClientesTableWrapper';
import { Users, RefreshCw, UserCheck, FileText, FileDown } from 'lucide-react';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';
import { Button } from '@/app/components/ui/Button';
import { AnimatedStatCard } from '@/app/components/ui/AnimatedStatCard';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { clientesService } from '@/app/services/cliente.service';

export default function ClientesPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const { filters } = useClientesFilters();
    const { clientes, pagination, refetch, isFetching, isLoading, isError, error } = useClientes({ filters });

    const totalClientes = pagination?.total || 0;
    const clientesActivos = clientes.filter(c => c.usuario?.activo !== false).length;

    const handleExportExcel = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            await clientesService.exportExcel();
        } catch (err: any) {
            setExportError(err?.message || 'Error al exportar. Revisa la consola.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AdminPageContainer>
            <AdminPageHeader
                title="Gestión de Clientes"
                description="Administra y visualiza la información de tus clientes"
            >
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        variant="outline-primary"
                        className="flex items-center gap-2 justify-center"
                        title="Descargar Excel de clientes (también se sube al FTP)"
                    >
                        <FileDown className={`h-4 w-4 shrink-0 ${isExporting ? 'animate-pulse' : ''}`} />
                        {isExporting ? 'Exportando…' : 'Exportar Excel'}
                    </Button>
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        variant="outline-primary"
                        className="flex items-center gap-2 justify-center"
                    >
                        <RefreshCw className={`h-4 w-4 shrink-0 ${isFetching ? 'animate-spin' : ''}`} />
                        Refrescar
                    </Button>
                </div>
            </AdminPageHeader>

            {exportError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
                    {exportError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedStatCard
                    title="Total clientes"
                    value={isLoading ? '-' : totalClientes}
                    icon={Users}
                    iconColor="text-blue-500"
                />
                <AnimatedStatCard
                    title="Clientes activos"
                    value={isLoading ? '-' : clientesActivos}
                    icon={UserCheck}
                    iconColor="text-green-500"
                />
                <AnimatedStatCard
                    title="Página actual"
                    value={isLoading ? '-' : `${pagination?.page || 1} / ${pagination?.totalPages || 1}`}
                    icon={FileText}
                    iconColor="text-purple-500"
                />
            </div>

            {isError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                        Error al cargar clientes
                    </p>
                    <p className="text-red-600 dark:text-red-300 text-sm">
                        {error?.message || 'Ocurrió un error inesperado al obtener los datos'}
                    </p>
                    {process.env.NODE_ENV === 'development' && error && (
                        <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto">
                            {JSON.stringify(error, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            <ClientesFilters />
            {!isError && <ClientesTableWrapper />}
        </AdminPageContainer>
    );
}
