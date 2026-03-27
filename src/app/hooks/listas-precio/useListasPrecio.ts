'use client';

import { useQuery } from '@tanstack/react-query';
import { listaPrecioService } from '@/app/services/lista-precio.service';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { IListaPrecio } from '@/app/types/producto.type';

export const listasPrecioKeys = {
  all: ['listas-precio'] as const,
  list: (activoOnly: boolean) => [...listasPrecioKeys.all, activoOnly] as const,
  listPaginated: (activoOnly: boolean, page: number, limit: number, busqueda: string) =>
    [...listasPrecioKeys.all, 'admin', activoOnly, page, limit, busqueda] as const,
};

export interface UseListasPrecioAdminParams {
  page: number;
  limit: number;
  busqueda?: string;
}

/** Para admin Utilidades paginado: pasar admin. Para selectores / catálogo completo: solo activoOnly. */
type ListasPrecioQueryData = IListaPrecio[] | PaginatedListResponse<IListaPrecio>;

export function useListasPrecio(
  activoOnly: boolean = false,
  admin?: UseListasPrecioAdminParams,
  options?: { enabled?: boolean; initialPaginated?: PaginatedListResponse<IListaPrecio> }
) {
  const enabled = options?.enabled ?? true;
  const adminMode = !!admin;
  const initialPaginated = options?.initialPaginated;

  const query = useQuery<ListasPrecioQueryData>({
    queryKey: adminMode
      ? listasPrecioKeys.listPaginated(
          activoOnly,
          admin!.page,
          admin!.limit,
          admin!.busqueda ?? ''
        )
      : listasPrecioKeys.list(activoOnly),
    queryFn: async (): Promise<ListasPrecioQueryData> =>
      adminMode
        ? listaPrecioService.getPaginated({
            activoOnly,
            page: admin!.page,
            limit: admin!.limit,
            busqueda: admin!.busqueda,
          })
        : listaPrecioService.getAll(activoOnly),
    staleTime: adminMode ? 1000 * 60 : 1000 * 60 * 5,
    enabled,
    ...(adminMode && initialPaginated && {
      initialData: initialPaginated,
      initialDataUpdatedAt: Date.now(),
    }),
  });

  const paginated =
    adminMode && query.data && typeof query.data === 'object' && 'pagination' in query.data
      ? (query.data as PaginatedListResponse<IListaPrecio>)
      : undefined;

  return {
    listas: adminMode
      ? (paginated?.data ?? [])
      : (Array.isArray(query.data) ? query.data : []),
    pagination: adminMode ? paginated?.pagination : undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
