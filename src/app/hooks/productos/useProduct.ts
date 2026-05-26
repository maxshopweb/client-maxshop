"use client";

import { useQuery } from '@tanstack/react-query';
import { productosService } from '@/app/services/producto.service';
import { IProductos } from '@/app/types/producto.type';

interface UseProductOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export function useProduct(id: number, options: UseProductOptions = {}) {
  const { enabled = true, refetchOnMount = true } = options;

  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productosService.getById(id),
    enabled: enabled && !!id,
    refetchOnMount,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}

