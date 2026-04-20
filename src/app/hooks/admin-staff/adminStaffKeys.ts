import type { IStaffListParams } from '@/app/types/admin-staff.type';

export const adminStaffKeys = {
  all: ['admin-staff'] as const,
  lists: () => [...adminStaffKeys.all, 'list'] as const,
  list: (params: IStaffListParams) => [...adminStaffKeys.lists(), params] as const,
  details: () => [...adminStaffKeys.all, 'detail'] as const,
  detail: (idUsuario: string) => [...adminStaffKeys.details(), idUsuario] as const
};
