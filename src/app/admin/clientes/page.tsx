"use client";

import { ClientesFilters } from '@/app/components/tables/Clientes/ClientesFilters';
import { ClientesTableWrapper } from '@/app/components/tables/Clientes/ClientesTableWrapper';
import { Users, RefreshCw, UserCheck, FileText } from 'lucide-react';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';
import { Button } from '@/app/components/ui/Button';
import { AnimatedStatCard } from '@/app/components/ui/AnimatedStatCard';

export default function ClientesPage() {
    const { filters } = useClientesFilters();
    const { clientes, pagination, refetch, isFetching, isLoading, isError, error } = useClientes({ filters });

    const totalClientes = pagination?.total || 0;
    const clientesActivos = clientes.filter(c => c.usuario?.estado === 1).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text mb-2">
                            Gestión de Clientes
                        </h1>
                        <p className="text-text/60">
                            Administra y visualiza la información de tus clientes
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
                        {/* <Users className="w-12 h-12 text-principal opacity-20" /> */}
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
            </div>

            {/* Mensaje de Error */}
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

            {/* Filtros y Tabla */}
            <div className="space-y-4">
                <ClientesFilters />
                {!isError && <ClientesTableWrapper />}
            </div>
        </div>
    );
}
