import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, Star, Package } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import type { IProductos } from '@/app/types/producto.type';
import { formatearPrecio, getStockInfo } from '@/app/utils/producto.utils';
import { EstadoGeneral } from '@/app/types/estados.type';

interface ProductosTableActions {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
}

export const getProductosColumns = (
    actions: ProductosTableActions
): ColumnDef<IProductos>[] => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox.Root
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                >
                    <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
            ),
            cell: ({ row }) => (
                <Checkbox.Root
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                >
                    <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'img_principal',
            header: 'Imagen',
            cell: ({ row }) => {
                const imagen = row.getValue('img_principal') as string | null;
                const nombre = row.original.nombre || 'Producto';

                return (
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imagen ? (
                            <img
                                src={imagen}
                                alt={nombre}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'nombre',
            header: 'Producto',
            cell: ({ row }) => {
                const nombre = row.getValue('nombre') as string;
                const sku = row.original.cod_sku;
                const destacado = row.original.destacado;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-text">{nombre}</span>
                            {destacado && (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                        </div>
                        {sku && (
                            <span className="text-xs text-gray-400">SKU: {sku}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'subcategoria.nombre',
            header: 'Categoría',
            cell: ({ row }) => {
                const subcategoria = row.original.subcategoria;
                const categoria = subcategoria?.categoria;

                if (!subcategoria) return <span className="text-gray-400">-</span>;

                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{subcategoria.nombre}</span>
                        {categoria && (
                            <span className="text-xs text-text">{categoria.nombre}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'marca.nombre',
            header: 'Marca',
            cell: ({ row }) => {
                const marca = row.original.marca?.nombre;
                return marca ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-text border border-input-border">
                        {marca}
                    </span>
                ) : (
                    <span className="text-text">-</span>
                );
            },
        },
        {
            accessorKey: 'precio',
            header: 'Precio',
            cell: ({ row }) => {
                const precio = row.getValue('precio') as number | null;
                return (
                    <span className="font-semibold text-text">
                        {formatearPrecio(precio)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
            cell: ({ row }) => {
                const producto = row.original;
                const stockInfo = getStockInfo(producto);

                return (
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockInfo.color}`}>
                            {stockInfo.cantidad} unidades
                        </span>
                        {stockInfo.status === 'stock_bajo' && (
                            <span className="text-xs text-yellow-600">⚠️</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const estado = row.getValue('estado') as EstadoGeneral;

                const config = {
                    1: {
                        bg: 'bg-green-100',
                        text: 'text-green-800',
                        border: 'border-green-200',
                        label: 'Activo'
                    },
                    2: {
                        bg: 'bg-yellow-100',
                        text: 'text-yellow-800',
                        border: 'border-yellow-200',
                        label: 'Inactivo'
                    },
                    0: {
                        bg: 'bg-red-100',
                        text: 'text-red-800',
                        border: 'border-red-200',
                        label: 'Eliminado'
                    }
                };

                const style = config[estado as 0 | 1 | 2] || config[2];

                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
                    >
                        {style.label}
                    </span>
                );
            },
        },
        {
            accessorKey: 'destacado',
            header: 'Destacado',
            cell: ({ row }) => {
                const destacado = row.getValue('destacado') as boolean;
                const producto = row.original;

                return (
                    <button
                        onClick={() => actions.onToggleDestacado(producto)}
                        className="hover:scale-110 transition-transform"
                    >
                        <Star
                            className={`w-5 h-5 ${destacado
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-text'
                                }`}
                        />
                    </button>
                );
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const producto = row.original;

                return (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-input h-8 w-8 p-0 text-input">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="min-w-[180px] bg-card rounded-md shadow-lg border border-card p-1"
                                align="end"
                                sideOffset={5}
                            >
                                <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                    onClick={() => actions.onEdit(producto)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenu.Item>

                                {/* <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                    onClick={() => actions.onUpdateStock(producto)}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Actualizar stock
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                    onClick={() => actions.onToggleDestacado(producto)}
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    {producto.destacado ? 'Quitar destacado' : 'Destacar'}
                                </DropdownMenu.Item> */}

                                <DropdownMenu.Separator className="h-px bg-[var(--card-border)] my-1" />

                                <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-red-500/10 rounded outline-none text-red-600 transition-colors"
                                    onClick={() => actions.onDelete(producto)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];

export const defaultColumnVisibility = {
    'marca.nombre': true,
    'subcategoria.nombre': true,
    destacado: true,
    estado: true,
};

export const defaultColumnOrder = [
    'select',
    'img_principal',
    'nombre',
    'subcategoria.nombre',
    'marca.nombre',
    'precio',
    'stock',
    'estado',
    'destacado',
    'actions',
];