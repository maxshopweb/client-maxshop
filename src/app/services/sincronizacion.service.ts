import axiosInstance from '@/app/lib/axios';

export interface SyncRun {
  id: number;
  iniciado_en: string;
  finalizado_en: string;
  duracion_ms: number;
  trigger: 'AUTO' | 'ON_DEMAND';
  resultado: 'COMPLETA' | 'PARCIAL' | 'FALLIDA';
  archivos_descargados: number;
  archivos_convertidos: number;
  archivos_importados: number;
  total_registros: number | null;
  errores: string[];
  mensaje: string | null;
  ftp_json_subido: boolean;
  creado_en: string;
}

export interface SyncStats {
  ultimaCorrida: SyncRun | null;
  ultimaExitosa: SyncRun | null;
  horasSinExito: number | null;
  tasaExito7d: number;
  totalUltimas24h: number;
  exitosasUltimas24h: number;
}

export interface SyncRunsResponse {
  success: boolean;
  data: SyncRun[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SyncStatsResponse {
  success: boolean;
  data: SyncStats;
}

class SincronizacionService {
  async getRuns(page = 1, limit = 50): Promise<SyncRunsResponse> {
    const response = await axiosInstance.get<SyncRunsResponse>(
      `/sincronizacion/runs?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getRunById(id: number): Promise<SyncRun> {
    const response = await axiosInstance.get<{ success: boolean; data: SyncRun }>(
      `/sincronizacion/runs/${id}`
    );
    return response.data.data;
  }

  async getStats(): Promise<SyncStats> {
    const response = await axiosInstance.get<SyncStatsResponse>('/sincronizacion/stats');
    return response.data.data;
  }
}

export const sincronizacionService = new SincronizacionService();
