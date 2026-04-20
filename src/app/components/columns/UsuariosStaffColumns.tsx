'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, KeyRound, UserX, UserCheck } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TableBadge } from '@/app/components/ui/TableBadge';
import type { IStaffUser } from '@/app/types/admin-staff.type';
import type { BadgeVariant } from '@/app/components/ui/Badge';

function rolVariant(rol: string | null): BadgeVariant {
  if (rol === 'ADMIN') return 'principal';
  if (rol === 'USER') return 'info';
  return 'neutral';
}

function estadoLabel(estado: number | null): string {
  if (estado === null || estado === undefined) return '—';
  if (estado === 1) return 'Pendiente';
  if (estado === 2) return 'Perfil incompleto';
  if (estado === 3) return 'Completo';
  return String(estado);
}

function estadoVariant(estado: number | null): BadgeVariant {
  if (estado === 3) return 'success';
  if (estado === 2) return 'principal';
  if (estado === 1) return 'neutral';
  return 'neutral';
}

export function getUsuariosStaffColumns(opts: {
  /** UID Firebase / id_usuario en BD */
  currentUserId: string | null;
  onResetPassword: (u: IStaffUser) => void;
  onToggleActivo: (u: IStaffUser, activo: boolean) => void;
}): ColumnDef<IStaffUser>[] {
  const { currentUserId, onResetPassword, onToggleActivo } = opts;

  return [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => {
        const u = row.original;
        return (
          <span className="font-medium text-input">
            {[u.nombre, u.apellido].filter(Boolean).join(' ') || '—'}
          </span>
        );
      }
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-sm text-input truncate max-w-[220px] block">
          {(getValue() as string) || '—'}
        </span>
      )
    },
    {
      accessorKey: 'username',
      header: 'Usuario',
      cell: ({ getValue }) => <span className="text-sm text-input">{(getValue() as string) || '—'}</span>
    },
    {
      accessorKey: 'rol',
      header: 'Rol',
      cell: ({ row }) => {
        const r = row.original.rol;
        if (!r) return <span className="text-gray-400">—</span>;
        return <TableBadge variant={rolVariant(r)}>{r}</TableBadge>;
      }
    },
    {
      accessorKey: 'estado',
      header: 'Estado cuenta',
      cell: ({ row }) => {
        const e = row.original.estado;
        return (
          <TableBadge variant={estadoVariant(e)}>{estadoLabel(e)}</TableBadge>
        );
      }
    },
    {
      accessorKey: 'activo',
      header: 'Activo',
      cell: ({ row }) => {
        const a = row.original.activo;
        return (
          <TableBadge variant={a === true ? 'success' : a === false ? 'error' : 'neutral'}>
            {a === true ? 'Sí' : a === false ? 'No' : '—'}
          </TableBadge>
        );
      }
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const u = row.original;
        const isSelf = currentUserId != null && u.id_usuario === currentUserId;

        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-input h-8 w-8 p-0 text-input"
                aria-label="Acciones"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-card rounded-md shadow-lg border border-card p-1 z-50"
                align="end"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input"
                  onSelect={() => onResetPassword(u)}
                >
                  <KeyRound className="mr-2 h-4 w-4 shrink-0" />
                  Reiniciar contraseña
                </DropdownMenu.Item>
                {u.activo !== false ? (
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input data-[disabled]:opacity-40"
                    disabled={isSelf}
                    onSelect={() => !isSelf && onToggleActivo(u, false)}
                  >
                    <UserX className="mr-2 h-4 w-4 shrink-0" />
                    Dar de baja
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-input rounded outline-none text-input"
                    onSelect={() => onToggleActivo(u, true)}
                  >
                    <UserCheck className="mr-2 h-4 w-4 shrink-0" />
                    Reactivar
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      }
    }
  ];
}
