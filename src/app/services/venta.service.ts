import axiosInstance from '@/app/lib/axios';
import type {
  IVenta,
  IVentaFilters,
  IPaginatedResponse,
  ICreateVentaDTO,
  IUpdateVentaDTO,
  IApiResponse
} from '@/app/types/ventas.type';

class VentasService {

  async getAll(filters: IVentaFilters = {}): Promise<IPaginatedResponse<IVenta>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.order_by) params.append('order_by', filters.order_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.id_cliente) params.append('id_cliente', filters.id_cliente);
    if (filters.id_usuario) params.append('id_usuario', filters.id_usuario);
    if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
    if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
    if (filters.estado_pago) params.append('estado_pago', filters.estado_pago);
    if (filters.estado_envio) params.append('estado_envio', filters.estado_envio);
    if (filters.metodo_pago) params.append('metodo_pago', filters.metodo_pago);
    if (filters.tipo_venta) params.append('tipo_venta', filters.tipo_venta);
    if (filters.total_min !== undefined) params.append('total_min', filters.total_min.toString());
    if (filters.total_max !== undefined) params.append('total_max', filters.total_max.toString());

    const response = await axiosInstance.get<IPaginatedResponse<IVenta>>(
      `/ventas?${params.toString()}`
    );

    return response.data;
  }

  async getById(id: number): Promise<IVenta> {
    const response = await axiosInstance.get<IApiResponse<IVenta>>(
      `/ventas/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Venta no encontrada');
    }

    return response.data.data;
  }

  async create(data: ICreateVentaDTO): Promise<IVenta> {
    const response = await axiosInstance.post<IApiResponse<IVenta>>(
      `/ventas`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al crear venta');
    }

    return response.data.data;
  }

  async update(id: number, data: IUpdateVentaDTO): Promise<IVenta> {
    const response = await axiosInstance.put<IApiResponse<IVenta>>(
      `/ventas/${id}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar venta');
    }

    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<IApiResponse>(
      `/ventas/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar venta');
    }
  }

  async updateEstadoPago(id: number, estado: string): Promise<IVenta> {
    const response = await axiosInstance.patch<IApiResponse<IVenta>>(
      `/ventas/${id}/estado-pago`,
      { estado_pago: estado }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar estado de pago');
    }

    return response.data.data;
  }

  async updateEstadoEnvio(id: number, estado: string): Promise<IVenta> {
    const response = await axiosInstance.patch<IApiResponse<IVenta>>(
      `/ventas/${id}/estado-envio`,
      { estado_envio: estado }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar estado de envío');
    }

    return response.data.data;
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    await Promise.all(ids.map(id => this.delete(id)));
  }

  async getByCliente(idCliente: string, filters: IVentaFilters = {}): Promise<IPaginatedResponse<IVenta>> {
    return this.getAll({ ...filters, id_cliente: idCliente });
  }

  async getByUsuario(idUsuario: string, filters: IVentaFilters = {}): Promise<IPaginatedResponse<IVenta>> {
    return this.getAll({ ...filters, id_usuario: idUsuario });
  }

  async getStats(filters: IVentaFilters = {}): Promise<{
    totalVentas: number;
    totalVendido: number;
    promedioVenta: number;
    ventasAprobadas: number;
  }> {
    const params = new URLSearchParams();

    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.id_cliente) params.append('id_cliente', filters.id_cliente);
    if (filters.id_usuario) params.append('id_usuario', filters.id_usuario);
    if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
    if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
    if (filters.estado_pago) params.append('estado_pago', filters.estado_pago);
    if (filters.estado_envio) params.append('estado_envio', filters.estado_envio);
    if (filters.metodo_pago) params.append('metodo_pago', filters.metodo_pago);
    if (filters.tipo_venta) params.append('tipo_venta', filters.tipo_venta);
    if (filters.total_min !== undefined) params.append('total_min', filters.total_min.toString());
    if (filters.total_max !== undefined) params.append('total_max', filters.total_max.toString());

    const response = await axiosInstance.get<IApiResponse<{
      totalVentas: number;
      totalVendido: number;
      promedioVenta: number;
      ventasAprobadas: number;
    }>>(`/ventas/stats?${params.toString()}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener estadísticas');
    }

    return response.data.data;
  }

  /**
   * Crea un pedido desde el checkout
   * Endpoint específico para el flujo de checkout
   */
  async createFromCheckout(data: {
    id_cliente?: string;
    metodo_pago: string;
    detalles: Array<{
      id_prod: number;
      cantidad: number;
      precio_unitario: number;
      descuento_aplicado?: number;
    }>;
    observaciones?: string;
    costo_envio?: number; // Costo del envío calculado
    id_direccion?: string; // ID de dirección guardada (opcional)
    // Datos de dirección para actualizar el cliente (si no se usa id_direccion)
    direccion?: {
      direccion?: string;
      altura?: string;
      piso?: string;
      dpto?: string;
      ciudad?: string;
      provincia?: string;
      cod_postal?: number | null;
      telefono?: string;
    };
  }): Promise<IVenta & { mercadoPagoPreferenceUrl?: string | null }> {
    const response = await axiosInstance.post<IApiResponse<IVenta & { mercadoPagoPreferenceUrl?: string | null }>>(
      '/ventas/checkout',
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al crear pedido');
    }

    if (!response.data.data) {
      throw new Error('El pedido se creó exitosamente pero no se recibieron los datos de la venta');
    }

    return response.data.data;
  }
}

export const ventasService = new VentasService();

