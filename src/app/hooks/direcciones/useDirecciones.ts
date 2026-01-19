import { useQuery } from '@tanstack/react-query';
import { direccionesService, type IDireccion } from '@/app/services/direcciones.service';

export const direccionesKeys = {
  all: ['direcciones'] as const,
  lists: () => [...direccionesKeys.all, 'list'] as const,
  list: (filters: string) => [...direccionesKeys.lists(), { filters }] as const,
  details: () => [...direccionesKeys.all, 'detail'] as const,
  detail: (id: string) => [...direccionesKeys.details(), id] as const,
};

export function useDirecciones() {
  const { data: direcciones = [], isLoading, error, refetch } = useQuery<IDireccion[]>({
    queryKey: direccionesKeys.lists(),
    queryFn: () => direccionesService.getAll(),
  });

  return {
    direcciones,
    isLoading,
    error,
    refetch,
  };
}

