// ========================================
// TIPOS PRINCIPALES DEL DASHBOARD
// ========================================

export interface IDashboardKpis {
  total_ventas_netas: number;
  cantidad_ordenes: number;
  ticket_promedio: number;
  clientes_unicos: number;
}

export interface ISalesOverTimeItem {
  fecha: string; // YYYY-MM-DD
  total_vendido: number;
  cantidad_ordenes: number;
}

export interface IOrderStatusItem {
  estado_pago: string;
  cantidad: number;
}

export interface ITopProduct {
  id_producto: number;
  nombre: string;
  cantidad_vendida: number;
  total_facturado: number;
}

export interface ISalesByCategoryItem {
  categoria: string;
  total_vendido: number;
  cantidad_productos_vendidos: number;
}

export interface ICustomersSummary {
  clientes_nuevos: number;
  clientes_recurrentes: number;
}

export interface IDashboardAlerts {
  productos_stock_bajo: number;
  ventas_pendientes: number;
  ventas_problemas_pago: number;
}

// ========================================
// FILTROS Y PARÁMETROS
// ========================================

export interface IDashboardDateRange {
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
}

export interface ITopProductsParams extends IDashboardDateRange {
  limit?: number;
}

// ========================================
// RESPONSES
// ========================================

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

