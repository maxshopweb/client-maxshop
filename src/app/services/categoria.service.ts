import axiosInstance from '@/app/lib/axios';
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
    async getAll(): Promise<CategoriaApiResponse> {
        const response = await axiosInstance.get<CategoriaApiResponse>('/categorias');
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