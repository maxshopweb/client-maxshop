import { cookies } from 'next/headers';
import type { PaginatedListResponse } from '@/app/types/admin-pagination.type';
import type { IMarca } from '@/app/types/marca.type';
import type { ICategoria } from '@/app/types/categoria.type';
import type { IGrupo } from '@/app/types/grupo.type';
import type { IListaPrecio } from '@/app/types/producto.type';
import { getApiBaseUrl } from '@/app/lib/apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

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

export type MarcasPaginatedSSR = PaginatedListResponse<IMarca>;
export type CategoriasPaginatedSSR = PaginatedListResponse<ICategoria>;
export type GruposPaginatedSSR = PaginatedListResponse<IGrupo>;

function buildMaestrosQuery(page: number, limit: number, busqueda: string): string {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (busqueda) params.set('busqueda', busqueda);
  return params.toString();
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

export async function getMarcasPaginated(
  page: number,
  limit: number,
  busqueda: string
): Promise<MarcasPaginatedSSR> {
  try {
    const q = buildMaestrosQuery(page, limit, busqueda);
    const data = await fetchWithAuth(`/marcas?${q}`);
    return data as MarcasPaginatedSSR;
  } catch (error) {
    console.error('Error fetching marcas paginated:', error);
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getCategoriasPaginated(
  page: number,
  limit: number,
  busqueda: string
): Promise<CategoriasPaginatedSSR> {
  try {
    const q = buildMaestrosQuery(page, limit, busqueda);
    const data = await fetchWithAuth(`/categorias?${q}`);
    return data as CategoriasPaginatedSSR;
  } catch (error) {
    console.error('Error fetching categorias paginated:', error);
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getGruposPaginated(
  page: number,
  limit: number,
  busqueda: string
): Promise<GruposPaginatedSSR> {
  try {
    const q = buildMaestrosQuery(page, limit, busqueda);
    const data = await fetchWithAuth(`/grupos?${q}`);
    return data as GruposPaginatedSSR;
  } catch (error) {
    console.error('Error fetching grupos paginated:', error);
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export type ListasPrecioPaginatedSSR = PaginatedListResponse<IListaPrecio>;

export async function getListasPrecioPaginated(
  page: number,
  limit: number,
  busqueda: string
): Promise<ListasPrecioPaginatedSSR> {
  try {
    const params = new URLSearchParams();
    params.set('activo', 'false');
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (busqueda) params.set('busqueda', busqueda);
    const data = await fetchWithAuth(`/listas-precio?${params.toString()}`);
    return data as ListasPrecioPaginatedSSR;
  } catch (error) {
    console.error('Error fetching listas precio paginated:', error);
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}
