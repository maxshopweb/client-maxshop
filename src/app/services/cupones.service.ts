import axiosInstance from '@/app/lib/axios';
import type { ResponseProps } from '@/app/types/api.type';
import type {
  ICupon,
  ICuponCanje,
  ICuponCreatePayload,
  ICuponUpdatePayload,
  ICuponValidateResult,
} from '@/app/types/cupones.type';

class CuponesService {
  async list(): Promise<ICupon[]> {
    const response = await axiosInstance.get<ResponseProps<ICupon[]>>('/cupones');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al listar cupones');
    }
    return response.data.data;
  }

  async create(payload: ICuponCreatePayload): Promise<ICupon> {
    const response = await axiosInstance.post<ResponseProps<ICupon>>('/cupones', payload);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al crear cupón');
    }
    return response.data.data;
  }

  async update(id: number, payload: ICuponUpdatePayload): Promise<ICupon> {
    const response = await axiosInstance.put<ResponseProps<ICupon>>(`/cupones/${id}`, payload);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar cupón');
    }
    return response.data.data;
  }

  async toggle(id: number): Promise<ICupon> {
    const response = await axiosInstance.patch<ResponseProps<ICupon>>(`/cupones/${id}/toggle`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al cambiar estado');
    }
    return response.data.data;
  }

  async listCanjes(id: number, limit = 30): Promise<ICuponCanje[]> {
    const response = await axiosInstance.get<ResponseProps<ICuponCanje[]>>(
      `/cupones/${id}/canjes`,
      { params: { limit } }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al listar canjes');
    }
    return response.data.data;
  }

  async validate(codigo: string, subtotal: number): Promise<ICuponValidateResult> {
    const response = await axiosInstance.post<ResponseProps<ICuponValidateResult>>(
      '/cupones/validar',
      { codigo, subtotal }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al validar cupón');
    }
    return response.data.data;
  }
}

export const cuponesService = new CuponesService();
