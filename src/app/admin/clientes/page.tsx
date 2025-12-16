"use client";

import { ClientesFilters } from '@/app/components/tables/Clientes/ClientesFilters';
import { ClientesTableWrapper } from '@/app/components/tables/Clientes/ClientesTableWrapper';
import { Users } from 'lucide-react';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';

export default function ClientesPage() {
    const { filters } = useClientesFilters();
    const { clientes, pagination } = useClientes({ filters });

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
                    <Users className="w-12 h-12 text-principal opacity-20" />
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-text mb-2">Total Clientes</h3>
                        <p className="text-3xl font-bold text-principal">{totalClientes}</p>
                    </div>
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-text mb-2">Clientes Activos</h3>
                        <p className="text-3xl font-bold text-principal">{clientesActivos}</p>
                    </div>
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-text mb-2">Página Actual</h3>
                        <p className="text-3xl font-bold text-principal">
                            {pagination?.page || 1} / {pagination?.totalPages || 1}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtros y Tabla */}
            <div className="space-y-4">
                <ClientesFilters />
                <ClientesTableWrapper />
            </div>
        </div>
    );
}
