import axiosInstance from '@/app/lib/axios';
import type { IApiResponse } from '@/app/types/ventas.type';

export interface IDireccion {
  id_direccion: string;
  id_usuario: string;
  nombre?: string | null;
  direccion?: string | null;
  altura?: string | null;
  piso?: string | null;
  dpto?: string | null;
  cod_postal?: number | null;
  ciudad?: string | null;
  provincia?: string | null;
  es_principal: boolean;
  activo: boolean;
  creado_en?: Date | null;
  actualizado_en?: Date | null;
}

export interface ICreateDireccionDTO {
  nombre?: string;
  direccion?: string;
  altura?: string;
  piso?: string;
  dpto?: string;
  cod_postal?: number | null;
  ciudad?: string;
  provincia?: string;
  es_principal?: boolean;
}

export interface IUpdateDireccionDTO extends ICreateDireccionDTO {
  activo?: boolean;
}

class DireccionesService {
  /**
   * Obtiene todas las direcciones del usuario autenticado
   */
  async getAll(): Promise<IDireccion[]> {
    const response = await axiosInstance.get<IApiResponse<IDireccion[]>>(
      '/direcciones'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener direcciones');
    }

    return response.data.data;
  }

  /**
   * Obtiene una dirección por ID
   */
  async getById(id: string): Promise<IDireccion> {
    const direcciones = await this.getAll();
    const direccion = direcciones.find(d => d.id_direccion === id);
    
    if (!direccion) {
      throw new Error('Dirección no encontrada');
    }

    return direccion;
  }

  /**
   * Crea una nueva dirección
   */
  async create(data: ICreateDireccionDTO): Promise<IDireccion> {
    const response = await axiosInstance.post<IApiResponse<IDireccion>>(
      '/direcciones',
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al crear dirección');
    }

    // Si el backend no retorna el objeto creado, hacemos un refetch
    if (!response.data.data) {
      // Refetch para obtener la dirección recién creada
      const direcciones = await this.getAll();
      // La última dirección debería ser la recién creada (o podemos buscar por algún criterio)
      // Por ahora retornamos la última, pero idealmente el backend debería retornar el objeto creado
      const nuevaDireccion = direcciones[direcciones.length - 1];
      if (!nuevaDireccion) {
        throw new Error('Dirección creada pero no se pudo obtener');
      }
      return nuevaDireccion;
    }

    return response.data.data;
  }

  /**
   * Actualiza una dirección
   */
  async update(id: string, data: IUpdateDireccionDTO): Promise<IDireccion> {
    const response = await axiosInstance.put<IApiResponse<IDireccion>>(
      `/direcciones/${id}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al actualizar dirección');
    }

    // Si el backend no retorna el objeto actualizado, hacemos un refetch
    if (!response.data.data) {
      const direcciones = await this.getAll();
      const direccionActualizada = direcciones.find(d => d.id_direccion === id);
      if (!direccionActualizada) {
        throw new Error('Dirección actualizada pero no se pudo obtener');
      }
      return direccionActualizada;
    }

    return response.data.data;
  }

  /**
   * Elimina una dirección
   */
  async delete(id: string): Promise<void> {
    const response = await axiosInstance.delete<IApiResponse>(
      `/direcciones/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar dirección');
    }
  }

  /**
   * Marca una dirección como principal
   */
  async setPrincipal(id: string): Promise<IDireccion> {
    const response = await axiosInstance.patch<IApiResponse<IDireccion>>(
      `/direcciones/${id}/principal`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al marcar dirección como principal');
    }

    // Si el backend no retorna el objeto actualizado, hacemos un refetch
    if (!response.data.data) {
      const direcciones = await this.getAll();
      const direccionActualizada = direcciones.find(d => d.id_direccion === id);
      if (!direccionActualizada) {
        throw new Error('Dirección actualizada pero no se pudo obtener');
      }
      return direccionActualizada;
    }

    return response.data.data;
  }
}

export const direccionesService = new DireccionesService();

