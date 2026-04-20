'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { UserCog } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import type { IStaffUser } from '@/app/types/admin-staff.type';
import { getUsuariosStaffColumns } from '@/app/components/columns/UsuariosStaffColumns';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';

type UsuariosStaffTableProps = {
  rows: IStaffUser[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onResetPassword: (u: IStaffUser) => void;
  onToggleActivo: (u: IStaffUser, activo: boolean) => void;
};

export function UsuariosStaffTable({
  rows,
  isLoading,
  isError,
  error,
  onResetPassword,
  onToggleActivo
}: UsuariosStaffTableProps) {
  const { user } = useAuth();

  const columns = useMemo(
    () =>
      getUsuariosStaffColumns({
        currentUserId: user?.uid ?? null,
        onResetPassword,
        onToggleActivo
      }),
    [user?.uid, onResetPassword, onToggleActivo]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id_usuario
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-600 text-lg font-semibold mb-2">Error al cargar usuarios</div>
        <div className="text-gray-600 text-sm">{error?.message || 'Intentá de nuevo.'}</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-card border border-card rounded-lg">
        <UserCog className="w-16 h-16 text-gray-300 mb-4" />
        <div className="text-gray-600 text-lg font-semibold mb-2">No hay usuarios de panel</div>
        <p className="text-gray-500 text-sm text-center max-w-md">
          No hay resultados con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-card bg-input/30">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 font-semibold text-input whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-card/80 hover:bg-input/20 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle text-input">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
