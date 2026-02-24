'use client';

import { useQuery } from '@tanstack/react-query';
import { bannersService } from '@/app/services/banners.service';
import type { BannerTipo } from '@/app/types/banner.type';

export const BANNERS_QUERY_KEY = 'banners';

/** Hook para el panel admin: trae todos los banners (activos e inactivos). */
export function useBannersAdmin(tipo?: BannerTipo) {
  return useQuery({
    queryKey: [BANNERS_QUERY_KEY, 'admin', tipo ?? 'all'],
    queryFn: () => bannersService.getAdminBanners(tipo),
    staleTime: 1000 * 30,
  });
}

/** Hook público: solo banners activos con imagen. */
export function useBannersPublic(tipo?: BannerTipo) {
  return useQuery({
    queryKey: [BANNERS_QUERY_KEY, 'public', tipo ?? 'all'],
    queryFn: () => bannersService.getPublicBanners(tipo),
    staleTime: 1000 * 60,
  });
}
