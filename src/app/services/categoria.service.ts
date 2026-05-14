import axiosInstance from '@/app/lib/axios';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import {
    ICategoria,
    ICreateCategoriaDTO,
    ICreateSubcategoriaDTO,
    IUpdateCategoriaDTO,
} from '../types/categoria.type';

interface CategoriaApiResponse {
    success: boolean;
    data: ICategoria | ICategoria[];
    message?: string;
    error?: string;
}

class CategoriaService {
    async getPaginated(params: { page: number; limit: number; busqueda?: string }): Promise<PaginatedListResponse<ICategoria>> {
        const search = new URLSearchParams();
        search.set('page', String(params.page));
        search.set('limit', String(params.limit));
        if (params.busqueda?.trim()) search.set('busqueda', params.busqueda.trim());
        const response = await axiosInstance.get<PaginatedListResponse<ICategoria>>(`/categorias?${search.toString()}`);
        return response.data;
    }

    async getAll(): Promise<CategoriaApiResponse> {
        const response = await axiosInstance.get<CategoriaApiResponse>('/categorias');
        return response.data;
    }

    async getActive(): Promise<CategoriaApiResponse> {
        const response = await axiosInstance.get<CategoriaApiResponse>('/categorias/active');
        return response.data;
    }

    async toggleActivo(id: number, activo: boolean): Promise<{ success: boolean; data: ICategoria; message: string }> {
        const response = await axiosInstance.patch<{ success: boolean; data: ICategoria; message: string }>(`/categorias/${id}/activo`, { activo });
        return response.data;
    }

    async toggleAllActivos(activo: boolean): Promise<{ success: boolean; data: { count: number }; message: string }> {
        const response = await axiosInstance.patch<{ success: boolean; data: { count: number }; message: string }>('/categorias/toggle-all', { activo });
        return response.data;
    }

    async getById(id: number): Promise<{ success: boolean; data: ICategoria }> {
        const response = await axiosInstance.get<{ success: boolean; data: ICategoria }>(`/categorias/${id}`);
        return response.data;
    }

    async createCategria(data: ICreateCategoriaDTO): Promise<CategoriaApiResponse> {
        const response = await axiosInstance.post<CategoriaApiResponse>('/categorias', data);
        return response.data;
    }

    async update(id: number, data: IUpdateCategoriaDTO): Promise<{ success: boolean; data: ICategoria }> {
        const response = await axiosInstance.put<{ success: boolean; data: ICategoria }>(`/categorias/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
        const response = await axiosInstance.delete<{ success: boolean; message?: string; error?: string }>(`/categorias/${id}`);
        return response.data;
    }

    async getSubCategoriesByCategory(idCat: number): Promise<any> {
        const response = await axiosInstance.get(`/categorias/subcategorias/all?id_cat=${idCat}`);
        return response.data;
    }

    async createSubcategoria(data: ICreateSubcategoriaDTO): Promise<any> {
        const response = await axiosInstance.post(`/categorias/subcategorias`, data);
        return response.data;
    }

    async getSiguienteCodigo(): Promise<{ success: boolean; data: { codigo: string } }> {
        const response = await axiosInstance.get<{ success: boolean; data: { codigo: string } }>('/categorias/siguiente-codigo');
        return response.data;
    }
}

export const categoriaService = new CategoriaService();