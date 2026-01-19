import axiosInstance from '@/app/lib/axios';
import type {
  IDashboardKpis,
  ISalesOverTimeItem,
  IOrderStatusItem,
  ITopProduct,
  ISalesByCategoryItem,
  ICustomersSummary,
  IDashboardAlerts,
  IDashboardDateRange,
  ITopProductsParams,
  IApiResponse,
} from '@/app/types/dashboard.type';

class DashboardService {
  /**
   * GET /dashboard/kpis
   * Obtiene KPIs principales del dashboard
   */
  async getKpis(params: IDashboardDateRange = {}): Promise<IDashboardKpis> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);

    const response = await axiosInstance.get<IApiResponse<IDashboardKpis>>(
      `/admin/dashboard/kpis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener KPIs');
    }

    return response.data.data;
  }

  /**
   * GET /dashboard/sales-over-time
   * Obtiene ventas agrupadas por día
   */
  async getSalesOverTime(params: IDashboardDateRange = {}): Promise<ISalesOverTimeItem[]> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);

    const response = await axiosInstance.get<IApiResponse<{ data: ISalesOverTimeItem[] }>>(
      `/admin/dashboard/sales-over-time${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener ventas en el tiempo');
    }

    return response.data.data.data;
  }

  /**
   * GET /dashboard/order-status
   * Obtiene cantidad de órdenes por estado de pago
   */
  async getOrderStatus(params: IDashboardDateRange = {}): Promise<IOrderStatusItem[]> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);

    const response = await axiosInstance.get<IApiResponse<{ data: IOrderStatusItem[] }>>(
      `/admin/dashboard/order-status${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener estado de órdenes');
    }

    return response.data.data.data;
  }

  /**
   * GET /dashboard/top-products
   * Obtiene top productos vendidos
   */
  async getTopProducts(params: ITopProductsParams = {}): Promise<ITopProduct[]> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await axiosInstance.get<IApiResponse<{ data: ITopProduct[] }>>(
      `/admin/dashboard/top-products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener top productos');
    }

    return response.data.data.data;
  }

  /**
   * GET /dashboard/sales-by-category
   * Obtiene ventas agrupadas por categoría
   */
  async getSalesByCategory(params: IDashboardDateRange = {}): Promise<ISalesByCategoryItem[]> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);

    const response = await axiosInstance.get<IApiResponse<{ data: ISalesByCategoryItem[] }>>(
      `/admin/dashboard/sales-by-category${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener ventas por categoría');
    }

    return response.data.data.data;
  }

  /**
   * GET /dashboard/customers-summary
   * Obtiene resumen de clientes (nuevos vs recurrentes)
   */
  async getCustomersSummary(params: IDashboardDateRange = {}): Promise<ICustomersSummary> {
    const queryParams = new URLSearchParams();
    if (params.dateFrom) queryParams.append('fecha_desde', params.dateFrom);
    if (params.dateTo) queryParams.append('fecha_hasta', params.dateTo);

    const response = await axiosInstance.get<IApiResponse<ICustomersSummary>>(
      `/admin/dashboard/customers-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener resumen de clientes');
    }

    return response.data.data;
  }

  /**
   * GET /dashboard/alerts
   * Obtiene alertas operativas
   */
  async getAlerts(): Promise<IDashboardAlerts> {
    const response = await axiosInstance.get<IApiResponse<IDashboardAlerts>>(
      '/admin/dashboard/alerts'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener alertas');
    }

    return response.data.data;
  }
}

export const dashboardService = new DashboardService();

