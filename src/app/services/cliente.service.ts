import axiosInstance from '@/app/lib/axios';
import type {
  ICliente,
  IClienteFilters,
  IPaginatedResponse,
  IApiResponse,
  IClienteStats
} from '@/app/types/cliente.type';

class ClientesService {

  async getAll(filters: IClienteFilters = {}): Promise<IPaginatedResponse<ICliente>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.order_by) params.append('order_by', filters.order_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.estado !== undefined) params.append('estado', filters.estado.toString());
    if (filters.ciudad) params.append('ciudad', filters.ciudad);
    if (filters.provincia) params.append('provincia', filters.provincia);
    if (filters.creado_desde) params.append('creado_desde', filters.creado_desde);
    if (filters.creado_hasta) params.append('creado_hasta', filters.creado_hasta);
    if (filters.ultimo_login_desde) params.append('ultimo_login_desde', filters.ultimo_login_desde);
    if (filters.ultimo_login_hasta) params.append('ultimo_login_hasta', filters.ultimo_login_hasta);

    const response = await axiosInstance.get<IPaginatedResponse<ICliente>>(
      `/clientes?${params.toString()}`
    );

    return response.data;
  }

  async getById(id: string): Promise<ICliente> {
    const response = await axiosInstance.get<IApiResponse<ICliente>>(
      `/clientes/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Cliente no encontrado');
    }

    return response.data.data;
  }

  async getStats(id: string): Promise<IClienteStats> {
    const response = await axiosInstance.get<IApiResponse<IClienteStats>>(
      `/clientes/${id}/stats`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener estadísticas');
    }

    return response.data.data;
  }

  async getVentas(id: string, filters: IClienteFilters = {}): Promise<IPaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get<IPaginatedResponse<any>>(
      `/clientes/${id}/ventas?${params.toString()}`
    );

    return response.data;
  }
}

export const clientesService = new ClientesService();

