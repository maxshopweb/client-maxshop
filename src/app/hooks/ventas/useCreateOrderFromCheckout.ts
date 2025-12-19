"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';
import { useCartStore } from '@/app/stores/cartStore';
import { useCheckoutStore } from '@/app/checkout/hooks/useCheckoutStore';
import type { IVenta } from '@/app/types/ventas.type';

interface CreateOrderFromCheckoutData {
  id_cliente?: string;
  metodo_pago: string;
  detalles: Array<{
    id_prod: number;
    cantidad: number;
    precio_unitario: number;
    descuento_aplicado?: number;
  }>;
  observaciones?: string;
}

interface UseCreateOrderFromCheckoutOptions {
  onSuccess?: (venta: IVenta) => void;
  onError?: (error: Error) => void;
}

export function useCreateOrderFromCheckout(options: UseCreateOrderFromCheckoutOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  const { resetCheckout } = useCheckoutStore();

  const mutation = useMutation({
    mutationFn: (data: CreateOrderFromCheckoutData) => ventasService.createFromCheckout(data),

    onSuccess: (venta) => {
      console.log('✅ [useCreateOrderFromCheckout] Pedido creado exitosamente:', venta);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ventasKeys.lists(),
      });

      // Limpiar carrito y checkout después de crear el pedido exitosamente
      clearCart();
      resetCheckout();

      // Redirigir a la página de resultado
      const metodo = venta.metodo_pago === 'efectivo' || venta.metodo_pago === 'transferencia' 
        ? venta.metodo_pago 
        : 'mercadopago';
      
      const redirectUrl = `/checkout/resultado?metodo=${metodo}&id_venta=${venta.id_venta}`;
      console.log('🔄 [useCreateOrderFromCheckout] Redirigiendo a:', redirectUrl);
      
      // Usar window.location para asegurar la redirección
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }

      // Callback personalizado
      options.onSuccess?.(venta);
    },

    onError: (error: any) => {
      console.error('Error al crear pedido:', error);
      
      // Si es un error 401, no hacer nada aquí, el componente lo manejará
      // para poder mostrar un mensaje apropiado antes de redirigir
      
      // Callback personalizado
      options.onError?.(error);
    },
  });

  return {
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

