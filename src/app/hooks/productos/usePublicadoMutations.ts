/**
 * Hooks para mutaciones de estado "publicado" de productos.
 * Una sola responsabilidad: publicar / despublicar (toggle y bulk).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productosService } from '@/app/services/producto.service';
import { productosKeys } from './useProductos';
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
                description: error.message || 'Ocurrió un error inesperado',
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
                description: error.message || 'Ocurrió un error inesperado',
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
