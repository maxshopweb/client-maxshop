import axiosInstance from '@/app/lib/axios';
import type { PaginationProps } from '@/app/types/api.type';

export interface UsuarioAuditoria {
    id_usuario: string;
    nombre: string | null;
    apellido: string | null;
    email: string | null;
}

export interface AuditoriaLog {
    id_aud: number;
    id_usuario: string | null;
    fecha: string | null;
    fecha_iso: string | null;
    dia: string | null;
    hora: string | null;
    anio: number | null;
    accion: string | null;
    tabla_afectada: string | null;
    descripcion: string | null;
    dato_anterior: unknown;
    dato_despues: unknown;
    endpoint: string | null;
    estado: string | null;
    user_agent: string | null;
    tiempo_procesamiento: number | null;
    method: string;
    usuario: UsuarioAuditoria | null;
}

export interface AuditoriaLogsResponse {
    success: boolean;
    data: AuditoriaLog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AuditoriaGetLogsParams {
    page?: number;
    limit?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    accion?: string;
    tabla_afectada?: string;
    method?: string;
    estado?: string;
}

const AuditoriaService = {
    async getLogs(props: AuditoriaGetLogsParams = {}): Promise<AuditoriaLogsResponse> {
        const { page = 1, limit = 50, ...rest } = props;
        const params: Record<string, string | number> = { page, limit };
        (['fecha_desde', 'fecha_hasta', 'accion', 'tabla_afectada', 'method', 'estado'] as const).forEach((key) => {
            if (rest[key] != null && rest[key] !== '') params[key] = rest[key] as string;
        });
        const response = await axiosInstance.get<AuditoriaLogsResponse>('/admin/auditoria', { params });
        return response.data;
    }
};

export default AuditoriaService;