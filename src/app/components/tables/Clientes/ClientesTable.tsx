"use client";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';
import { useClientesTable } from '@/app/hooks/clientes/useClientesTable';
import { createClientesColumns } from '../../columns/ClientesColumns';
import type { ICliente } from '@/app/types/cliente.type';
import TableSkeleton from '../../skeletons/TableProductSkeleton';

interface ClientesTableProps {
    tableState: ReturnType<typeof useClientesTable>;
}

export function ClientesTable({ tableState }: ClientesTableProps) {
    // Hooks
    const { filters } = useClientesFilters();
    const { clientes, isLoading, isError, error } = useClientes({ filters });

    const {
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        sorting,
        setSorting,
        densityClass,
        selectedIds,
        isAllSelected,
        selectAll,
    } = tableState;

    // Columnas
    const columns = createClientesColumns(
        undefined, // onView - no necesario, usamos link directo
        isAllSelected(clientes.length),
        (checked) => {
            if (checked) {
                selectAll(clientes.map(c => c.id_usuario));
            } else {
                setRowSelection({});
            }
        },
        selectedIds.length
    );

    // Instancia de la tabla
    const table = useReactTable({
        data: clientes,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        state: {
            rowSelection,
            columnVisibility,
            sorting,
        },
        getRowId: (row) => row.id_usuario,
    });

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-red-600 text-lg font-semibold mb-2">
                    Error al cargar clientes
                </div>
                <div className="text-gray-600 text-sm">
                    {error?.message || 'Ocurrió un error inesperado'}
                </div>
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <Users className="w-16 h-16 text-gray-300 mb-4" />
                <div className="text-gray-600 text-lg font-semibold mb-2">
                    No hay clientes
                </div>
                <div className="text-gray-500 text-sm">
                    No se encontraron clientes con los filtros aplicados
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="border-b border-gray-200 bg-gray-50"
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${densityClass}`}
                                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`px-4 text-text ${densityClass}`}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

