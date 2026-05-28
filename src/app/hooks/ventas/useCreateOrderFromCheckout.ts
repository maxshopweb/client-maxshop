"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';
import { useCheckoutStore } from '@/app/hooks/checkout/useCheckoutStore';
import { useAuth } from '@/app/context/AuthContext';
import { markCheckoutResultAsGuest } from '@/app/utils/checkoutGuestResult';
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
    precio_unitario?: number;
    descuento_aplicado?: number;
  }>;
  observaciones?: string;
  costo_envio?: number; // Costo del envío calculado
  id_direccion?: string; // ID de dirección guardada (opcional)
  tipo_documento?: string;
  numero_documento?: string;
  referencia_facturacion?: string;
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
  const queryClient = useQueryClient();
  const { setIsCreatingOrder, setIsRedirectingToPayment, setWasGuest } = useCheckoutStore();
  const { isGuest } = useAuth();

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
        markCheckoutResultAsGuest();
      }
      
      // Si es Mercado Pago y hay URL de preferencia, redirigir directamente a MP
      const ventaWithMP = venta as IVentaWithMercadoPago;
      const mercadoPagoUrl = ventaWithMP.mercadoPagoPreferenceUrl;
      if (venta.metodo_pago === 'mercadopago' && mercadoPagoUrl) {
        // Mantener overlay y carrito hasta salir de la página; limpiar en /checkout/resultado
        setIsRedirectingToPayment(true);
        window.location.href = mercadoPagoUrl;
        return;
      }
      
      // Para efectivo/transferencia: redirección dura para evitar que la página de
      // checkout (que redirige a "/" si carrito vacío + sin datos) se ejecute antes
      // de completar la navegación. La limpieza de carrito y checkout se hace en la
      // página de resultado al montar.
      const metodo = venta.metodo_pago === 'efectivo' || venta.metodo_pago === 'transferencia'
        ? venta.metodo_pago
        : 'mercadopago';

      const params = new URLSearchParams({
        metodo,
        id_venta: String(venta.id_venta),
      });
      if (venta.cod_interno) params.set('cod_interno', venta.cod_interno);
      if (isGuest) params.set('guest', '1');
      const redirectUrl = `/checkout/resultado?${params.toString()}`;

      options.onSuccess?.(venta);
      setIsCreatingOrder(false);
      window.location.href = redirectUrl;
      return;
    },

    onError: (error: any) => {
      console.error('Error al crear pedido:', error);
      
      // Ocultar loader en caso de error
      setIsCreatingOrder(false);
      setIsRedirectingToPayment(false);

      // Si es un error 401, no hacer nada aquí, el componente lo manejará
      
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

