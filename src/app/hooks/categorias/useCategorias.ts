import { useQuery } from '@tanstack/react-query';
import { categoriaService } from '@/app/services/categoria.service';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { ICategoria } from '@/app/types/categoria.type';

interface CategoriasApiResponse {
    success: boolean;
    data: ICategoria[];
    message?: string;
}

type CategoriasQueryData = CategoriasApiResponse | PaginatedListResponse<ICategoria>;

interface UseCategoriasOptions {
    initialData?: CategoriasApiResponse;
    adminList?: { page: number; limit: number; busqueda: string };
    initialPaginated?: PaginatedListResponse<ICategoria>;
    enabled?: boolean;
    activeOnly?: boolean;
}

export function useCategorias(options: UseCategoriasOptions = {}) {
    const { initialData, adminList, initialPaginated, enabled = true, activeOnly = false } = options;
    const adminMode = !!adminList;

    return useQuery<CategoriasQueryData>({
        queryKey: adminMode
            ? (['categorias', 'admin', adminList!.page, adminList!.limit, adminList!.busqueda] as const)
            : activeOnly
                ? (['categorias', 'active'] as const)
                : (['categorias'] as const),
        queryFn: async (): Promise<CategoriasQueryData> =>
            adminMode
                ? categoriaService.getPaginated(adminList!)
                : activeOnly
                    ? categoriaService.getActive() as Promise<CategoriasQueryData>
                    : categoriaService.getAll() as Promise<CategoriasQueryData>,
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

export function useSubcategorias(idCat?: number) {
    return useQuery({
        queryKey: ['subcategorias', idCat],
        queryFn: () => categoriaService.getSubCategoriesByCategory(idCat!),
        enabled: !!idCat,
        staleTime: 1000 * 60 * 10, // 10 minutos
        refetchOnMount: false, // No refetchear si hay datos en caché
        refetchOnWindowFocus: false, // No refetchear al enfocar ventana
    });
}