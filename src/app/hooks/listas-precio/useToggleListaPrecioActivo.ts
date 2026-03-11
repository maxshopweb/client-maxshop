'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listaPrecioService } from '@/app/services/lista-precio.service';
import { listasPrecioKeys } from './useListasPrecio';
import { productosKeys } from '@/app/hooks/productos/useProductos';

export function useToggleListaPrecioActivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      listaPrecioService.toggleActivo(id, activo),
    onSuccess: (data) => {
      toast.success(data.activo ? 'Lista activada' : 'Lista desactivada');
      queryClient.invalidateQueries({ queryKey: listasPrecioKeys.all });
      queryClient.invalidateQueries({ queryKey: productosKeys.contenidoCrear() });
    },
    onError: (e: Error) => toast.error('Error al actualizar lista', { description: e.message }),
  });
}
