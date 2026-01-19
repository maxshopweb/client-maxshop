import { cookies } from 'next/headers';
import type { IProductos, IProductoFilters, IPaginatedResponse } from '@/app/types/producto.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getProducts(
  filters: IProductoFilters = {}
): Promise<IPaginatedResponse<IProductos>> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.order_by) params.append('order_by', filters.order_by);
  if (filters.order) params.append('order', filters.order);
  if (filters.estado !== undefined) params.append('estado', filters.estado.toString());
  if (filters.busqueda) params.append('busqueda', filters.busqueda);
  if (filters.id_subcat) params.append('id_subcat', filters.id_subcat.toString());
  if (filters.id_cat) params.append('id_cat', filters.id_cat.toString());
  if (filters.id_marca) params.append('id_marca', filters.id_marca.toString());
  if (filters.codi_grupo) params.append('codi_grupo', filters.codi_grupo);
  if (filters.precio_min !== undefined) params.append('precio_min', filters.precio_min.toString());
  if (filters.precio_max !== undefined) params.append('precio_max', filters.precio_max.toString());
  if (filters.destacado !== undefined) params.append('destacado', filters.destacado.toString());
  if (filters.financiacion !== undefined) params.append('financiacion', filters.financiacion.toString());
  if (filters.stock_bajo !== undefined) params.append('stock_bajo', filters.stock_bajo.toString());

  const url = `${API_BASE_URL}/productos?${params.toString()}`;

  try {
    // Obtener token de cookies del servidor
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidar cada 60 segundos
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: filters.limit || 12,
      totalPages: 0,
    };
  }
}

