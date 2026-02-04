import { useQuery } from '@tanstack/react-query';
import { marcaService } from '@/app/services/marca.service';

export function useMarcas() {
    return useQuery({
        queryKey: ['marcas'],
        queryFn: () => marcaService.getAll(),
        staleTime: 1000 * 60 * 10, // 10 minutos
        refetchOnMount: false, // No refetchear si hay datos en caché
        refetchOnWindowFocus: false, // No refetchear al enfocar ventana
    });
}