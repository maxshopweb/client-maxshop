'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminStaffService } from '@/app/services/admin-staff.service';
import type { IStaffCreateInput, IStaffUpdateInput } from '@/app/types/admin-staff.type';
import { adminStaffKeys } from './adminStaffKeys';

export function useAdminStaffMutations() {
  const queryClient = useQueryClient();

  const revalidateAllStaff = async () => {
    await queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
  };

  const createStaff = useMutation({
    mutationFn: (input: IStaffCreateInput) => adminStaffService.create(input),
    onSuccess: async () => {
      await revalidateAllStaff();
    }
  });

  const updateStaff = useMutation({
    mutationFn: ({ idUsuario, input }: { idUsuario: string; input: IStaffUpdateInput }) =>
      adminStaffService.update(idUsuario, input),
    onSuccess: async () => {
      await revalidateAllStaff();
    }
  });

  const resetPassword = useMutation({
    mutationFn: (idUsuario: string) => adminStaffService.resetPassword(idUsuario),
    onSuccess: async () => {
      await revalidateAllStaff();
    }
  });

  const setActive = useMutation({
    mutationFn: ({ idUsuario, activo }: { idUsuario: string; activo: boolean }) =>
      adminStaffService.setActive(idUsuario, activo),
    onSuccess: async () => {
      await revalidateAllStaff();
    }
  });

  return {
    createStaff,
    updateStaff,
    resetPassword,
    setActive,
    revalidateAllStaff
  };
}
