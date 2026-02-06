import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Package } from 'lucide-react';
import { useProductos } from '@/app/hooks/productos/useProductos';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';
import { useProductosTable } from '@/app/hooks/productos/useProductosTable';
import { getProductosColumns } from '../../columns/ProductosColumns';
import type { IProductos } from '@/app/types/producto.type';
import TableSkeleton from '../../skeletons/TableProductSkeleton';

interface ProductosTableProps {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onTogglePublicado: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    onCambiarImagen?: (producto: IProductos) => void;
    tableState: ReturnType<typeof useProductosTable>;
}

export function ProductosTable({
    onEdit,
    onDelete,
    onToggleDestacado,
    onTogglePublicado,
    onUpdateStock,
    onCambiarImagen,
    tableState,
}: ProductosTableProps) {
    // Hooks
    const { backendFilters: filters, setSort, categorias, marcas } = useProductFilters();
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
        onTogglePublicado,
        onUpdateStock,
        onCambiarImagen,
        categorias,
        marcas,
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