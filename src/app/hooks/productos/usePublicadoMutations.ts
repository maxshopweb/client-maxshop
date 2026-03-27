/**
 * Hooks para mutaciones de estado "publicado" de productos.
 * Una sola responsabilidad: publicar / despublicar (toggle y bulk).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getClientErrorMessage } from '@/app/utils/apiError';
import { productosService } from '@/app/services/producto.service';
import { CONFIG_TIENDA_QUERY_KEY } from '@/app/hooks/config/useConfigTienda';
import { productosKeys } from './useProductos';
import type { IConfigTienda } from '@/app/types/config-tienda.type';
import type { IProductos } from '@/app/types/producto.type';

export interface UseTogglePublicadoOptions {
    onSuccess?: (data: IProductos) => void;
    onError?: (error: Error) => void;
}

export function useTogglePublicado(options: UseTogglePublicadoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => productosService.togglePublicado(id),

        onSuccess: (data, id) => {
            queryClient.setQueryData(productosKeys.detail(id), data);
            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });

            const accion = data.publicado ? 'publicado' : 'despublicado';
            toast.success('Producto actualizado', {
                description: `${data.nombre} fue ${accion}`,
            });
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al cambiar estado publicado', {
                description: getClientErrorMessage(error, 'No pudimos actualizar el producto. Intentá de nuevo.'),
            });
            options.onError?.(error);
        },
    });

    return {
        togglePublicado: mutation.mutate,
        togglePublicadoAsync: mutation.mutateAsync,
        isToggling: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

export interface UseBulkSetPublicadoOptions {
    onSuccess?: (ids: number[], publicado: boolean) => void;
    onError?: (error: Error) => void;
}

export function useBulkSetPublicado(options: UseBulkSetPublicadoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ ids, publicado }: { ids: number[]; publicado: boolean }) =>
            productosService.bulkSetPublicado(ids, publicado),

        onSuccess: (data, { ids, publicado }) => {
            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });

            const accion = publicado ? 'publicados' : 'despublicados';
            toast.success(`Productos ${accion}`, {
                description: `${data.count} producto(s) ${accion} correctamente`,
            });
            options.onSuccess?.(ids, publicado);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar estado publicado', {
                description: getClientErrorMessage(error, 'No pudimos actualizar los productos. Intentá de nuevo.'),
            });
            options.onError?.(error);
        },
    });

    return {
        bulkSetPublicado: mutation.mutate,
        bulkSetPublicadoAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}

export interface UseBulkUpdateCuotasOptions {
    onSuccess?: (ids: number[], cuotas_habilitadas: boolean | null) => void;
    onError?: (error: Error) => void;
}

export function useBulkUpdateCuotas(options: UseBulkUpdateCuotasOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ ids, cuotas_habilitadas }: { ids: number[]; cuotas_habilitadas: boolean | null }) =>
            productosService.bulkUpdateCuotas(ids, cuotas_habilitadas),

        onSuccess: (data, { ids, cuotas_habilitadas }) => {
            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            const config = queryClient.getQueryData<IConfigTienda>(CONFIG_TIENDA_QUERY_KEY);
            const numCuotas =
                config?.cuotas_sin_interes != null
                    ? Math.max(1, Math.trunc(Number(config.cuotas_sin_interes)))
                    : 3;
            const label =
                cuotas_habilitadas === null
                    ? 'regla general'
                    : cuotas_habilitadas
                      ? `${numCuotas} cuotas habilitadas`
                      : `${numCuotas} cuotas deshabilitadas`;
            toast.success('Cuotas actualizadas', {
                description: `${data.updated} producto(s): ${label}`,
            });
            options.onSuccess?.(ids, cuotas_habilitadas);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar cuotas', {
                description: getClientErrorMessage(error, 'No pudimos actualizar las cuotas. Intentá de nuevo.'),
            });
            options.onError?.(error);
        },
    });

    return {
        bulkUpdateCuotas: mutation.mutate,
        bulkUpdateCuotasAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}
