import { useQuery } from '@tanstack/react-query';
import { marcaService } from '@/app/services/marca.service';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { IMarca, MarcaResponse } from '@/app/types/marca.type';

type MarcasQueryData = MarcaResponse | PaginatedListResponse<IMarca>;

interface UseMarcasOptions {
    initialData?: MarcaResponse;
    /** Admin Utilidades: lista paginada (no usar junto con initialData de catálogo completo). */
    adminList?: { page: number; limit: number; busqueda: string };
    initialPaginated?: PaginatedListResponse<IMarca>;
    enabled?: boolean;
}

export function useMarcas(options: UseMarcasOptions = {}) {
    const { initialData, adminList, initialPaginated, enabled = true } = options;
    const adminMode = !!adminList;

    return useQuery<MarcasQueryData>({
        queryKey: adminMode
            ? (['marcas', 'admin', adminList!.page, adminList!.limit, adminList!.busqueda] as const)
            : (['marcas'] as const),
        queryFn: async (): Promise<MarcasQueryData> =>
            adminMode
                ? marcaService.getPaginated(adminList!)
                : marcaService.getAll(),
        staleTime: adminMode ? 1000 * 60 : 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled,
        ...(adminMode && initialPaginated && {
            initialData: initialPaginated,
            initialDataUpdatedAt: Date.now(),
        }),
        ...(!adminMode && initialData && {
            initialData,
            initialDataUpdatedAt: Date.now(),
        }),
    });
}