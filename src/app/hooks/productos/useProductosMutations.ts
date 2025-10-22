//! Hooks para mutaciones (create, update, delete) de productos

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productosService } from '@/app/services/producto.service';
import { productosKeys } from './useProductos';
import type {
    IProductos,
    ICreateProductoDTO,
    IUpdateProductoDTO
} from '@/app/types/producto.type';
import { EstadoGeneral } from '@/app/types/estados.type';


interface UseCreateProductoOptions {
    onSuccess?: (data: IProductos) => void;
    onError?: (error: Error) => void;
}

export function useCreateProducto(options: UseCreateProductoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ICreateProductoDTO) => productosService.create(data),

        onSuccess: (data) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });

            // Toast de éxito
            toast.success('Producto creado exitosamente', {
                description: `${data.nombre} fue agregado al catálogo`,
            });

            // Callback personalizado
            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            // Toast de error
            toast.error('Error al crear producto', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            // Callback personalizado
            options.onError?.(error);
        },
    });

    return {
        createProducto: mutation.mutate,
        createProductoAsync: mutation.mutateAsync,
        isCreating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseUpdateProductoOptions {
    onSuccess?: (data: IProductos) => void;
    onError?: (error: Error) => void;
    optimistic?: boolean; // Para optimistic updates
}

export function useUpdateProducto(options: UseUpdateProductoOptions = {}) {
    const queryClient = useQueryClient();
    const { optimistic = false } = options;

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IUpdateProductoDTO }) =>
            productosService.update(id, data),

        // Optimistic update (opcional)
        onMutate: async ({ id, data }) => {
            if (!optimistic) return;

            // Cancelar queries en curso
            await queryClient.cancelQueries({
                queryKey: productosKeys.detail(id)
            });

            // Snapshot del valor anterior
            const previousProducto = queryClient.getQueryData<IProductos>(
                productosKeys.detail(id)
            );

            // Actualizar optimísticamente
            if (previousProducto) {
                queryClient.setQueryData<IProductos>(
                    productosKeys.detail(id),
                    { ...previousProducto, ...data }
                );
            }

            // Retornar contexto para rollback
            return { previousProducto };
        },

        onSuccess: (data, variables) => {
            // Actualizar cache del detalle
            queryClient.setQueryData(productosKeys.detail(variables.id), data);

            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });

            // Toast de éxito
            toast.success('Producto actualizado', {
                description: `${data.nombre} fue actualizado correctamente`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error, variables, context) => {
            // Rollback en caso de error (si es optimistic)
            if (optimistic && context?.previousProducto) {
                queryClient.setQueryData(
                    productosKeys.detail(variables.id),
                    context.previousProducto
                );
            }

            toast.error('Error al actualizar producto', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        updateProducto: mutation.mutate,
        updateProductoAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseDeleteProductoOptions {
    onSuccess?: (id: number) => void;
    onError?: (error: Error) => void;
}

export function useDeleteProducto(options: UseDeleteProductoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => productosService.delete(id),

        onSuccess: (_, id) => {
            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });

            // Remover del cache el detalle
            queryClient.removeQueries({
                queryKey: productosKeys.detail(id)
            });

            // Toast de éxito
            toast.success('Producto eliminado', {
                description: 'El producto fue eliminado correctamente',
            });

            options.onSuccess?.(id);
        },

        onError: (error: Error) => {
            toast.error('Error al eliminar producto', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        deleteProducto: mutation.mutate,
        deleteProductoAsync: mutation.mutateAsync,
        isDeleting: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

interface UseUpdateStockOptions {
    onSuccess?: (data: IProductos) => void;
    onError?: (error: Error) => void;
}

export function useUpdateStockProducto(options: UseUpdateStockOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, cantidad }: { id: number; cantidad: number }) =>
            productosService.updateStock(id, cantidad),

        onSuccess: (data, variables) => {
            // Actualizar cache del detalle
            queryClient.setQueryData(productosKeys.detail(variables.id), data);

            // Invalidar listas y stock bajo
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: productosKeys.stockBajo()
            });

            toast.success('Stock actualizado', {
                description: `Nuevo stock: ${data.stock} unidades`,
            });

            options.onSuccess?.(data);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar stock', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        updateStock: mutation.mutate,
        updateStockAsync: mutation.mutateAsync,
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

export function useBulkDeleteProductos(options: UseBulkDeleteOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids: number[]) => productosService.deleteMultiple(ids),

        onSuccess: (_, ids) => {
            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });

            // Remover detalles del cache
            ids.forEach(id => {
                queryClient.removeQueries({
                    queryKey: productosKeys.detail(id)
                });
            });

            toast.success('Productos eliminados', {
                description: `${ids.length} producto(s) eliminado(s) correctamente`,
            });

            options.onSuccess?.(ids);
        },

        onError: (error: Error) => {
            toast.error('Error al eliminar productos', {
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

interface UseBulkUpdateEstadoOptions {
    onSuccess?: (ids: number[]) => void;
    onError?: (error: Error) => void;
}

export function useBulkUpdateEstado(options: UseBulkUpdateEstadoOptions = {}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ ids, estado }: { ids: number[]; estado: EstadoGeneral }) =>
            productosService.updateEstadoMultiple(ids, estado),

        onSuccess: (_, { ids, estado }) => {
            // Invalidar listas
            queryClient.invalidateQueries({
                queryKey: productosKeys.lists()
            });

            const accion = estado === 1 ? 'activados' : 'desactivados';

            toast.success(`Productos ${accion}`, {
                description: `${ids.length} producto(s) ${accion} correctamente`,
            });

            options.onSuccess?.(ids);
        },

        onError: (error: Error) => {
            toast.error('Error al actualizar estado', {
                description: error.message || 'Ocurrió un error inesperado',
            });

            options.onError?.(error);
        },
    });

    return {
        bulkUpdateEstado: mutation.mutate,
        bulkUpdateEstadoAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}

export function useProductosMutations() {
    const create = useCreateProducto();
    const update = useUpdateProducto();
    const deleteProducto = useDeleteProducto();
    const updateStock = useUpdateStockProducto();
    const bulkDelete = useBulkDeleteProductos();
    const bulkUpdateEstado = useBulkUpdateEstado();

    return {
        // Create
        createProducto: create.createProducto,
        isCreating: create.isCreating,

        // Update
        updateProducto: update.updateProducto,
        isUpdating: update.isUpdating,

        // Delete
        deleteProducto: deleteProducto.deleteProducto,
        isDeleting: deleteProducto.isDeleting,

        // Stock
        updateStock: updateStock.updateStock,
        isUpdatingStock: updateStock.isUpdating,

        // Bulk
        bulkDelete: bulkDelete.bulkDelete,
        isBulkDeleting: bulkDelete.isDeleting,

        bulkUpdateEstado: bulkUpdateEstado.bulkUpdateEstado,
        isBulkUpdatingEstado: bulkUpdateEstado.isUpdating,

        // Estados generales
        isLoading:
            create.isCreating ||
            update.isUpdating ||
            deleteProducto.isDeleting ||
            updateStock.isUpdating ||
            bulkDelete.isDeleting ||
            bulkUpdateEstado.isUpdating
    };
}