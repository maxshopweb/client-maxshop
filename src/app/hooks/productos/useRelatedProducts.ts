"use client";

import { useQuery } from '@tanstack/react-query';
import { productosService } from '@/app/services/producto.service';
import { IProductos } from '@/app/types/producto.type';

export function useRelatedProducts(id: number, limit: number = 4) {
  return useQuery({
    queryKey: ['related-products', id, limit],
    queryFn: () => productosService.getRelatedProducts(id, limit),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  });
}

