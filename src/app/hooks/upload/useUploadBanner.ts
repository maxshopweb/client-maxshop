'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadService } from '@/app/services/upload.service';
import type { UploadResult } from '@/app/types/upload.type';

export interface UseUploadBannerOptions {
  onSuccess?: (data: UploadResult) => void;
  onError?: (error: Error) => void;
}

export function useUploadBanner(options: UseUploadBannerOptions = {}) {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadService.uploadBanner(file),

    onSuccess: (data) => {
      toast.success('Banner subido correctamente', {
        description: `Guardado como ${data.path}`,
      });
      options.onSuccess?.(data);
    },

    onError: (error: Error) => {
      const message =
        error.message ||
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Error al subir el banner.';
      toast.error('Error al subir banner', { description: message });
      options.onError?.(error);
    },
  });

  return {
    uploadBanner: mutation.mutate,
    uploadBannerAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
