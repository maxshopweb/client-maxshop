'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { getMaestroCodigo, getMaestroNombre, getMaestroDescripcion, getMaestroActivo, getMaestroId } from '@/app/types/maestro.type';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';
import { Package } from 'lucide-react';
import { Switch } from '@/app/components/ui/Switch';

interface MaestrosTableProps {
  kind: MaestroKind;
  items: MaestroItem[];
  isLoading?: boolean;
  onEdit: (item: MaestroItem) => void;
  onDelete: (item: MaestroItem) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
}

const HEADERS: Record<MaestroKind, string> = {
  marca: 'Código',
  categoria: 'Código',
  grupo: 'Código',
};

/** Checkboxes de selección por fila: ocultos temporalmente */
const SHOW_ROW_SELECTION_CHECKBOX = false;

export function MaestrosTable({
  kind,
  items,
  isLoading,
  onEdit,
  onDelete,
  onToggleActivo,
  selectedIds = [],
  onSelectionChange,
}: MaestrosTableProps) {
  const [localSelected, setLocalSelected] = useState<number[]>(selectedIds);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = items.map((item) => getMaestroId(item, kind));
      setLocalSelected(allIds);
      onSelectionChange?.(allIds);
    } else {
      setLocalSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    let newSelected: number[];
    if (checked) {
      newSelected = [...localSelected, id];
    } else {
      newSelected = localSelected.filter((sid) => sid !== id);
    }
    setLocalSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isAllSelected = items.length > 0 && localSelected.length === items.length;

  const selectionCol =
    onSelectionChange && SHOW_ROW_SELECTION_CHECKBOX ? 1 : 0;
  const tableColumnCount = 5 + selectionCol;

  if (isLoading) {
    return <TableSkeleton columnCount={tableColumnCount} rowCount={6} />;
  }

  if (!items.length) {
    return (
      <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No hay registros
          </div>
          <div className="text-gray-500 text-sm">
            Creá uno con el botón &quot;Crear&quot;.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {onSelectionChange && SHOW_ROW_SELECTION_CHECKBOX && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-principal focus:ring-principal"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {HEADERS[kind]}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const id = getMaestroId(item, kind);
              const isActive = getMaestroActivo(item);
              return (
                <tr key={getMaestroCodigo(item, kind)} className="hover:bg-gray-50 transition-colors">
                  {onSelectionChange && SHOW_ROW_SELECTION_CHECKBOX && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={localSelected.includes(id)}
                        onChange={(e) => handleSelectItem(id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-principal focus:ring-principal"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm font-mono text-text">
                    {getMaestroCodigo(item, kind)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {getMaestroNombre(item) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text max-w-xs truncate">
                    {getMaestroDescripcion(item) ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => onToggleActivo(id, checked)}
                      aria-label={`${isActive ? 'Deshabilitar' : 'Habilitar'} ${getMaestroNombre(item) ?? 'item'}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-principal transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
