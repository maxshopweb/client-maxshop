import axiosInstance from '@/app/lib/axios';
import type {
  IProductos,
  IProductoFilters,
  IPaginatedResponse,
  ICreateProductoDTO,
  IUpdateProductoDTO,
  IApiResponse
} from '@/app/types/producto.type';
import { EstadoGeneral } from '../types/estados.type';

class ProductosService {

  async getAll(filters: IProductoFilters = {}): Promise<IPaginatedResponse<IProductos>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.order_by) params.append('order_by', filters.order_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.estado !== undefined) params.append('estado', filters.estado.toString());
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.id_subcat) params.append('id_subcat', filters.id_subcat.toString());
    if (filters.id_cat) params.append('id_cat', filters.id_cat.toString());
    if (filters.id_marca) params.append('id_marca', filters.id_marca.toString());
    if (filters.precio_min !== undefined) params.append('precio_min', filters.precio_min.toString());
    if (filters.precio_max !== undefined) params.append('precio_max', filters.precio_max.toString());
    if (filters.destacado !== undefined) params.append('destacado', filters.destacado.toString());
    if (filters.financiacion !== undefined) params.append('financiacion', filters.financiacion.toString());
    if (filters.stock_bajo !== undefined) params.append('stock_bajo', filters.stock_bajo.toString());

    const response = await axiosInstance.get<IPaginatedResponse<IProductos>>(
      `/productos?${params.toString()}`
    );

    return response.data;
  }

  async getById(id: number): Promise<IProductos> {
    const response = await axiosInstance.get<IApiResponse<IProductos>>(
      `/productos/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Producto no encontrado');
    }

    return response.data.data;
  }

  async create(data: ICreateProductoDTO): Promise<IProductos> {
    const response = await axiosInstance.post<IApiResponse<IProductos>>(
      `/productos`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al crear producto');
    }

    return response.data.data;
  }

  async update(id: number, data: IUpdateProductoDTO): Promise<IProductos> {
    const response = await axiosInstance.put<IApiResponse<IProductos>>(
      `/productos/${id}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar producto');
    }

    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<IApiResponse>(
      `/productos/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar producto');
    }
  }

  async updateStock(id: number, cantidad: number): Promise<IProductos> {
    const response = await axiosInstance.patch<IApiResponse<IProductos>>(
      `/productos/${id}/stock`,
      { cantidad }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar stock');
    }

    return response.data.data;
  }

  async getDestacados(limit: number = 10): Promise<IProductos[]> {
    const response = await axiosInstance.get<IApiResponse<IProductos[]>>(
      `/productos/destacados?limit=${limit}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener destacados');
    }

    return response.data.data;
  }

  async getStockBajo(): Promise<IProductos[]> {
    const response = await axiosInstance.get<IApiResponse<IProductos[]>>(
      `/productos/stock-bajo`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener stock bajo');
    }

    return response.data.data;
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    await Promise.all(ids.map(id => this.delete(id)));
  }

  async updateEstadoMultiple(ids: number[], estado: EstadoGeneral): Promise<void> {
    await Promise.all(ids.map(id => this.update(id, { estado })));
  }

  async updateDestacadoMultiple(ids: number[], destacado: boolean): Promise<void> {
    await Promise.all(ids.map(id => this.update(id, { destacado })));
  }

  async toggleDestacado(id: number): Promise<IProductos> {
    const response = await axiosInstance.patch<IApiResponse<IProductos>>(
      `/productos/${id}/destacado`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al cambiar estado destacado');
    }

    return response.data.data;
  }
}

export const productosService = new ProductosService();