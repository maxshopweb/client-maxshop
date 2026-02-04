import { cookies } from 'next/headers';
import type { IMarca } from '@/app/types/marca.type';
import type { ICategoria } from '@/app/types/categoria.type';
import type { IGrupo } from '@/app/types/grupo.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 60 },
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }

  return response.json();
}

export interface MarcasSSRResponse {
  success: boolean;
  data: IMarca[];
  message?: string;
}

export interface CategoriasSSRResponse {
  success: boolean;
  data: ICategoria[];
  message?: string;
}

export interface GruposSSRResponse {
  success: boolean;
  data: IGrupo[];
  message?: string;
}

export async function getMarcas(): Promise<MarcasSSRResponse> {
  try {
    const data = await fetchWithAuth('/marcas');
    return data;
  } catch (error) {
    console.error('Error fetching marcas:', error);
    return { success: false, data: [] };
  }
}

export async function getCategorias(): Promise<CategoriasSSRResponse> {
  try {
    const data = await fetchWithAuth('/categorias');
    return data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return { success: false, data: [] };
  }
}

export async function getGrupos(): Promise<GruposSSRResponse> {
  try {
    const data = await fetchWithAuth('/grupos');
    return data;
  } catch (error) {
    console.error('Error fetching grupos:', error);
    return { success: false, data: [] };
  }
}
