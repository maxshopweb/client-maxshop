import axiosInstance from '@/app/lib/axios';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import { ICreateMarcaDTO, IUpdateMarcaDTO, IMarca, MarcaResponse } from '../types/marca.type';

class MarcaService {
    async getPaginated(params: { page: number; limit: number; busqueda?: string }): Promise<PaginatedListResponse<IMarca>> {
        const search = new URLSearchParams();
        search.set('page', String(params.page));
        search.set('limit', String(params.limit));
        if (params.busqueda?.trim()) search.set('busqueda', params.busqueda.trim());
        const response = await axiosInstance.get<PaginatedListResponse<IMarca>>(`/marcas?${search.toString()}`);
        return response.data;
    }

    async getAll(): Promise<MarcaResponse> {
        const response = await axiosInstance.get<MarcaResponse>('/marcas');
        return response.data;
    }

    async getActive(): Promise<MarcaResponse> {
        const response = await axiosInstance.get<MarcaResponse>('/marcas/active');
        return response.data;
    }

    async getById(id: number): Promise<{ success: boolean; data: IMarca }> {
        const response = await axiosInstance.get<{ success: boolean; data: IMarca }>(`/marcas/${id}`);
        return response.data;
    }

    async createMarca(data: ICreateMarcaDTO): Promise<MarcaResponse> {
        const response = await axiosInstance.post<MarcaResponse>('/marcas', data);
        return response.data;
    }

    async update(id: number, data: IUpdateMarcaDTO): Promise<{ success: boolean; data: IMarca }> {
        const response = await axiosInstance.put<{ success: boolean; data: IMarca }>(`/marcas/${id}`, data);
        return response.data;
    }

    async toggleActivo(id: number, activo: boolean): Promise<{ success: boolean; data: IMarca; message: string }> {
        const response = await axiosInstance.patch<{ success: boolean; data: IMarca; message: string }>(`/marcas/${id}/activo`, { activo });
        return response.data;
    }

    async toggleAllActivos(activo: boolean): Promise<{ success: boolean; data: { count: number }; message: string }> {
        const response = await axiosInstance.patch<{ success: boolean; data: { count: number }; message: string }>('/marcas/toggle-all', { activo });
        return response.data;
    }

    async delete(id: number): Promise<{ success: boolean; message?: string }> {
        const response = await axiosInstance.delete<{ success: boolean; message?: string; error?: string }>(`/marcas/${id}`);
        return response.data;
    }

    async getSiguienteCodigo(): Promise<{ success: boolean; data: { codigo: string } }> {
        const response = await axiosInstance.get<{ success: boolean; data: { codigo: string } }>('/marcas/siguiente-codigo');
        return response.data;
    }
}

export const marcaService = new MarcaService();