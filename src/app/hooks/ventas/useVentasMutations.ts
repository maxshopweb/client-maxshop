//! Hooks para mutaciones (create, update, delete) de ventas

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';
import type {
    IVenta,
    ICreateVentaDTO,
    IUpdateVentaDTO
} from '@/app/types/ventas.type';
import { EstadoPago, EstadoEnvio } from '@/app/types/estados.type';

interface UseCreateVentaOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useCreateVenta(options: UseCreateVentaOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ICreateVentaDTO) => ventasService.create(data),

        onSuccess: (data) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            // Toast de éxito
            toast.success('Venta creada exitosamente', {
                description: `Venta #${data.id_venta} fue creada correctamente`,
            });

            // Callback personalizado
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            // Toast de error
            toast.error('Error al crear venta', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            // Callback personalizado
            options.onError?.(error);
        },
    });

    return {
        createVenta: mutation.mutate,
        createVentaAsync: mutation.mutateAsync,
        isCreating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseUpdateVentaOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useUpdateVenta(options: UseUpdateVentaOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IUpdateVentaDTO }) =>
            ventasService.update(id, data),

        onSuccess: (data, variables) => {
            // Actualizar cache del detalle
            queryClient.setQueryData(ventasKeys.detail(variables.id), data);

            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            // Toast de éxito
            toast.success('Venta actualizada', {
                description: `Venta #${data.id_venta} fue actualizada correctamente`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar venta', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        updateVenta: mutation.mutate,
        updateVentaAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseDeleteVentaOptions {
    onSuccess?: (id: number) => void;
    onError?: (error: Error) => void;
}

export function useDeleteVenta(options: UseDeleteVentaOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => ventasService.delete(id),

        onSuccess: (_, id) => {
            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            // Remover del cache el detalle
            queryClient.removeQueries({
                queryKey: ventasKeys.detail(id)
            });

            // Toast de éxito
            toast.success('Venta dada de baja', {
                description: 'La venta fue marcada como cancelada',
            });

            options.onSuccess?.(id);
        },

        onError: (error: Error) => {
            toast.error('Error al dar de baja venta', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        deleteVenta: mutation.mutate,
        deleteVentaAsync: mutation.mutateAsync,
        isDeleting: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseUpdateEstadoPagoOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useUpdateEstadoPago(options: UseUpdateEstadoPagoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: EstadoPago }) =>
            ventasService.updateEstadoPago(id, estado),

        onSuccess: (data, variables) => {
            // Actualizar cache del detalle
            queryClient.setQueryData(ventasKeys.detail(variables.id), data);

            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            toast.success('Estado de pago actualizado', {
                description: `Estado actualizado a: ${data.estado_pago}`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar estado de pago', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        updateEstadoPago: mutation.mutate,
        updateEstadoPagoAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}

interface UseUpdateEstadoEnvioOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useUpdateEstadoEnvio(options: UseUpdateEstadoEnvioOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: EstadoEnvio }) =>
            ventasService.updateEstadoEnvio(id, estado),

        onSuccess: (data, variables) => {
            // Actualizar cache del detalle
            queryClient.setQueryData(ventasKeys.detail(variables.id), data);

            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            toast.success('Estado de envío actualizado', {
                description: `Estado actualizado a: ${data.estado_envio}`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar estado de envío', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        updateEstadoEnvio: mutation.mutate,
        updateEstadoEnvioAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}

interface UseBulkDeleteOptions {
    onSuccess?: (ids: number[]) => void;
    onError?: (error: Error) => void;
}

export function useBulkDeleteVentas(options: UseBulkDeleteOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids: number[]) => ventasService.deleteMultiple(ids),

        onSuccess: (_, ids) => {
            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists()
            });

            // Remover detalles del cache
            ids.forEach(id => {
                queryClient.removeQueries({
                    queryKey: ventasKeys.detail(id)
                });
            });

            toast.success('Ventas dadas de baja', {
                description: `${ids.length} venta(s) marcada(s) como cancelada(s)`,
            });

            options.onSuccess?.(ids);
        },

        onError: (error: Error) => {
            toast.error('Error al dar de baja ventas', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        bulkDelete: mutation.mutate,
        bulkDeleteAsync: mutation.mutateAsync,
        isDeleting: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}

