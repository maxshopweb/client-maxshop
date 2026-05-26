import axiosInstance from '@/app/lib/axios';
import type { IApiResponse } from '@/app/types/ventas.type';

export interface FacturasEstadisticas {
  pendientes: number;
  procesando: number;
  completados: number;
  errores: number;
  total: number;
}

export interface SyncFacturasResult {
  procesadas: number;
  noEncontradas: number;
  errores: number;
  detalles: Array<{
    ventaId: number;
    estado: 'procesada' | 'no_encontrada' | 'error';
    mensaje?: string;
  }>;
}

class FacturasService {
  async getEstadisticas(): Promise<FacturasEstadisticas> {
    const response = await axiosInstance.get<IApiResponse<FacturasEstadisticas>>(
      '/facturas/estadisticas'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener estadísticas de facturas');
    }

    return response.data.data;
  }

  async syncFacturas(): Promise<SyncFacturasResult> {
    const response = await axiosInstance.post<IApiResponse<SyncFacturasResult>>('/facturas/sync');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al sincronizar facturas');
    }

    return response.data.data;
  }

  async enviarFacturaManual(ventaId: number, file: File): Promise<void> {
    const form = new FormData();
    form.append('factura', file);

    const response = await axiosInstance.post<IApiResponse<unknown>>(
      `/facturas/${ventaId}/enviar-manual`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message || 'Error al enviar la factura');
    }
  }
}

export const facturasService = new FacturasService();
