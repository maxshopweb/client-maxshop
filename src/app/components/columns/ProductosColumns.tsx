import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import type { IProductos } from '@/app/types/producto.type';
import { formatearPrecio, getStockInfo } from '@/app/utils/producto.utils';
import { EstadoGeneral } from '@/app/types/estados.type';
import ProductImage from '../shared/ProductImage';

interface ProductosTableActions {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    categorias?: any[];
    marcas?: any[];
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
                    <ProductImage imgPrincipal={imagen} nombre={nombre} />
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'codi_arti',
            header: 'Código Artículo',
            cell: ({ row }) => {
                const codi_arti = row.getValue('codi_arti') as string;
                return (
                    <span className="text-sm font-mono text-gray-600">{codi_arti}</span>
                );
            },
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
                            {/* {destacado && (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )} */}
                        </div>
                        {sku && (
                            <span className="text-xs text-gray-400">SKU: {sku}</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'categoria',
            accessorKey: 'codi_categoria',
            header: 'Categoría',
            cell: ({ row }) => {
                const producto = row.original;
                const categoria = producto.categoria;

                // Si tiene categoría poblada, mostrarla
                if (categoria?.nombre) {
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{categoria.nombre}</span>
                            {categoria.codi_categoria && (
                                <span className="text-xs text-gray-400">Cód: {categoria.codi_categoria}</span>
                            )}
                        </div>
                    );
                }

                // Buscar por código en la lista de categorías
                if (producto.codi_categoria && actions.categorias) {
                    const cat = actions.categorias.find((c: any) => c.codi_categoria === producto.codi_categoria);
                    if (cat?.nombre) {
                        return (
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">{cat.nombre}</span>
                                <span className="text-xs text-gray-400">Cód: {producto.codi_categoria}</span>
                            </div>
                        );
                    }
                }

                // Fallback: buscar por ID (legacy)
                if (producto.id_cat && actions.categorias) {
                    const cat = actions.categorias.find((c: any) => c.id_cat === producto.id_cat);
                    if (cat?.nombre) {
                        return <span className="text-sm font-medium">{cat.nombre}</span>;
                    }
                }

                return <span className="text-gray-400">-</span>;
            },
        },
        {
            id: 'marca',
            accessorKey: 'codi_marca',
            header: 'Marca',
            cell: ({ row }) => {
                const producto = row.original;
                const marca = producto.marca;
                let nombreMarca = marca?.nombre;

                // Si tiene marca poblada, mostrarla
                if (nombreMarca) {
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-text border border-input-border">
                            {nombreMarca}
                        </span>
                    );
                }

                // Buscar por código en la lista de marcas
                if (producto.codi_marca && actions.marcas) {
                    const marcaFound = actions.marcas.find((m: any) => m.codi_marca === producto.codi_marca);
                    nombreMarca = marcaFound?.nombre;
                    if (nombreMarca) {
                        return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-text border border-input-border">
                                {nombreMarca}
                            </span>
                        );
                    }
                }

                // Fallback: buscar por ID (legacy)
                if (producto.id_marca && actions.marcas) {
                    const marcaFound = actions.marcas.find((m: any) => m.id_marca === producto.id_marca);
                    nombreMarca = marcaFound?.nombre;
                    if (nombreMarca) {
                        return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-text border border-input-border">
                                {nombreMarca}
                            </span>
                        );
                    }
                }

                return <span className="text-gray-400">-</span>;
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
