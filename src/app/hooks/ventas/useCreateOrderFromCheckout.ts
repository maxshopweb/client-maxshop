"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';
import { useCartStore } from '@/app/stores/cartStore';
import { useCheckoutStore } from '@/app/hooks/checkout/useCheckoutStore';
import { useAuth } from '@/app/context/AuthContext';
import type { IVenta } from '@/app/types/ventas.type';

interface IVentaWithMercadoPago extends IVenta {
  mercadoPagoPreferenceUrl?: string | null;
}

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
  costo_envio?: number; // Costo del envío calculado
  id_direccion?: string; // ID de dirección guardada (opcional)
  // Datos de dirección para actualizar el cliente (si no se usa id_direccion)
  direccion?: {
    direccion?: string;
    altura?: string;
    piso?: string;
    dpto?: string;
    ciudad?: string;
    provincia?: string;
    cod_postal?: number | null;
    telefono?: string;
  };
}

interface UseCreateOrderFromCheckoutOptions {
  onSuccess?: (venta: IVentaWithMercadoPago) => void;
  onError?: (error: Error) => void;
}

export function useCreateOrderFromCheckout(options: UseCreateOrderFromCheckoutOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  const { resetCheckout, setIsCreatingOrder, setWasGuest } = useCheckoutStore();
  const { isGuest, logout } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: CreateOrderFromCheckoutData) => {
      setIsCreatingOrder(true);
      try {
        return await ventasService.createFromCheckout(data);
      } catch (error) {
        setIsCreatingOrder(false);
        throw error;
      }
    },

    onSuccess: async (venta) => {
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ventasKeys.lists(),
      });

      // Guardar si el usuario era invitado ANTES de cerrar la sesión
      // Esto permite que la página de resultado sepa que era invitado
      if (isGuest) {
        setWasGuest(true);
      }
      
      // Si es Mercado Pago y hay URL de preferencia, redirigir directamente a MP
      const ventaWithMP = venta as IVentaWithMercadoPago;
      const mercadoPagoUrl = ventaWithMP.mercadoPagoPreferenceUrl;
      if (venta.metodo_pago === 'mercadopago' && mercadoPagoUrl) {
        // Limpiar carrito antes de redirigir
        clearCart();
        
        // Ocultar loader
        setIsCreatingOrder(false);
        
        // Redirigir a Mercado Pago
        window.location.href = mercadoPagoUrl;
        return; // Salir temprano, no ejecutar el resto del código
      }
      
      // Para otros métodos de pago, redirigir a la página de resultado
      const metodo = venta.metodo_pago === 'efectivo' || venta.metodo_pago === 'transferencia' 
        ? venta.metodo_pago 
        : 'mercadopago';
      
      const redirectUrl = `/checkout/resultado?metodo=${metodo}&id_venta=${venta.id_venta}`;
      
      // Navegar primero y esperar a que se complete
      await router.push(redirectUrl);
      
      // Esperar un momento adicional para asegurar que la navegación se complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Limpiar carrito DESPUÉS de navegar
      clearCart();
      
      // Si el usuario es invitado, cerrar sesión silenciosamente después del checkout
      // (sin mostrar el toast de "Sesión cerrada correctamente")
      // NOTA: No resetear checkout aquí para mantener wasGuest disponible en la página de resultado
      if (isGuest) {
        await logout(true); // silent = true para no mostrar toast
      }
      
      // Resetear checkout DESPUÉS de cerrar sesión, pero mantener wasGuest
      // para que la página de resultado pueda usarlo
      const wasGuestValue = useCheckoutStore.getState().wasGuest;
      resetCheckout();
      if (wasGuestValue) {
        setWasGuest(true);
      }
      
      // Ocultar el loader después de que todo se haya limpiado
      setTimeout(() => {
        setIsCreatingOrder(false);
      }, 300);

      // Callback personalizado
      options.onSuccess?.(venta);
    },

    onError: (error: any) => {
      console.error('Error al crear pedido:', error);
      
      // Ocultar loader en caso de error
      setIsCreatingOrder(false);
      
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

