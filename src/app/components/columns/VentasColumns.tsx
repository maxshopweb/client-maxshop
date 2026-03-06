import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import type { IVenta } from '@/app/types/ventas.type';
import { formatPrecio, formatFecha } from '@/app/types/ventas.type';
import { TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import { TableBadge } from '@/app/components/ui/TableBadge';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';

interface VentasTableActions {
    onEdit: (venta: IVenta) => void;
    onDelete: (venta: IVenta) => void;
    onView: (venta: IVenta) => void;
    onUpdateEstadoPago?: (venta: IVenta) => void;
    onUpdateEstadoEnvio?: (venta: IVenta) => void;
}

export const getVentasColumns = (
    actions: VentasTableActions
): ColumnDef<IVenta>[] => [
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
            accessorKey: 'id_venta',
            header: 'Pedido',
            cell: ({ row }) => {
                const venta = row.original;
                const display = getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta);
                if (!display) return <span className="text-gray-400">-</span>;
                return (
                    <button
                        type="button"
                        onClick={() => actions.onView(venta)}
                        className="text-sm font-mono text-gray-600 font-semibold underline decoration-gray-400 hover:decoration-gray-600 cursor-pointer text-left"
                    >
                        {display}
                    </button>
                );
            },
        },
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            cell: ({ row }) => {
                const fecha = row.getValue('fecha') as Date | null;
                return (
                    <span className="text-sm text-text">
                        {formatFecha(fecha)}
                    </span>
                );
            },
        },
        {
            id: 'cliente',
            accessorKey: 'cliente',
            header: 'Cliente',
            cell: ({ row }) => {
                const venta = row.original;
                const cliente = venta.cliente;

                if (cliente?.usuario) {
                    const nombreCompleto = [cliente.usuario.nombre, cliente.usuario.apellido].filter(Boolean).join(' ') || 'Cliente';
                    return (
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => actions.onView(venta)}
                                className="text-sm font-medium text-text underline decoration-gray-400 hover:decoration-gray-600 cursor-pointer text-left"
                            >
                                {nombreCompleto}
                            </button>
                            {cliente.usuario.email && (
                                <span className="text-xs text-gray-400">{cliente.usuario.email}</span>
                            )}
                        </div>
                    );
                }

                return <span className="text-gray-400">-</span>;
            },
        },
        {
            accessorKey: 'total_neto',
            header: 'Total',
            cell: ({ row }) => {
                const total = row.getValue('total_neto') as number | null;
                return (
                    <span className="font-semibold text-text">
                        {formatPrecio(total)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'metodo_pago',
            header: 'Método de pago',
            cell: ({ row }) => {
                const metodo = row.getValue('metodo_pago') as string | null;
                return <TableBadge kind="metodo_pago" value={metodo} />;
            },
        },
        {
            accessorKey: 'estado_pago',
            header: 'Estado pago',
            cell: ({ row }) => {
                const estado = row.getValue('estado_pago') as string | null;
                return <TableBadge kind="estado_pago" value={estado} />;
            },
        },
        {
            accessorKey: 'estado_envio',
            header: 'Estado envío',
            cell: ({ row }) => {
                const estado = row.getValue('estado_envio') as string | null;
                return <TableBadge kind="estado_envio" value={estado} />;
            },
        },
        {
            accessorKey: 'tipo_venta',
            header: 'Tipo',
            cell: ({ row }) => {
                const tipo = row.getValue('tipo_venta') as string | null;
                const option = TIPO_VENTA_OPTIONS.find(opt => opt.value === tipo);
                return (
                    <span className="text-sm text-text">
                        {option?.label || tipo || '-'}
                    </span>
                );
            },
        },
        {
            id: 'detalles_count',
            header: 'Productos',
            cell: ({ row }) => {
                const detalles = row.original.detalles || [];
                return (
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-text">{detalles.length}</span>
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const venta = row.original;

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
                                    onClick={() => actions.onView(venta)}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                    onClick={() => actions.onEdit(venta)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="h-px bg-[var(--card-border)] my-1" />

                                <DropdownMenu.Item
                                    disabled={venta.estado_pago === 'cancelado'}
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-red-500/10 rounded outline-none text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    onClick={() => venta.estado_pago !== 'cancelado' && actions.onDelete(venta)}
                                    title={venta.estado_pago === 'cancelado' ? 'La venta ya está dada de baja' : undefined}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {venta.estado_pago === 'cancelado' ? 'Ya dada de baja' : 'Dar de baja'}
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
    'cliente': true,
    'metodo_pago': true,
    'tipo_venta': true,
    'detalles_count': true,
};

export const defaultColumnOrder = [
    'select',
    'id_venta',
    'fecha',
    'cliente',
    'total_neto',
    'metodo_pago',
    'estado_pago',
    'estado_envio',
    'tipo_venta',
    'detalles_count',
    'actions',
];

