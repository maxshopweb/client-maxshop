import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2, Star, ImageIcon, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Switch } from '@/app/components/ui/Switch';
import { Check } from 'lucide-react';
import type { IProductos } from '@/app/types/producto.type';
import { formatearPrecio, getStockInfo } from '@/app/utils/producto.utils';
import { TableBadge } from '@/app/components/ui/TableBadge';
import type { BadgeVariant } from '@/app/components/ui/Badge';
import ProductImage from '../shared/ProductImage';

interface ProductosTableActions {
    onEdit: (producto: IProductos) => void;
    onDelete: (producto: IProductos) => void;
    onToggleDestacado: (producto: IProductos) => void;
    onTogglePublicado: (producto: IProductos) => void;
    onToggleCuotas?: (producto: IProductos) => void;
    onUpdateStock: (producto: IProductos) => void;
    onCambiarImagen?: (producto: IProductos) => void;
    onReanudarSyncErp?: (producto: IProductos) => void;
    onActualizarDesdeErp?: (producto: IProductos) => void;
    categorias?: any[];
    marcas?: any[];
    grupos?: any[];
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

                const manual = row.original.precio_editado_manualmente === true;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                            <Link
                                href={`/tienda/productos/${row.original.id_prod}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-text hover:underline text-(--principal)"
                            >
                                {nombre}
                            </Link>
                            {manual && (
                                <TableBadge variant="warning" className="shrink-0">
                                    Manual
                                </TableBadge>
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
            accessorKey: 'modelo',
            header: 'Modelo',
            cell: ({ row }) => {
                const modelo = row.original.modelo?.trim();
                return (
                    <span className="text-sm text-gray-600">
                        {modelo || '—'}
                    </span>
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
            id: 'grupo',
            accessorKey: 'codi_grupo',
            header: 'Grupo',
            cell: ({ row }) => {
                const producto = row.original;
                const grupo = producto.grupo;
                let nombreGrupo = grupo?.nombre;

                if (nombreGrupo) {
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{nombreGrupo}</span>
                            {grupo?.codi_grupo && (
                                <span className="text-xs text-gray-400">Cód: {grupo.codi_grupo}</span>
                            )}
                        </div>
                    );
                }

                if (producto.codi_grupo && actions.grupos) {
                    const g = actions.grupos.find((gr: any) => gr.codi_grupo === producto.codi_grupo);
                    if (g?.nombre) {
                        return (
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">{g.nombre}</span>
                                {producto.codi_grupo && (
                                    <span className="text-xs text-gray-400">Cód: {producto.codi_grupo}</span>
                                )}
                            </div>
                        );
                    }
                }

                return producto.codi_grupo ? (
                    <span className="text-sm text-gray-600">{producto.codi_grupo}</span>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            },
        },
        {
            id: 'financiacion',
            accessorKey: 'cuotas_habilitadas',
            header: 'Financiación',
            cell: ({ row }) => {
                const producto = row.original;
                const v = producto.cuotas_habilitadas;
                const checked = v === true;

                if (actions.onToggleCuotas) {
                    return (
                        <Switch
                            checked={checked}
                            onCheckedChange={() => actions.onToggleCuotas?.(producto)}
                            aria-label="Financiación"
                        />
                    );
                }
                return checked ? <TableBadge variant="success">Sí</TableBadge> : <TableBadge variant="neutral">No</TableBadge>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'precio',
            header: 'Precio',
            cell: ({ row }) => {
                const producto = row.original;
                const precio = row.getValue('precio') as number | null;
                const ref = producto.precio_venta_referencia;
                const mostrarTachado = ref != null && precio != null && ref > precio;
                const porcentajeOff =
                    mostrarTachado && ref != null && ref > 0 && precio != null
                        ? Math.round((1 - precio / ref) * 100)
                        : 0;
                const esListaE = producto.lista_precio_activa === 'E' || producto.lista_activa?.codi_lista === 'E';
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-semibold text-text">
                                {formatearPrecio(precio)}
                            </span>
                            {mostrarTachado && (
                                <>
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatearPrecio(ref)}
                                    </span>
                                    {porcentajeOff > 0 && (
                                        <span className="text-xs font-semibold text-amber-600">
                                            {porcentajeOff}% OFF
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        {esListaE && (
                            <span className="text-xs text-muted-foreground">Lista E — Precio especial</span>
                        )}
                    </div>
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
                    <div className="inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockInfo.color}`}>
                            {stockInfo.cantidad} u
                        </span>
                        {stockInfo.status === 'stock_bajo' && (
                            <span className="text-xs text-yellow-600" title="Stock bajo">⚠</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const estado = row.getValue('estado') as 0 | 1 | 2 | 3 | undefined;
                const estadoConfig: Record<number, { label: string; variant: BadgeVariant }> = {
                    1: { label: 'Activo', variant: 'success' },
                    2: { label: 'Inactivo', variant: 'warning' },
                    3: { label: 'Pausado', variant: 'neutral' },
                    0: { label: 'Eliminado', variant: 'error' },
                };
                const config = estadoConfig[estado ?? 2] ?? { label: 'Inactivo', variant: 'warning' as BadgeVariant };
                return (
                    <TableBadge variant={config.variant}>
                        {config.label}
                    </TableBadge>
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
            accessorKey: 'publicado',
            header: 'Publicado',
            cell: ({ row }) => {
                const publicado = row.getValue('publicado') as boolean | null | undefined;
                const producto = row.original;
                const checked = publicado ?? false;

                return (
                    <Switch
                        checked={checked}
                        onCheckedChange={() => actions.onTogglePublicado(producto)}
                        aria-label="Publicado"
                    />
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

                                {actions.onCambiarImagen && (
                                    <DropdownMenu.Item
                                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                        onClick={() => actions.onCambiarImagen?.(producto)}
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Cambiar imagen
                                    </DropdownMenu.Item>
                                )}

                                {actions.onActualizarDesdeErp && (
                                    <DropdownMenu.Item
                                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                        onClick={() => actions.onActualizarDesdeErp?.(producto)}
                                    >
                                        <Download className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="leading-tight">Actualizar este producto desde FTP</span>
                                    </DropdownMenu.Item>
                                )}

                                {actions.onReanudarSyncErp && (
                                    <DropdownMenu.Item
                                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                        onClick={() => actions.onReanudarSyncErp?.(producto)}
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="leading-tight">Próxima sync FTP</span>
                                    </DropdownMenu.Item>
                                )}

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

                                <DropdownMenu.Separator className="h-px bg-(--card-border) my-1" />

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
    grupo: true,
    destacado: true,
    financiacion: true,
    publicado: true,
    estado: true,
};

export const defaultColumnOrder = [
    'select',
    'img_principal',
    'nombre',
    'modelo',
    'categoria',
    'marca',
    'grupo',
    'precio',
    'stock',
    'estado',
    'destacado',
    'financiacion',
    'publicado',
    'actions',
];
