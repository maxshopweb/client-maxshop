'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { marcaService } from '@/app/services/marca.service';
import { categoriaService } from '@/app/services/categoria.service';
import { grupoService } from '@/app/services/grupo.service';
import type { IUpdateMarcaDTO } from '@/app/types/marca.type';
import type { IUpdateCategoriaDTO } from '@/app/types/categoria.type';
import type { IUpdateGrupoDTO } from '@/app/types/grupo.type';

function getErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { error?: string } }; message?: string };
  return err.response?.data?.error ?? err.message ?? 'Error desconocido';
}

// ========================================
// UPDATE
// ========================================

export function useUpdateMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateMarcaDTO }) =>
      marcaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marca actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar marca', { description: error.message });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateCategoriaDTO }) =>
      categoriaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoría actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar categoría', { description: error.message });
    },
  });
}

export function useUpdateGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateGrupoDTO }) =>
      grupoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar grupo', { description: error.message });
    },
  });
}

// ========================================
// DELETE
// ========================================

export function useDeleteMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => marcaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marca eliminada exitosamente');
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      if (msg.includes('producto(s) asociado(s)')) {
        toast.error('No se puede eliminar', {
          description: 'Esta marca tiene productos vinculados. Elimine o cambie los productos primero.',
        });
      } else {
        toast.error('Error al eliminar marca', { description: msg });
      }
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoría eliminada exitosamente');
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      if (msg.includes('producto(s) asociado(s)')) {
        toast.error('No se puede eliminar', {
          description: 'Esta categoría tiene productos vinculados. Elimine o cambie los productos primero.',
        });
      } else {
        toast.error('Error al eliminar categoría', { description: msg });
      }
    },
  });
}

export function useDeleteGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => grupoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      if (msg.includes('producto(s) asociado(s)')) {
        toast.error('No se puede eliminar', {
          description: 'Este grupo tiene productos vinculados. Elimine o cambie los productos primero.',
        });
      } else {
        toast.error('Error al eliminar grupo', { description: msg });
      }
    },
  });
}
