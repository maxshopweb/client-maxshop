import axiosInstance from '@/app/lib/axios';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { IListaPrecio, IApiResponse } from '@/app/types/producto.type';

const BASE = '/listas-precio';

class ListaPrecioService {
  async getPaginated(params: {
    activoOnly: boolean;
    page: number;
    limit: number;
    busqueda?: string;
  }): Promise<PaginatedListResponse<IListaPrecio>> {
    const search = new URLSearchParams();
    if (!params.activoOnly) search.set('activo', 'false');
    search.set('page', String(params.page));
    search.set('limit', String(params.limit));
    if (params.busqueda?.trim()) search.set('busqueda', params.busqueda.trim());
    const q = search.toString();
    const response = await axiosInstance.get<PaginatedListResponse<IListaPrecio>>(`${BASE}?${q}`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Error al obtener listas de precio');
    }
    return response.data;
  }

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
