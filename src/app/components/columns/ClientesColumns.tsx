"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Button } from "@/app/components/ui/Button";
import { ArrowUpDown, MoreHorizontal, Eye, ExternalLink, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ICliente } from "@/app/types/cliente.type";
import { getClienteNombreCompleto, getClienteEmail, formatFecha } from "@/app/types/cliente.type";
import { TableBadge } from "@/app/components/ui/TableBadge";
import type { BadgeVariant } from "@/app/components/ui/Badge";
import Link from "next/link";

export const createClientesColumns = (
    onView?: (cliente: ICliente) => void,
    isAllSelected?: boolean,
    onSelectAll?: (checked: boolean) => void,
    selectedCount?: number
): ColumnDef<ICliente>[] => [
    // Columna de selección
    {
        id: "select",
        header: () => (
            <Checkbox.Root
                checked={isAllSelected || false}
                onCheckedChange={(value) => {
                    onSelectAll?.(value === true);
                }}
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
                onCheckedChange={(value) => {
                    row.toggleSelected(value === true);
                }}
                className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            >
                <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-white" />
                </Checkbox.Indicator>
            </Checkbox.Root>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    // ID Usuario
    {
        accessorKey: "id_usuario",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const id = row.getValue("id_usuario") as string;
            return (
                <div className="font-medium text-sm">
                    {id.substring(0, 8)}...
                </div>
            );
        },
        size: 120,
    },
    // Nombre
    {
        accessorFn: (row) => getClienteNombreCompleto(row),
        id: "nombre",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const cliente = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">
                        {getClienteNombreCompleto(cliente)}
                    </span>
                    {cliente.usuario?.username && (
                        <span className="text-xs text-gray-500">
                            @{cliente.usuario.username}
                        </span>
                    )}
                </div>
            );
        },
        size: 200,
    },
    // Email
    {
        accessorFn: (row) => getClienteEmail(row),
        id: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const email = getClienteEmail(row.original);
            return (
                <div className="text-sm">
                    {email}
                </div>
            );
        },
        size: 200,
    },
    // Teléfono
    {
        accessorKey: "usuario.telefono",
        header: "Teléfono",
        cell: ({ row }) => {
            const telefono = row.original.usuario?.telefono || "-";
            return <div className="text-sm">{telefono}</div>;
        },
        size: 120,
    },
    // DNI
    {
        id: "dni",
        header: "DNI",
        cell: ({ row }) => {
            const u = row.original.usuario;
            const tipo = u?.tipo_documento;
            const num = u?.numero_documento;
            if (!num) return <div className="text-sm text-gray-400">-</div>;
            return (
                <div className="text-sm">
                    {tipo ? `${tipo} ` : ""}{num}
                </div>
            );
        },
        size: 140,
    },
    // Domicilio
    {
        id: "domicilio",
        header: "Domicilio",
        cell: ({ row }) => {
            const c = row.original;
            const parts: string[] = [];
            if (c.direccion) parts.push(c.direccion);
            if (c.altura) parts.push(c.altura);
            if (parts.length === 0 && c.ciudad) parts.push(c.ciudad);
            if (c.provincia) parts.push(c.provincia);
            const line = parts.join(", ") || "-";
            return (
                <div className="text-sm max-w-[200px] truncate" title={line}>
                    {line}
                </div>
            );
        },
        size: 200,
    },
    // Fecha de Registro
    {
        accessorKey: "usuario.creado_en",
        id: "creado_en",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Registro
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const fecha = row.original.usuario?.creado_en;
            return (
                <div className="text-sm">
                    {formatFecha(fecha)}
                </div>
            );
        },
        size: 150,
    },
    // Estado
    {
        accessorKey: "usuario.estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.original.usuario?.estado;
            const estadoConfig: Record<number, { label: string; variant: BadgeVariant }> = {
                1: { label: "Activo", variant: "success" },
                2: { label: "Inactivo", variant: "warning" },
                0: { label: "Eliminado", variant: "error" },
            };
            const config = estadoConfig[estado ?? 0] ?? { label: "Desconocido", variant: "neutral" as BadgeVariant };
            return (
                <TableBadge variant={config.variant}>
                    {config.label}
                </TableBadge>
            );
        },
        size: 100,
    },
    // Acciones
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const cliente = row.original;

            return (
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-input h-8 w-8 p-0 text-input">
                            <span className="sr-only">Abrir menú</span>
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
                                asChild
                            >
                                <Link href={`/admin/clientes/${cliente.id_usuario}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Perfil
                                </Link>
                            </DropdownMenu.Item>
                            {cliente.ventas && cliente.ventas.length > 0 && (
                                <DropdownMenu.Item
                                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input transition-colors"
                                    asChild
                                >
                                    <Link href={`/admin/ventas?cliente=${cliente.id_usuario}`}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Ver Ventas
                                    </Link>
                                </DropdownMenu.Item>
                            )}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 80,
    },
];

