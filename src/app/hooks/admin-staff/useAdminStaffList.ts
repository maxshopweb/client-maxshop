'use client';

import { useQuery } from '@tanstack/react-query';
import { adminStaffService } from '@/app/services/admin-staff.service';
import type { IStaffListParams } from '@/app/types/admin-staff.type';
import { adminStaffKeys } from './adminStaffKeys';

export type UseAdminStaffListOptions = {
  filters: IStaffListParams;
  enabled?: boolean;
};

export function useAdminStaffList(options: UseAdminStaffListOptions) {
  const { filters, enabled = true } = options;

  return useQuery({
    queryKey: adminStaffKeys.list(filters),
    queryFn: () => adminStaffService.list(filters),
    enabled,
    staleTime: 0,
    placeholderData: (previousData) => previousData
  });
}
