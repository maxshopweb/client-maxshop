import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Package } from 'lucide-react';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductosFilters } from '@/app/hooks/productos/useProductFilter';
import { useProductosTable } from '@/app/hooks/productos/useProductosTable';
import { getProductosColumns } from '../../columns/ProductosColumns';
import type { IProductos } from '@/app/types/producto.type';
import TableSkeleton from '../../skeletons/TableProductSkeleton';

interface ProductosTableProps {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    tableState: ReturnType<typeof useProductosTable>;
}

export function ProductosTable({
    onEdit,
    onDelete,
    onToggleDestacado,
    onUpdateStock,
    tableState,
}: ProductosTableProps) {
    // Hooks
    const { filters, setSort } = useProductosFilters();
    const { productos, isLoading, isError, error } = useProductos({ filters });

    const {
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        sorting,
        setSorting,
        densityClass,
    } = tableState;

    // Columnas con acciones
    const columns = getProductosColumns({
        onEdit,
        onDelete,
        onToggleDestacado,
        onUpdateStock,
    });

    // Instancia de la tabla
    const table = useReactTable({
        data: productos,
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
        getRowId: (row) => row.id_prod.toString(),
    });

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-red-600 text-lg font-semibold mb-2">
                    Error al cargar productos
                </div>
                <div className="text-gray-600 text-sm">
                    {error?.message || 'Ocurrió un error inesperado'}
                </div>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <div className="text-gray-600 text-lg font-semibold mb-2">
                    No hay productos
                </div>
                <div className="text-gray-500 text-sm">
                    No se encontraron productos con los filtros aplicados
                </div>
            </div>
        );
    }


    return (
        <div className="w-full">
            <div className="rounded-lg bg-card border border-card p-4 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* HEADER */}
                        <thead className="bg-input border border-input p-4">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                                }`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center gap-2">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}

                                                    {/* Indicador de ordenamiento */}
                                                    {header.column.getCanSort() && (
                                                        <span className="inline-flex">
                                                            {header.column.getIsSorted() === 'asc' ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : header.column.getIsSorted() === 'desc' ? (
                                                                <ChevronDown className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-[var(--input-bg)]">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors"
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`px-4 whitespace-nowrap ${densityClass}`}
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
        </div>
    );
}