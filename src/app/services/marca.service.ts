import axiosInstance from '@/app/lib/axios';
import { ICreateMarcaDTO, MarcaResponse } from '../types/marca.type';

class MarcaService { 
    async getAll(): Promise<MarcaResponse> {
        const response = await axiosInstance.get<MarcaResponse>('/marcas');
        return response.data;
    }

    async createMarca(data: ICreateMarcaDTO): Promise<any> {
        const response = await axiosInstance.post('/marcas', data);
        return response;
    }
}

export const marcaService = new MarcaService();