import { useQuery } from '@tanstack/react-query';
import { categoriaService } from '@/app/services/categoria.service';

export function useCategorias() {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: () => categoriaService.getAll(),
        staleTime: 1000 * 60 * 10, // 10 minutos
        refetchOnMount: false, // No refetchear si hay datos en caché
        refetchOnWindowFocus: false, // No refetchear al enfocar ventana
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