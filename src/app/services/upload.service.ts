import axiosInstance from '@/app/lib/axios';
import { buildImageUrl } from '@/app/lib/upload';
import type { UploadResponse, UploadResult } from '@/app/types/upload.type';

const UPLOAD_FIELD_NAME = 'image';

function toResult(data: UploadResponse): UploadResult {
  const url = data.url ?? buildImageUrl(data.path);
  return { path: data.path, url };
}

/**
 * Sube la imagen principal de un producto.
 * POST /upload/productos/:id con multipart field "image".
 * El backend actualiza producto.img_principal y devuelve path relativo.
 */
export async function uploadProductImage(
  idProd: number,
  file: File
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append(UPLOAD_FIELD_NAME, file);

  const response = await axiosInstance.post<UploadResponse>(
    `/upload/productos/${idProd}`,
    formData
  );

  const data = response.data;
  if (!data?.success || !data?.path) {
    throw new Error(
      (data as { error?: string })?.error ?? 'Error al subir la imagen del producto'
    );
  }

  return toResult(data);
}

/**
 * Sube una imagen secundaria de un producto (posición 2, 3, ...).
 * POST /upload/productos/:id/imagenes. El backend la appendea a producto.imagenes.
 */
export async function uploadProductSecondaryImage(
  idProd: number,
  file: File
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append(UPLOAD_FIELD_NAME, file);

  const response = await axiosInstance.post<UploadResponse>(
    `/upload/productos/${idProd}/imagenes`,
    formData
  );

  const data = response.data;
  if (!data?.success || !data?.path) {
    throw new Error(
      (data as { error?: string })?.error ?? 'Error al subir la imagen secundaria'
    );
  }

  return toResult(data);
}

/**
 * Sube un banner (banner-1, banner-2, ...).
 * POST /upload/banners con multipart field "image".
 * El backend guarda en files/banners y devuelve path relativo.
 */
export async function uploadBanner(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append(UPLOAD_FIELD_NAME, file);

  const response = await axiosInstance.post<UploadResponse>(
    '/upload/banners',
    formData
  );

  const data = response.data;
  if (!data?.success || !data?.path) {
    throw new Error(
      (data as { error?: string })?.error ?? 'Error al subir el banner'
    );
  }

  return toResult(data);
}

export const uploadService = {
  uploadProductImage,
  uploadProductSecondaryImage,
  uploadBanner,
};
