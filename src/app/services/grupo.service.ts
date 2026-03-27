import axiosInstance from '@/app/lib/axios';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import { IGrupo, IGrupoResponse, ICreateGrupoDTO, IUpdateGrupoDTO } from '../types/grupo.type';

class GrupoService {
  async getPaginated(params: { page: number; limit: number; busqueda?: string }): Promise<PaginatedListResponse<IGrupo>> {
    const search = new URLSearchParams();
    search.set('page', String(params.page));
    search.set('limit', String(params.limit));
    if (params.busqueda?.trim()) search.set('busqueda', params.busqueda.trim());
    const response = await axiosInstance.get<PaginatedListResponse<IGrupo>>(`/grupos?${search.toString()}`);
    return response.data;
  }

  async getAll(): Promise<IGrupoResponse> {
    const response = await axiosInstance.get<IGrupoResponse>('/grupos');
    return response.data;
  }

  async getById(id: number): Promise<IGrupoResponse> {
    const response = await axiosInstance.get<IGrupoResponse>(`/grupos/${id}`);
    return response.data;
  }

  async getByCodigo(codi_grupo: string): Promise<IGrupoResponse> {
    const response = await axiosInstance.get<IGrupoResponse>(`/grupos/codigo/${codi_grupo}`);
    return response.data;
  }

  async create(data: ICreateGrupoDTO): Promise<IGrupoResponse> {
    const response = await axiosInstance.post<IGrupoResponse>('/grupos', data);
    return response.data;
  }

  async update(id: number, data: IUpdateGrupoDTO): Promise<IGrupoResponse> {
    const response = await axiosInstance.put<IGrupoResponse>(`/grupos/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<IGrupoResponse> {
    const response = await axiosInstance.delete<IGrupoResponse>(`/grupos/${id}`);
    return response.data;
  }

  async getSiguienteCodigo(): Promise<{ success: boolean; data: { codigo: string } }> {
    const response = await axiosInstance.get<{ success: boolean; data: { codigo: string } }>('/grupos/siguiente-codigo');
    return response.data;
  }
}

export const grupoService = new GrupoService();

