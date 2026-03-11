'use client';

import { Package } from 'lucide-react';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';
import { Switch } from '@/app/components/ui/Switch';
import type { IListaPrecio } from '@/app/types/producto.type';
import { useToggleListaPrecioActivo } from '@/app/hooks/listas-precio/useToggleListaPrecioActivo';

interface ListasPrecioTableProps {
  listas: IListaPrecio[];
  isLoading?: boolean;
}

export function ListasPrecioTable({ listas, isLoading }: ListasPrecioTableProps) {
  const toggleActivo = useToggleListaPrecioActivo();

  if (isLoading) {
    return <TableSkeleton columnCount={8} rowCount={6} />;
  }

  if (!listas.length) {
    return (
      <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No hay listas de precio
          </div>
          <div className="text-gray-500 text-sm">
            Las listas se cargan desde la sincronización CSV.
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Forma pago
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Activo lista
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                % Desc.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                % Desc. M
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Activo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listas.map((lista) => {
              const isPending = toggleActivo.isPending && toggleActivo.variables?.id === lista.id_lista;
              return (
                <tr key={lista.id_lista} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-text">
                    {lista.codi_lista}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {lista.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text">
                    {lista.codi_forma_pago ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {lista.activo_lista ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-text tabular-nums">
                    {lista.porc_descuento != null ? `${Number(lista.porc_descuento).toFixed(2)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-text tabular-nums">
                    {lista.porc_descuento_m != null ? `${Number(lista.porc_descuento_m).toFixed(2)}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={lista.activo ?? false}
                      onCheckedChange={() => toggleActivo.mutate({
                        id: lista.id_lista,
                        activo: !lista.activo,
                      })}
                      disabled={isPending}
                      aria-label={lista.nombre ? `Activo: ${lista.nombre}` : `Lista ${lista.codi_lista}`}
                    />
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
