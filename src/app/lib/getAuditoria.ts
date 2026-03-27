import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/app/lib/apiBaseUrl';
import type { AuditoriaLogsResponse } from '@/app/services/auditoria.service';

const API_BASE_URL = getApiBaseUrl();

async function fetchWithAuth(path: string): Promise<AuditoriaLogsResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 30 },
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }

  return response.json();
}

export interface GetAuditoriaLogsParams {
  page?: number;
  limit?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  tabla_afectada?: string;
  method?: string;
  estado?: string;
}

export async function getAuditoriaLogs(
  params: GetAuditoriaLogsParams = {}
): Promise<AuditoriaLogsResponse> {
  try {
    const { page = 1, limit = 50, ...rest } = params;
    const search = new URLSearchParams();
    search.set('page', String(page));
    search.set('limit', String(limit));
    (['fecha_desde', 'fecha_hasta', 'tabla_afectada', 'method', 'estado'] as const).forEach((key) => {
      if (rest[key] != null && rest[key] !== '') search.set(key, String(rest[key]));
    });
    const data = await fetchWithAuth(`/admin/auditoria?${search.toString()}`);
    if (data === null) {
      console.warn(
        '[Auditoría] No autorizado en SSR (401). La página cargará vacía y el cliente volverá a pedir los datos.'
      );
      return {
        success: false,
        data: [],
        pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
      };
    }
    return data;
  } catch (error) {
    const cause = error instanceof Error ? (error.cause as { code?: string; errors?: unknown[] } | undefined) : undefined;
    const code = cause?.code ?? (cause?.errors?.[0] as { code?: string } | undefined)?.code;
    const isConnectionRefused = code === 'ECONNREFUSED';
    if (isConnectionRefused) {
      console.warn(
        '[Auditoría] API no disponible (conexión rechazada). Asegurate de que el backend esté corriendo en',
        process.env.NEXT_PUBLIC_API_URL || 'localhost:3001'
      );
    } else {
      console.error('Error fetching auditoría:', error);
    }
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      },
    };
  }
}
