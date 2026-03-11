import axiosInstance from '@/app/lib/axios';
import type { IListaPrecio, IApiResponse } from '@/app/types/producto.type';

const BASE = '/listas-precio';

class ListaPrecioService {
  /** Lista todas las listas de precio. Para admin (Utilidades) usar activoOnly: false. */
  async getAll(activoOnly: boolean = true): Promise<IListaPrecio[]> {
    const url = activoOnly ? BASE : `${BASE}?activo=false`;
    const response = await axiosInstance.get<IApiResponse<IListaPrecio[]>>(url);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener listas de precio');
    }
    return response.data.data;
  }

  async toggleActivo(id: number, activo: boolean): Promise<IListaPrecio> {
    const response = await axiosInstance.patch<IApiResponse<IListaPrecio>>(
      `${BASE}/${id}/activo`,
      { activo }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar lista de precio');
    }
    return response.data.data;
  }
}

export const listaPrecioService = new ListaPrecioService();
