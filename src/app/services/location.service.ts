import axiosInstance from '@/app/lib/axios';
import type { IDireccionOpenCageDTO } from '@/app/types/direccion.type';

interface LocationSearchParams {
    q: string;
    limit?: number;
    country?: string;
}

interface LocationReverseParams {
    lat: number;
    lng: number;
    country?: string;
}

interface LocationSearchResponse {
    success: boolean;
    data: IDireccionOpenCageDTO[];
}

interface LocationReverseResponse {
    success: boolean;
    data: IDireccionOpenCageDTO | null;
    message?: string;
}

/**
 * Servicio para interactuar con la API de ubicaciones (OpenCage)
 * Wrapper exclusivo de los endpoints del backend, sin lógica de UI
 */
class LocationService {
    /**
     * Busca direcciones mediante OpenCage
     * GET /api/location/search?q=...
     */
    async search(params: LocationSearchParams): Promise<IDireccionOpenCageDTO[]> {
        const { q, limit = 5, country = 'ar' } = params;

        if (!q || q.trim().length < 3) {
            throw new Error('La búsqueda debe tener al menos 3 caracteres');
        }

        const queryParams = new URLSearchParams({
            q: q.trim(),
            limit: limit.toString(),
            country,
        });

        const response = await axiosInstance.get<LocationSearchResponse>(
            `/location/search?${queryParams.toString()}`
        );

        if (!response.data.success) {
            throw new Error('Error al buscar direcciones');
        }

        return response.data.data || [];
    }

    /**
     * Geocodificación inversa (coordenadas → dirección)
     * POST /api/location/reverse
     */
    async reverse(params: LocationReverseParams): Promise<IDireccionOpenCageDTO | null> {
        const { lat, lng, country = 'ar' } = params;

        if (isNaN(lat) || isNaN(lng)) {
            throw new Error('Coordenadas inválidas');
        }

        const response = await axiosInstance.post<LocationReverseResponse>(
            '/location/reverse',
            { lat, lng, country }
        );

        if (!response.data.success) {
            return null;
        }

        return response.data.data || null;
    }
}

export const locationService = new LocationService();

