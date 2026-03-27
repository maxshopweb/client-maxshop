import { useQuery } from '@tanstack/react-query';
import { grupoService } from '@/app/services/grupo.service';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { IGrupo, IGrupoResponse } from '@/app/types/grupo.type';

type GruposQueryData = IGrupoResponse | PaginatedListResponse<IGrupo>;

interface UseGruposOptions {
  initialData?: IGrupoResponse;
  adminList?: { page: number; limit: number; busqueda: string };
  initialPaginated?: PaginatedListResponse<IGrupo>;
  enabled?: boolean;
}

export function useGrupos(options: UseGruposOptions = {}) {
  const { initialData, adminList, initialPaginated, enabled = true } = options;
  const adminMode = !!adminList;

  return useQuery<GruposQueryData>({
    queryKey: adminMode
      ? (['grupos', 'admin', adminList!.page, adminList!.limit, adminList!.busqueda] as const)
      : (['grupos'] as const),
    queryFn: async (): Promise<GruposQueryData> =>
      adminMode
        ? grupoService.getPaginated(adminList!)
        : grupoService.getAll(),
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

