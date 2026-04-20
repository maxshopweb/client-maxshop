'use client';

import { useQuery } from '@tanstack/react-query';
import { adminStaffService } from '@/app/services/admin-staff.service';
import { adminStaffKeys } from './adminStaffKeys';

export type UseAdminStaffDetailOptions = {
  idUsuario: string | null | undefined;
  enabled?: boolean;
};

export function useAdminStaffDetail(options: UseAdminStaffDetailOptions) {
  const { idUsuario, enabled = true } = options;
  const id = idUsuario?.trim() ?? '';

  return useQuery({
    queryKey: adminStaffKeys.detail(id),
    queryFn: () => adminStaffService.getById(id),
    enabled: enabled && id.length > 0,
    staleTime: 0
  });
}
