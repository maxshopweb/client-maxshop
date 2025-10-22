import { useQuery } from '@tanstack/react-query';
import { marcaService } from '@/app/services/marca.service';

export function useMarcas() {
    return useQuery({
        queryKey: ['marcas'],
        queryFn: () => marcaService.getAll(),
        staleTime: 1000 * 60 * 10,
    });
}