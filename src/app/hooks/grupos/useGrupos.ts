import { useQuery } from '@tanstack/react-query';
import { grupoService } from '@/app/services/grupo.service';
import type { IGrupoResponse } from '@/app/types/grupo.type';

interface UseGruposOptions {
  initialData?: IGrupoResponse;
}

export function useGrupos(options: UseGruposOptions = {}) {
  const { initialData } = options;

  return useQuery({
    queryKey: ['grupos'],
    queryFn: () => grupoService.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...(initialData && {
      initialData,
      initialDataUpdatedAt: Date.now(),
    }),
  });
}

