"use client";

import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/app/lib/axios';
import { useCartStore } from '@/app/stores/cartStore';

interface CotizarEnvioParams {
  codigoPostal: string;
  ciudad?: string;
  provincia?: string;
}

interface CotizacionResponse {
  precio: number;
  moneda: string;
  tarifaConIva?: {
    seguroDistribucion: string;
    distribucion: string;
    total: string;
  };
}

export function useCotizarEnvio() {
  const { items } = useCartStore();

  return useMutation({
    mutationKey: ['cotizarEnvio'],
    mutationFn: async (params: CotizarEnvioParams): Promise<CotizacionResponse> => {
      // Validar que hay productos
      if (!items || items.length === 0) {
        throw new Error('No hay productos en el carrito para cotizar envío');
      }

      // Calcular volumen aproximado (mismo cálculo que en backend)
      // Por defecto: 30cm x 20cm x 10cm = 6000 cm3 por bulto
      const volumenPorBulto = 30 * 20 * 10; // 6000 cm3
      const cantidadTotal = items.reduce((sum, item) => sum + (item.cantidad || 1), 0);
      const volumenTotal = volumenPorBulto * cantidadTotal;
      
      // Peso aproximado: 1kg por producto
      const pesoTotal = cantidadTotal;
      
      // Calcular subtotal para valor declarado
      const subtotal = items.reduce((sum, item) => {
        return sum + ((item.precio_unitario || 0) * (item.cantidad || 1));
      }, 0);
      
      // Determinar contrato (domicilio siempre por ahora)
      // Usar variable de entorno o default
      const contrato = process.env.NEXT_PUBLIC_ANDREANI_CONTRATO_DOM || '400006709';
      
      // Cliente code desde variable de entorno o default
      const cliente = process.env.NEXT_PUBLIC_ANDREANI_CLIENT_CODE || '';
      
      if (!cliente || cliente.trim() === '') {
        console.error('⚠️ [useCotizarEnvio] NEXT_PUBLIC_ANDREANI_CLIENT_CODE no está configurado');
        console.error('⚠️ [useCotizarEnvio] Variables de entorno disponibles:', {
          NEXT_PUBLIC_ANDREANI_CLIENT_CODE: process.env.NEXT_PUBLIC_ANDREANI_CLIENT_CODE,
          NEXT_PUBLIC_ANDREANI_CONTRATO_DOM: process.env.NEXT_PUBLIC_ANDREANI_CONTRATO_DOM,
        });
        throw new Error('NEXT_PUBLIC_ANDREANI_CLIENT_CODE no está configurado. Verifica tu archivo .env.local');
      }

      const response = await axiosInstance.post<{
        success: boolean;
        data: CotizacionResponse;
        error?: string;
      }>('/andreani/envios/cotizar', {
        cpDestino: params.codigoPostal,
        contrato: contrato,
        cliente: cliente,
        volumen: String(volumenTotal),
        kilos: String(Math.max(pesoTotal, 1)),
        valorDeclarado: String(subtotal),
        altoCm: '10',
        largoCm: '30',
        anchoCm: '20',
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Error al cotizar envío');
      }

      return response.data.data;
    },
  });
}

