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
  // Helper para filtrar productos con imagen (excluir null o undefined)
  private filterProductsWithImage(products: IProductos[]): IProductos[] {
    return products.filter(producto => 
      producto.img_principal !== null && 
      producto.img_principal !== undefined && 
      producto.img_principal.trim() !== ''
    );
  }

  // Método específico para tienda (client/user): solo marca INGCO (004) con imágenes
  async getProductosTienda(filters: IProductoFilters = {}): Promise<IPaginatedResponse<IProductos>> {
    const params = new URLSearchParams();

    // Limitar el máximo de productos a 100 para evitar requests masivos
    const maxLimit = 100;
    const safeLimit = filters.limit && filters.limit > maxLimit ? maxLimit : (filters.limit || 21);

    if (filters.page) params.append('page', filters.page.toString());
    if (safeLimit) params.append('limit', safeLimit.toString());
    if (filters.order_by) params.append('order_by', filters.order_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.id_cat) params.append('id_cat', filters.id_cat.toString());
    if (filters.codi_grupo) params.append('codi_grupo', filters.codi_grupo);
    if (filters.precio_min !== undefined) params.append('precio_min', filters.precio_min.toString());
    if (filters.precio_max !== undefined) params.append('precio_max', filters.precio_max.toString());
    if (filters.destacado !== undefined) params.append('destacado', filters.destacado.toString());
    if (filters.financiacion !== undefined) params.append('financiacion', filters.financiacion.toString());

    const url = `/productos/tienda?${params.toString()}`;
    const response = await axiosInstance.get<IPaginatedResponse<IProductos>>(url);

    return response.data;
  }

  async getAll(filters: IProductoFilters = {}, filterByImage: boolean = false): Promise<IPaginatedResponse<IProductos>> {
    const params = new URLSearchParams();

    // Limitar el máximo de productos a 100 para evitar requests masivos
    const maxLimit = 100;
    const safeLimit = filters.limit && filters.limit > maxLimit ? maxLimit : (filters.limit || 21);

    if (filters.page) params.append('page', filters.page.toString());
    if (safeLimit) params.append('limit', safeLimit.toString());
    if (filters.order_by) params.append('order_by', filters.order_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.estado !== undefined) params.append('estado', filters.estado.toString());
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.id_subcat) params.append('id_subcat', filters.id_subcat.toString());
    if (filters.id_cat) params.append('id_cat', filters.id_cat.toString());
    // id_marca puede ser número (ID) o string (código de marca, ej: "004" para INGCO)
    if (filters.id_marca !== undefined && filters.id_marca !== null && filters.id_marca !== '') {
      params.append('id_marca', filters.id_marca.toString());
    }
    if (filters.codi_grupo) params.append('codi_grupo', filters.codi_grupo);
    if (filters.precio_min !== undefined) params.append('precio_min', filters.precio_min.toString());
    if (filters.precio_max !== undefined) params.append('precio_max', filters.precio_max.toString());
    if (filters.destacado !== undefined) params.append('destacado', filters.destacado.toString());
    if (filters.financiacion !== undefined) params.append('financiacion', filters.financiacion.toString());
    if (filters.stock_bajo !== undefined) params.append('stock_bajo', filters.stock_bajo.toString());
    if (filters.activo) params.append('activo', filters.activo);

    const url = `/productos?${params.toString()}`;
    // eslint-disable-next-line no-console
    console.log('🚀 ProductosService.getAll - URL:', url);
    // eslint-disable-next-line no-console
    console.log('🚀 ProductosService.getAll - filters:', filters);

    const response = await axiosInstance.get<IPaginatedResponse<IProductos>>(url);

    // Solo filtrar productos sin imagen si filterByImage es true (solo para tienda, no admin)
    if (filterByImage) {
      const filteredData = this.filterProductsWithImage(response.data.data);
      return {
        ...response.data,
        data: filteredData,
        total: filteredData.length, // Ajustar total a los productos filtrados
      };
    }

    // Para admin, devolver todos los productos sin filtrar
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

    // Filtrar productos sin imagen
    return this.filterProductsWithImage(response.data.data);
  }

  async getStockBajo(): Promise<IProductos[]> {
    const response = await axiosInstance.get<IApiResponse<IProductos[]>>(
      `/productos/stock-bajo`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener stock bajo');
    }

    // Filtrar productos sin imagen
    return this.filterProductsWithImage(response.data.data);
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

  async getRelatedProducts(id: number, limit: number = 4): Promise<IProductos[]> {
    try {
      // Obtener el producto actual para usar su categoría/marca
      const currentProduct = await this.getById(id);
      
      // Buscar productos relacionados por categoría o marca
      const filters: IProductoFilters = {
        limit,
        estado: 1, // EstadoGeneral.ACTIVO
      };

      // Priorizar productos de la misma categoría
      if (currentProduct.id_cat) {
        filters.id_cat = currentProduct.id_cat;
      }

      // Si no hay suficientes, buscar por marca
      const response = await this.getAll(filters);
      
      // Filtrar el producto actual y limitar resultados (ya vienen filtrados por imagen)
      const related = response.data
        .filter(p => p.id_prod !== id)
        .slice(0, limit);

      // Si no hay suficientes por categoría, buscar por marca
      if (related.length < limit && currentProduct.id_marca) {
        const marcaFilters: IProductoFilters = {
          limit: limit - related.length,
          id_marca: currentProduct.id_marca,
          estado: 1, // EstadoGeneral.ACTIVO
        };
        
        const marcaResponse = await this.getAll(marcaFilters);
        // Los productos ya vienen filtrados por imagen desde getAll
        const marcaProducts = marcaResponse.data
          .filter(p => p.id_prod !== id && !related.some(r => r.id_prod === p.id_prod))
          .slice(0, limit - related.length);
        
        related.push(...marcaProducts);
      }

      // Asegurar que todos tengan imagen (doble verificación por seguridad)
      return this.filterProductsWithImage(related);
    } catch (error) {
      console.error('Error al obtener productos relacionados:', error);
      return [];
    }
  }
}

export const productosService = new ProductosService();