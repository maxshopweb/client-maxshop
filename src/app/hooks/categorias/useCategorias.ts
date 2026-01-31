import { useQuery } from '@tanstack/react-query';
import { categoriaService } from '@/app/services/categoria.service';

interface CategoriasApiResponse {
    success: boolean;
    data: import('@/app/types/categoria.type').ICategoria[];
    message?: string;
}

interface UseCategoriasOptions {
    initialData?: CategoriasApiResponse;
}

export function useCategorias(options: UseCategoriasOptions = {}) {
    const { initialData } = options;

    return useQuery({
        queryKey: ['categorias'],
        queryFn: () => categoriaService.getAll(),
        staleTime: 1000 * 60 * 10, // 10 minutos
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...(initialData && {
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