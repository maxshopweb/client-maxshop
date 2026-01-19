"use client";
import { ClientesTable } from './ClientesTable';
import { ClientesPaginacion } from './ClientesPaginacion';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';
import { useClientesTable } from '@/app/hooks/clientes/useClientesTable';

export function ClientesTableWrapper() {
    const { filters } = useClientesFilters();
    const { pagination } = useClientes({ filters });
    const tableState = useClientesTable();

    return (
        <div className="space-y-4">
            <ClientesTable tableState={tableState} />
            {pagination && <ClientesPaginacion pagination={pagination} />}
        </div>
    );
}

