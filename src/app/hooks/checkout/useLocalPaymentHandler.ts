"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useCreateOrderFromCheckout } from "@/app/hooks/ventas/useCreateOrderFromCheckout";
import { useAuth } from "@/app/context/AuthContext";
import { IDatosPago } from "@/app/types/cart.type";
import { toast } from "sonner";

interface UseLocalPaymentHandlerOptions {
  formData: Partial<IDatosPago>;
}

export function useLocalPaymentHandler({ formData }: UseLocalPaymentHandlerOptions) {
  const router = useRouter();
  const { items } = useCartStore();
  const { setCurrentStep, personalData, shippingData, costoEnvio, id_direccion } = useCheckoutStore();
  const { user } = useAuth();

  const { createOrder, isCreating } = useCreateOrderFromCheckout({
    onError: (error: any) => {
      console.error('Error al crear pedido:', error);
      toast.error('Error al crear pedido', {
        description: error?.response?.data?.error || error?.message || 'Ocurrió un error al procesar tu pedido',
      });
    },
  });

  const handleConfirmLocalPayment = async () => {
    if (!formData.metodo || (formData.metodo !== 'efectivo' && formData.metodo !== 'transferencia')) {
      toast.error('Método de pago inválido', {
        description: 'Por favor selecciona un método de pago válido',
      });
      return;
    }

    // Validar que hay productos en el carrito
    if (!items || items.length === 0) {
      toast.error('Carrito vacío', {
        description: 'No hay productos en el carrito',
      });
      router.push('/checkout?step=1');
      return;
    }

    // Validar datos personales y de envío
    if (!personalData) {
      toast.error('Datos incompletos', {
        description: 'Por favor completa los datos personales',
      });
      setCurrentStep(2);
      return;
    }

    if (!shippingData) {
      toast.error('Datos incompletos', {
        description: 'Por favor completa los datos de envío',
      });
      setCurrentStep(3);
      return;
    }

    // Preparar datos para crear el pedido
    const detalles = items.map((item) => ({
      id_prod: item.id_prod,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      descuento_aplicado: item.descuento || 0,
    }));

    // Obtener id_cliente si existe (del usuario autenticado)
    const idCliente = user?.uid || undefined;

    // Concatenar teléfono completo (área + número)
    const fullPhone = `${personalData.phoneArea}${personalData.phone}`;

    // Preparar observaciones
    const observaciones = shippingData.tipoEntrega === 'envio' 
      ? `Tel: ${fullPhone}, Dirección: ${shippingData.address}, ${shippingData.city}, ${shippingData.state}, Tipo: ${shippingData.tipoEntrega === 'envio' ? 'Envío' : 'Retiro'}`
      : `Tel: ${fullPhone}, Tipo: Retiro en tienda`;

    // Preparar datos de dirección estructurados para actualizar el cliente (solo si es envío)
    const direccionData = shippingData.tipoEntrega === 'envio' && shippingData.postalCode ? {
      direccion: shippingData.address || '',
      altura: shippingData.altura || '',
      piso: shippingData.piso || undefined,
      dpto: shippingData.dpto || undefined,
      ciudad: shippingData.city || '',
      provincia: shippingData.state || '',
      cod_postal: (() => {
        const parsed = parseInt(shippingData.postalCode!.trim(), 10);
        return isNaN(parsed) ? null : parsed;
      })(),
      telefono: fullPhone,
    } : undefined;

    // Crear el pedido usando el hook correcto
    createOrder({
      id_cliente: idCliente,
      metodo_pago: formData.metodo,
      detalles,
      observaciones,
      id_direccion: id_direccion || undefined,
      direccion: id_direccion ? undefined : direccionData,
      costo_envio: costoEnvio || 0,
    });
  };

  const handleMercadoPago = async () => {
    // TODO: Integrar con Mercado Pago SDK
    // Por ahora, mostrar mensaje
    toast.info('Mercado Pago', {
      description: 'La integración con Mercado Pago se implementará próximamente',
    });
  };

  return {
    handleConfirmLocalPayment,
    handleMercadoPago,
    isCreating,
  };
}

