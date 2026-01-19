import type { IDashboardDateRange, ITopProductsParams } from '@/app/types/dashboard.type';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: (params?: IDashboardDateRange) => [...dashboardKeys.all, 'kpis', params] as const,
  salesOverTime: (params?: IDashboardDateRange) => [...dashboardKeys.all, 'sales-over-time', params] as const,
  orderStatus: (params?: IDashboardDateRange) => [...dashboardKeys.all, 'order-status', params] as const,
  topProducts: (params?: ITopProductsParams) => [...dashboardKeys.all, 'top-products', params] as const,
  salesByCategory: (params?: IDashboardDateRange) => [...dashboardKeys.all, 'sales-by-category', params] as const,
  customersSummary: (params?: IDashboardDateRange) => [...dashboardKeys.all, 'customers-summary', params] as const,
  alerts: () => [...dashboardKeys.all, 'alerts'] as const,
};

