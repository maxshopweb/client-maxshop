"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCreateOrderFromCheckout } from "@/app/hooks/ventas/useCreateOrderFromCheckout";
import { useCheckoutFlowGuard } from "@/app/hooks/checkout/useCheckoutFlowGuard";
import { Button } from "@/app/components/ui/Button";
import { LogIn, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MetodoPagoMercadoPago } from "@/app/components/modals/Venta/MetodoPagoMercadoPago";
import { MetodoPagoEfectivo } from "@/app/components/modals/Venta/MetodoPagoEfectivo";
import { MetodoPagoTransferencia } from "@/app/components/modals/Venta/MetodoPagoTransferencia";

export default function Step3PaymentConfirmation() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, setCurrentStep, personalData, shippingData, costoEnvio, id_direccion } = useCheckoutStore();
  // Mantener compatibilidad temporal
  const contactData = personalData as any;
  const { user, isAuthenticated } = useAuth();
  const { items } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(paymentMethod);

  // Validar acceso al flujo (Step 4 requiere Step 3 completado)
  const guard = useCheckoutFlowGuard({ 
    requiredStep: 4,
    redirectOnFail: false // Manejar redirección manualmente para mejor UX
  });

  const { createOrder, isCreating } = useCreateOrderFromCheckout({
    onError: (error: any) => {
      // Manejar error 401 (no autenticado)
      if (error?.response?.status === 401 || error?.message?.includes('401')) {
        toast.error('Sesión expirada', {
          description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        });
        setTimeout(() => {
          router.push(`/login?redirect=${encodeURIComponent("/checkout?step=4")}`);
        }, 2000);
        return;
      }

      // Otros errores
      toast.error('Error al crear pedido', {
        description: error?.response?.data?.error || error?.message || 'Ocurrió un error al procesar tu pedido',
      });
    },
  });

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
  };

  const handleMercadoPago = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    // TODO: Integrar con Mercado Pago SDK
    // Aquí iría la lógica de Mercado Pago
    // router.push(mercadoPagoUrl);
  };

  const handleConfirmOrder = async () => {
    // Validar método de pago
    if (!selectedMethod) {
      toast.error('Método de pago requerido', {
        description: 'Por favor selecciona un método de pago',
      });
      return;
    }

    // Validar acceso (el guard ya valida auth, cart y step 2)
    if (!guard.isValid) {
      if (guard.reason === 'no-auth') {
        router.push(guard.redirectTo || '/login');
        return;
      }
      if (guard.reason === 'no-cart') {
        toast.error('Carrito vacío', {
          description: 'No hay productos en el carrito',
        });
        router.push(guard.redirectTo || '/');
        return;
      }
      if (guard.reason === 'no-step2') {
        toast.error('Datos incompletos', {
          description: 'Por favor completa los datos de contacto',
        });
        router.push(guard.redirectTo || '/checkout?step=2');
        return;
      }
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
    // El id_cliente en la BD es el id_usuario (uid de Firebase)
    // Si el usuario está autenticado, usar su uid, sino usar null (se creará como cliente nuevo)
    const idCliente = user?.uid || undefined;

    // Validar que personalData y shippingData existen
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

    // Concatenar teléfono completo (área + número)
    const fullPhone = `${personalData.phoneArea}${personalData.phone}`;

    // Preparar observaciones (solo si es envío)
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

    // Crear el pedido
    createOrder({
      id_cliente: idCliente,
      metodo_pago: selectedMethod,
      detalles,
      observaciones, // Mantener por compatibilidad
      id_direccion: id_direccion || undefined, // ID de dirección guardada (si se seleccionó una)
      direccion: id_direccion ? undefined : direccionData, // Solo usar direccionData si no hay id_direccion
      costo_envio: costoEnvio || 0, // Incluir costo de envío
      // Datos de documento del cliente
      tipo_documento: personalData.tipoDocumento || undefined,
      numero_documento: personalData.documento || undefined,
    });
  };


  // Mostrar estados según validación del guard
  // El guard maneja el loading de auth internamente
  if (!guard.isValid) {
    // Mostrar UI apropiada según el motivo
    if (guard.reason === 'no-auth') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-6"
        >
          <div className="space-y-4">
            <LogIn className="w-16 h-16 mx-auto text-foreground/30" />
            <h3 className="text-xl font-bold text-foreground/90">
              Inicia sesión para continuar
            </h3>
            <p className="text-foreground/60">
              Necesitas estar autenticado para confirmar tu pedido
            </p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => router.push(guard.redirectTo || '/login')} 
            className="rounded-lg"
          >
            Iniciar Sesión
          </Button>
        </motion.div>
      );
    }

    // Para otros errores, mostrar mensaje genérico o redirigir
    return null; // El guard redirigirá automáticamente
  }

  return (
    <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-foreground/90 mb-6">Método de pago</h2>

        {/* Botón de Mercado Pago */}
        <MetodoPagoMercadoPago isSelected={selectedMethod === 'mercadopago'} onClick={() => handleSelectMethod('mercadopago')} />

        {/* Separador */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-foreground/60">O</span>
          </div>
        </div>

        {/* Botones Efectivo y Transferencia */}
        <div className="flex gap-4">
          <MetodoPagoEfectivo isSelected={selectedMethod === 'efectivo'} onClick={() => handleSelectMethod('efectivo')} />
          <MetodoPagoTransferencia isSelected={selectedMethod === 'transferencia'} onClick={() => handleSelectMethod('transferencia')} />
        </div>

        {/* Botones */}
        <div className="pt-4 flex gap-4">
          <Button
            variant="outline-primary"
            size="lg"
            onClick={() => setCurrentStep(3)}
            className="rounded-lg flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirmOrder}
            disabled={!selectedMethod || isCreating}
            className="rounded-lg flex-1"
          >
            {isCreating ? "Procesando..." : "Confirmar pedido"}
          </Button>
        </div>
      </motion.div>
  );
}

