'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bannersService } from '@/app/services/banners.service';
import { BANNERS_QUERY_KEY } from './useBanners';
import type { ICreateBannerDTO, IUpdateBannerDTO } from '@/app/types/banner.type';

function useInvalidateBanners() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
}

/** Crear slot de banner (sin imagen). */
export function useCreateBanner() {
  const invalidate = useInvalidateBanners();
  return useMutation({
    mutationFn: (dto: ICreateBannerDTO) => bannersService.createBanner(dto),
    onSuccess: () => {
      toast.success('Slot de banner creado');
      invalidate();
    },
    onError: (e: Error) => toast.error('Error al crear banner', { description: e.message }),
  });
}

/** Subir o reemplazar imagen de un banner. */
export function useUploadBannerImage() {
  const invalidate = useInvalidateBanners();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      bannersService.uploadBannerImage(id, file),
    onSuccess: () => {
      toast.success('Imagen cargada correctamente');
      invalidate();
    },
    onError: (e: Error) => toast.error('Error al subir imagen', { description: e.message }),
  });
}

/** Activar o desactivar un banner. */
export function useToggleBannerActivo() {
  const invalidate = useInvalidateBanners();
  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      bannersService.toggleBannerActivo(id, activo),
    onSuccess: (data) => {
      toast.success(data.activo ? 'Banner activado' : 'Banner desactivado');
      invalidate();
    },
    onError: (e: Error) => toast.error('Error', { description: e.message }),
  });
}

/** Actualizar orden o link de un banner. */
export function useUpdateBanner() {
  const invalidate = useInvalidateBanners();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: IUpdateBannerDTO }) =>
      bannersService.updateBanner(id, dto),
    onSuccess: () => {
      toast.success('Banner actualizado');
      invalidate();
    },
    onError: (e: Error) => toast.error('Error al actualizar', { description: e.message }),
  });
}

/** Eliminar banner (BD + archivo en disco). */
export function useDeleteBanner() {
  const invalidate = useInvalidateBanners();
  return useMutation({
    mutationFn: (id: number) => bannersService.deleteBanner(id),
    onSuccess: () => {
      toast.success('Banner eliminado');
      invalidate();
    },
    onError: (e: Error) => toast.error('Error al eliminar', { description: e.message }),
  });
}
