import { useQuery } from '@tanstack/react-query';
import { grupoService } from '@/app/services/grupo.service';

export function useGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: () => grupoService.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnMount: false, // No refetchear si hay datos en caché
    refetchOnWindowFocus: false, // No refetchear al enfocar ventana
  });
}

