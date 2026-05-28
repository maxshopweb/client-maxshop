//! Hooks para mutaciones (create, update, delete) de ventas

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';
import { dashboardKeys } from '@/app/hooks/dashboard/dashboardKeys';
import type {
    IVenta,
    ICreateVentaDTO,
    IUpdateVentaDTO,
    IUpdateEnvioDTO,
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

/**
 * Aprobar una venta que está en estado vencido (revocación de vencimiento).
 * Descuenta stock, ejecuta handlers y envía email de confirmación.
 */
interface UseAprobarDesdeVencidoOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useAprobarDesdeVencido(options: UseAprobarDesdeVencidoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => ventasService.aprobarDesdeVencido(id),

        onSuccess: (data, id) => {
            queryClient.setQueryData(ventasKeys.detail(id), data);
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists(),
            });

            toast.success('Venta aprobada', {
                description: `Venta #${data.id_venta} aprobada desde vencida. Stock descontado y email enviado.`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al aprobar venta vencida', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        aprobarDesdeVencido: mutation.mutate,
        aprobarDesdeVencidoAsync: mutation.mutateAsync,
        isAprobando: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
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

interface UseUpdateEnvioOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useUpdateEnvio(options: UseUpdateEnvioOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IUpdateEnvioDTO }) =>
            ventasService.updateEnvio(id, data),

        onSuccess: (data, variables) => {
            queryClient.setQueryData(ventasKeys.detail(variables.id), data);
            queryClient.invalidateQueries({
                queryKey: ventasKeys.lists(),
            });

            toast.success('Seguimiento actualizado', {
                description: `Venta #${data.id_venta} actualizada correctamente`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar seguimiento', {
                description: error.message || 'Ocurrió un error inesperado',
            });
            options.onError?.(error);
        },
    });

    return {
        updateEnvio: mutation.mutate,
        updateEnvioAsync: mutation.mutateAsync,
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

function invalidateVentaAndAlerts(queryClient: ReturnType<typeof useQueryClient>, id?: number) {
    queryClient.invalidateQueries({ queryKey: ventasKeys.lists() });
    queryClient.invalidateQueries({ queryKey: dashboardKeys.alerts() });
    if (id != null) {
        queryClient.invalidateQueries({ queryKey: ventasKeys.detail(id) });
    }
}

interface UseCancelarVentaOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useCancelarVenta(options: UseCancelarVentaOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, motivo }: { id: number; motivo?: string }) =>
            ventasService.cancelar(id, { motivo }),

        onSuccess: (data, { id }) => {
            queryClient.removeQueries({ queryKey: ventasKeys.detail(id) });
            invalidateVentaAndAlerts(queryClient);
            toast.success('Venta cancelada', {
                description: `Pedido #${data.id_venta} dado de baja`,
            });
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al cancelar venta', {
                description: error.message || 'Ocurrió un error inesperado',
            });
            options.onError?.(error);
        },
    });

    return {
        cancelarVenta: mutation.mutate,
        cancelarVentaAsync: mutation.mutateAsync,
        isCancelling: mutation.isPending,
    };
}

interface UseNotificarListoRetiroOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useNotificarListoRetiro(options: UseNotificarListoRetiroOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, mensaje }: { id: number; mensaje?: string }) =>
            ventasService.notificarListoRetiro(id, { mensaje }),

        onSuccess: (data, { id }) => {
            queryClient.setQueryData(ventasKeys.detail(id), data);
            invalidateVentaAndAlerts(queryClient);
            toast.success('Aviso enviado', {
                description: 'El cliente recibió el email de listo para retirar',
            });
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al avisar retiro', {
                description: error.message || 'Ocurrió un error inesperado',
            });
            options.onError?.(error);
        },
    });

    return {
        notificarListoRetiro: mutation.mutate,
        notificarListoRetiroAsync: mutation.mutateAsync,
        isNotificando: mutation.isPending,
    };
}

interface UseMarcarRetiradoOptions {
    onSuccess?: (data: IVenta) => void;
    onError?: (error: Error) => void;
}

export function useMarcarRetirado(options: UseMarcarRetiradoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => ventasService.marcarRetirado(id),

        onSuccess: (data, id) => {
            queryClient.setQueryData(ventasKeys.detail(id), data);
            invalidateVentaAndAlerts(queryClient);
            toast.success('Pedido retirado', {
                description: 'Se marcó como retirado en tienda',
            });
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al marcar retirado', {
                description: error.message || 'Ocurrió un error inesperado',
            });
            options.onError?.(error);
        },
    });

    return {
        marcarRetirado: mutation.mutate,
        marcarRetiradoAsync: mutation.mutateAsync,
        isMarcandoRetirado: mutation.isPending,
    };
}

