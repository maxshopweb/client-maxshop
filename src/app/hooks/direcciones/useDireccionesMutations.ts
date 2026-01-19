import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { direccionesService, type IDireccion, type ICreateDireccionDTO } from '@/app/services/direcciones.service';
import { direccionesKeys } from './useDirecciones';

interface UseCreateDireccionOptions {
  onSuccess?: (data: IDireccion) => void;
  onError?: (error: Error) => void;
}

export function useCreateDireccion(options: UseCreateDireccionOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ICreateDireccionDTO) => direccionesService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: direccionesKeys.lists(),
      });
      toast.success('Dirección creada exitosamente');
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('❌ [useCreateDireccion] Error al crear dirección:', error);
      toast.error(error?.message || 'Error al crear la dirección');
      options.onError?.(error);
    },
  });

  return {
    createDireccion: mutation.mutate,
    createDireccionAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

interface UseUpdateDireccionOptions {
  onSuccess?: (data: IDireccion) => void;
  onError?: (error: Error) => void;
}

export function useUpdateDireccion(options: UseUpdateDireccionOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICreateDireccionDTO }) =>
      direccionesService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(direccionesKeys.detail(variables.id), data);
      queryClient.invalidateQueries({
        queryKey: direccionesKeys.lists(),
      });
      toast.success('Dirección actualizada exitosamente');
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('❌ [useUpdateDireccion] Error al actualizar dirección:', error);
      toast.error(error?.message || 'Error al actualizar la dirección');
      options.onError?.(error);
    },
  });

  return {
    updateDireccion: mutation.mutate,
    updateDireccionAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

interface UseDeleteDireccionOptions {
  onSuccess?: (id: string) => void;
  onError?: (error: Error) => void;
}

export function useDeleteDireccion(options: UseDeleteDireccionOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => direccionesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: direccionesKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: direccionesKeys.detail(id),
      });
      toast.success('Dirección eliminada exitosamente');
      options.onSuccess?.(id);
    },
    onError: (error: Error) => {
      console.error('❌ [useDeleteDireccion] Error al eliminar dirección:', error);
      toast.error(error?.message || 'Error al eliminar la dirección');
      options.onError?.(error);
    },
  });

  return {
    deleteDireccion: mutation.mutate,
    deleteDireccionAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

interface UseSetPrincipalOptions {
  onSuccess?: (data: IDireccion) => void;
  onError?: (error: Error) => void;
}

export function useSetPrincipal(options: UseSetPrincipalOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => direccionesService.setPrincipal(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(direccionesKeys.detail(id), data);
      queryClient.invalidateQueries({
        queryKey: direccionesKeys.lists(),
      });
      toast.success('Dirección principal actualizada');
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('❌ [useSetPrincipal] Error al marcar dirección como principal:', error);
      toast.error(error?.message || 'Error al actualizar la dirección principal');
      options.onError?.(error);
    },
  });

  return {
    setPrincipal: mutation.mutate,
    setPrincipalAsync: mutation.mutateAsync,
    isSettingPrincipal: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useDireccionesMutations() {
  const create = useCreateDireccion();
  const update = useUpdateDireccion();
  const deleteDireccion = useDeleteDireccion();
  const setPrincipal = useSetPrincipal();

  return {
    // Create
    createDireccion: create.createDireccion,
    isCreating: create.isCreating,

    // Update
    updateDireccion: update.updateDireccion,
    isUpdating: update.isUpdating,

    // Delete
    deleteDireccion: deleteDireccion.deleteDireccion,
    isDeleting: deleteDireccion.isDeleting,

    // Set Principal
    setPrincipal: setPrincipal.setPrincipal,
    isSettingPrincipal: setPrincipal.isSettingPrincipal,

    // Estados generales
    isLoading:
      create.isCreating ||
      update.isUpdating ||
      deleteDireccion.isDeleting ||
      setPrincipal.isSettingPrincipal,
  };
}

