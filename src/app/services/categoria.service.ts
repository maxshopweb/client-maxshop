import axiosInstance from '@/app/lib/axios';
import { ICreateCategoriaDTO, ICreateSubcategoriaDTO } from '../types/categoria.type';

class CategoriaService { 
    async getAll(): Promise<any> {
        const response = await axiosInstance.get('/categorias');
        return response.data;
    }

    async createCategria(data: ICreateCategoriaDTO): Promise<any> {
        const response = await axiosInstance.post('/categorias', data);
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

}

export const categoriaService = new CategoriaService();