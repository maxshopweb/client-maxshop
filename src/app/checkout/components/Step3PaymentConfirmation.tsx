"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCreateOrderFromCheckout } from "@/app/hooks/ventas/useCreateOrderFromCheckout";
import { Button } from "@/app/components/ui/Button";
import MercadoPagoLogo from "@/app/components/icons/MercadoPagoLogo";
import { Banknote, Smartphone, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Step3PaymentConfirmation() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, completeStep, resetCheckout, setCurrentStep, cartItems, contactData } = useCheckoutStore();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { items } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(paymentMethod);
  
  const { createOrder, isCreating, error: createError } = useCreateOrderFromCheckout({
    onError: (error: any) => {
      // Manejar error 401 (no autenticado)
      if (error?.response?.status === 401 || error?.message?.includes('401')) {
        toast.error('Sesión expirada', {
          description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        });
        // Redirigir al login después de un breve delay para que el usuario vea el mensaje
        setTimeout(() => {
          router.push(`/login?redirect=${encodeURIComponent("/checkout?step=3")}`);
        }, 2000);
        return;
      }
      
      // Otros errores
      toast.error('Error al crear pedido', {
        description: error?.response?.data?.error || error?.message || 'Ocurrió un error al procesar tu pedido',
      });
    },
  });

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // No redirigir automáticamente, mostrar mensaje
    }
  }, [isAuthenticated, authLoading]);

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
    console.log("Iniciando pago con Mercado Pago...");
    // Aquí iría la lógica de Mercado Pago
    // router.push(mercadoPagoUrl);
  };

  const handleConfirmOrder = async () => {
    if (!selectedMethod) {
      toast.error('Método de pago requerido', {
        description: 'Por favor selecciona un método de pago',
      });
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    // Validar que haya items en el carrito
    if (!items || items.length === 0) {
      toast.error('Carrito vacío', {
        description: 'No hay productos en el carrito',
      });
      return;
    }

    // Validar datos de contacto
    if (!contactData) {
      toast.error('Datos incompletos', {
        description: 'Por favor completa los datos de contacto',
      });
      setCurrentStep(2);
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

    // Crear observaciones con datos de contacto (sin email, ya está en el usuario)
    const observaciones = `Tel: ${contactData.phone}, Dirección: ${contactData.address}, ${contactData.city}, ${contactData.state}`;

    // Crear el pedido
    createOrder({
      id_cliente: idCliente,
      metodo_pago: selectedMethod,
      detalles,
      observaciones,
    });
  };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
  };

  // Mostrar loading mientras verifica auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje y botón de login
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className="space-y-4">
          <LogIn className="w-16 h-16 mx-auto text-foreground/30" />
          <h3 className="text-xl font-bold text-foreground">
            Inicia sesión para continuar
          </h3>
          <p className="text-foreground/60">
            Necesitas estar autenticado para confirmar tu pedido
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={handleLogin} className="rounded-lg">
          Iniciar Sesión
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Método de pago</h2>

      {/* Botón de Mercado Pago */}
      <div className="mb-6">
        <motion.button
          onClick={handleMercadoPago}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-xl border-2 transition-all duration-300"
          style={{
            backgroundColor: "var(--white)",
            borderColor: "var(--principal)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6" style={{ color: "var(--principal)" }}>
              <MercadoPagoLogo className="w-full h-full" />
            </div>
            <span className="text-lg font-semibold" style={{ color: "var(--principal)" }}>
              Pagar con Mercado Pago
            </span>
          </div>
        </motion.button>
        <p className="text-xs text-foreground/60 mt-2 text-center">
          Pagá con tarjeta, dinero en cuenta o en efectivo
        </p>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Botón Efectivo */}
        <motion.button
          onClick={() => handleSelectMethod('efectivo')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            selectedMethod === 'efectivo'
              ? 'border-principal bg-principal/10'
              : 'border-input/50 bg-white hover:border-principal/50'
          }`}
          style={{
            boxShadow: selectedMethod === 'efectivo'
              ? "0 4px 12px rgba(var(--principal-rgb), 0.2)"
              : "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <Banknote 
              className={`w-8 h-8 ${
                selectedMethod === 'efectivo' ? 'text-principal' : 'text-foreground/60'
              }`}
            />
            <span 
              className="text-base font-semibold"
              style={{ 
                color: selectedMethod === 'efectivo' 
                  ? "var(--principal)" 
                  : "var(--foreground)" 
              }}
            >
              Efectivo
            </span>
          </div>
        </motion.button>

        {/* Botón Transferencia */}
        <motion.button
          onClick={() => handleSelectMethod('transferencia')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            selectedMethod === 'transferencia'
              ? 'border-principal bg-principal/10'
              : 'border-input/50 bg-white hover:border-principal/50'
          }`}
          style={{
            boxShadow: selectedMethod === 'transferencia'
              ? "0 4px 12px rgba(var(--principal-rgb), 0.2)"
              : "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <Smartphone 
              className={`w-8 h-8 ${
                selectedMethod === 'transferencia' ? 'text-principal' : 'text-foreground/60'
              }`}
            />
            <span 
              className="text-base font-semibold"
              style={{ 
                color: selectedMethod === 'transferencia' 
                  ? "var(--principal)" 
                  : "var(--foreground)" 
              }}
            >
              Transferencia
            </span>
          </div>
        </motion.button>
      </div>

      {/* Botones */}
      <div className="pt-4 flex gap-4">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => setCurrentStep(2)}
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
          {isCreating ? "Procesando..." : "Confirmar Pedido"}
        </Button>
      </div>
    </motion.div>
  );
}

