import { useEffect, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ShoppingCart } from 'lucide-react';
import { useVentas } from '@/app/hooks/ventas/useVentas';
import { useVentasFilters } from '@/app/hooks/ventas/useVentasFilters';
import { useVentasTable } from '@/app/hooks/ventas/useVentasTable';
import { getVentasColumns } from '../../columns/VentasColumns';
import type { IVenta } from '@/app/types/ventas.type';
import TableSkeleton from '../../skeletons/TableProductSkeleton';

interface VentasTableProps {
    onEdit: (venta: IVenta) => void;
    onDelete: (venta: IVenta) => void;
    onView: (venta: IVenta) => void;
    tableState: ReturnType<typeof useVentasTable>;
    highlightId?: number;
}

export function VentasTable({
    onEdit,
    onDelete,
    onView,
    tableState,
    highlightId,
}: VentasTableProps) {
    // Hooks
    const { filters } = useVentasFilters();
    const { ventas, isLoading, isError, error } = useVentas({ filters });

    const {
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        sorting,
        setSorting,
        densityClass,
    } = tableState;
    const highlightRowRef = useRef<HTMLTableRowElement>(null);

    // Columnas con acciones
    const columns = getVentasColumns({
        onEdit,
        onDelete,
        onView,
    });

    // Instancia de la tabla
    const table = useReactTable({
        data: ventas,
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
        getRowId: (row) => row.id_venta.toString(),
    });

    // Scroll to highlighted row
    useEffect(() => {
        if (highlightId && highlightRowRef.current && !isLoading) {
            setTimeout(() => {
                highlightRowRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }
    }, [highlightId, isLoading]);

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-red-600 text-lg font-semibold mb-2">
                    Error al cargar ventas
                </div>
                <div className="text-gray-600 text-sm">
                    {error?.message || 'Ocurrió un error inesperado'}
                </div>
            </div>
        );
    }

    if (ventas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <div className="text-gray-600 text-lg font-semibold mb-2">
                    No hay ventas
                </div>
                <div className="text-gray-500 text-sm">
                    No se encontraron ventas con los filtros aplicados
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
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const isSorted = header.column.getIsSorted();

                                    return (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${densityClass} ${
                                                canSort ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                                            }`}
                                            style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            <div className="flex items-center gap-2">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {canSort && (
                                                    <span className="flex flex-col">
                                                        {isSorted === 'asc' ? (
                                                            <ChevronUp className="w-3 h-3" />
                                                        ) : isSorted === 'desc' ? (
                                                            <ChevronDown className="w-3 h-3" />
                                                        ) : (
                                                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => {
                            const isHighlighted = highlightId === row.original.id_venta;
                            return (
                                <tr
                                    key={row.id}
                                    ref={isHighlighted ? highlightRowRef : null}
                                    className={`
                                        hover:bg-gray-50 transition-all duration-300
                                        ${isHighlighted 
                                            ? 'bg-principal/10 dark:bg-principal/20 border-l-4 border-principal' 
                                            : ''
                                        }
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`px-4 text-text ${densityClass} ${isHighlighted ? 'font-medium' : ''}`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                            {isHighlighted && cell.column.id === 'id_venta' && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-principal text-white">
                                                    Nueva
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

