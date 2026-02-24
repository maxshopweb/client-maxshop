import axiosInstance from '@/app/lib/axios';
import type { IBanner, IBannerPublic, ICreateBannerDTO, IUpdateBannerDTO } from '@/app/types/banner.type';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (!response.data.success) throw new Error(response.data.error ?? 'Error desconocido');
  return response.data.data;
}

/** GET /banners — públicos, solo activos con imagen */
async function getPublicBanners(tipo?: string): Promise<IBannerPublic[]> {
  const params = tipo ? { tipo } : {};
  // console.log('🚀 BannersService.getPublicBanners - params:', params);
  const res = await axiosInstance.get<ApiResponse<IBannerPublic[]>>('/banners', { params });
  return unwrap(res);
}

/** GET /banners/admin — todos (admin) */
async function getAdminBanners(tipo?: string): Promise<IBanner[]> {
  const params = tipo ? { tipo } : {};
  const res = await axiosInstance.get<ApiResponse<IBanner[]>>('/banners/admin', { params });
  return unwrap(res);
}

/** POST /banners — crear slot sin imagen */
async function createBanner(dto: ICreateBannerDTO): Promise<IBanner> {
  const res = await axiosInstance.post<ApiResponse<IBanner>>('/banners', dto);
  return unwrap(res);
}

/** POST /banners/:id/imagen — subir/reemplazar imagen */
async function uploadBannerImage(id: number, file: File): Promise<IBanner> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axiosInstance.post<ApiResponse<IBanner>>(`/banners/${id}/imagen`, formData);
  return unwrap(res);
}

/** PATCH /banners/:id/activo — activar o desactivar */
async function toggleBannerActivo(id: number, activo: boolean): Promise<IBanner> {
  const res = await axiosInstance.patch<ApiResponse<IBanner>>(`/banners/${id}/activo`, { activo });
  return unwrap(res);
}

/** PATCH /banners/:id — actualizar orden y/o link */
async function updateBanner(id: number, dto: IUpdateBannerDTO): Promise<IBanner> {
  const res = await axiosInstance.patch<ApiResponse<IBanner>>(`/banners/${id}`, dto);
  return unwrap(res);
}

/** DELETE /banners/:id — eliminar banner y archivo en disco */
async function deleteBanner(id: number): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<null>>(`/banners/${id}`);
  if (!res.data.success) throw new Error(res.data.error ?? 'Error al eliminar');
}

export const bannersService = {
  getPublicBanners,
  getAdminBanners,
  createBanner,
  uploadBannerImage,
  toggleBannerActivo,
  updateBanner,
  deleteBanner,
};
