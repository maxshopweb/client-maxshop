import { useQuery } from '@tanstack/react-query';
import { marcaService } from '@/app/services/marca.service';
import type { MarcaResponse } from '@/app/types/marca.type';

interface UseMarcasOptions {
    initialData?: MarcaResponse;
}

export function useMarcas(options: UseMarcasOptions = {}) {
    const { initialData } = options;

    return useQuery({
        queryKey: ['marcas'],
        queryFn: () => marcaService.getAll(),
        staleTime: 1000 * 60 * 10, // 10 minutos
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...(initialData && {
            initialData,
            initialDataUpdatedAt: Date.now(),
        }),
    });
}