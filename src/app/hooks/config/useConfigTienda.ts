import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configTiendaService } from '@/app/services/config-tienda.service';
import type { IConfigTienda } from '@/app/types/config-tienda.type';

export const CONFIG_TIENDA_QUERY_KEY = ['config', 'tienda'] as const;

const STALE_TIME_MS = 1000 * 60 * 10; // 10 min – cambia muy poco

export function useConfigTienda() {
  return useQuery({
    queryKey: CONFIG_TIENDA_QUERY_KEY,
    queryFn: async () => {
      const { data } = await configTiendaService.getConfig();
      return data;
    },
    staleTime: STALE_TIME_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useConfigTiendaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IConfigTienda>) => configTiendaService.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_TIENDA_QUERY_KEY });
    },
  });
}
