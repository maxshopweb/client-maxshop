'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadService } from '@/app/services/upload.service';
import { productosKeys } from '@/app/hooks/productos/useProductos';
import type { UploadResult } from '@/app/types/upload.type';

export interface UseUploadProductImageOptions {
  onSuccess?: (data: UploadResult) => void;
  onError?: (error: Error) => void;
}

export function useUploadProductImage(options: UseUploadProductImageOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ idProd, file }: { idProd: number; file: File }) =>
      uploadService.uploadProductImage(idProd, file),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productosKeys.detail(variables.idProd),
      });
      queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });
      queryClient.invalidateQueries({ queryKey: productosKeys.stockBajo() });

      toast.success('Imagen del producto subida correctamente', {
        description: 'La imagen principal fue actualizada.',
      });

      options.onSuccess?.(data);
    },

    onError: (error: Error) => {
      const message =
        error.message ||
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Error al subir la imagen.';
      toast.error('Error al subir imagen', { description: message });
      options.onError?.(error);
    },
  });

  return {
    uploadProductImage: mutation.mutate,
    uploadProductImageAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
