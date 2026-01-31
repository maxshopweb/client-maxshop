import axiosInstance from '@/app/lib/axios';
import { ICreateMarcaDTO, IUpdateMarcaDTO, IMarca, MarcaResponse } from '../types/marca.type';

class MarcaService {
    async getAll(): Promise<MarcaResponse> {
        const response = await axiosInstance.get<MarcaResponse>('/marcas');
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