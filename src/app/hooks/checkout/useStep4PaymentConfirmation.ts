"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "./useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCreateOrderFromCheckout } from "@/app/hooks/ventas/useCreateOrderFromCheckout";
import { useCheckoutFlowGuard } from "./useCheckoutFlowGuard";
import { useCostoEnvioEnStep4 } from "./useCostoEnvioEnStep4";
import { toast } from "sonner";

export function useStep4PaymentConfirmation() {
  const router = useRouter();
  const {
    paymentMethod,
    setPaymentMethod,
    setCurrentStep,
    setCodigoPostal,
    setCostoEnvio,
    personalData,
    shippingData,
    costoEnvio,
    id_direccion,
  } = useCheckoutStore();
  const { user, isAuthenticated } = useAuth();
  const { items } = useCartStore();
  const { isCalculandoEnvio } = useCostoEnvioEnStep4();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(paymentMethod);

  const guard = useCheckoutFlowGuard({ requiredStep: 4, redirectOnFail: false });

  const { createOrder, isCreating } = useCreateOrderFromCheckout({
    onError: (error: any) => {
      if (error?.response?.status === 401 || error?.message?.includes("401")) {
        toast.error("Sesión expirada", {
          description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        });
        setTimeout(() => router.push(`/login?redirect=${encodeURIComponent("/checkout?step=4")}`), 2000);
        return;
      }
      toast.error("Error al crear pedido", {
        description: error?.response?.data?.error || error?.message || "Ocurrió un error al procesar tu pedido",
      });
    },
  });

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
  };

  const handleGoBack = () => {
    setCodigoPostal(null);
    setCostoEnvio(null);
    setCurrentStep(3);
  };

  const handleLoginRedirect = () => {
    router.push(guard.redirectTo || "/login");
  };

  const handleConfirmOrder = async () => {
    if (!selectedMethod) {
      toast.error("Método de pago requerido", { description: "Por favor selecciona un método de pago" });
      return;
    }
    if (!guard.isValid) {
      if (guard.reason === "no-auth") {
        router.push(guard.redirectTo || "/login");
        return;
      }
      if (guard.reason === "no-cart") {
        toast.error("Carrito vacío", { description: "No hay productos en el carrito" });
        router.push("/checkout?step=1");
        return;
      }
      if (guard.reason === "no-step2") {
        toast.error("Datos incompletos", { description: "Por favor completa los datos de contacto" });
        router.push(guard.redirectTo || "/checkout?step=2");
        return;
      }
      return;
    }

    if (!personalData) {
      toast.error("Datos incompletos", { description: "Por favor completa los datos personales" });
      setCurrentStep(2);
      return;
    }
    if (!shippingData) {
      toast.error("Datos incompletos", { description: "Por favor completa los datos de envío" });
      setCurrentStep(3);
      return;
    }

    const detalles = items.map((item) => ({
      id_prod: item.id_prod,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      descuento_aplicado: item.descuento || 0,
    }));
    const idCliente = user?.uid || undefined;
    const fullPhone = `${personalData.phoneArea}${personalData.phone}`;
    const observaciones =
      shippingData.tipoEntrega === "envio"
        ? `Tel: ${fullPhone}, Dirección: ${shippingData.address}, ${shippingData.city}, ${shippingData.state}, Tipo: Envío`
        : `Tel: ${fullPhone}, Tipo: Retiro en tienda`;

    const direccionData =
      shippingData.tipoEntrega === "envio" && shippingData.postalCode
        ? {
            direccion: shippingData.address || "",
            altura: shippingData.altura || "",
            piso: shippingData.piso || undefined,
            dpto: shippingData.dpto || undefined,
            ciudad: shippingData.city || "",
            provincia: shippingData.state || "",
            cod_postal: (() => {
              const parsed = parseInt(shippingData.postalCode!.trim(), 10);
              return isNaN(parsed) ? null : parsed;
            })(),
            telefono: fullPhone,
          }
        : undefined;

    createOrder({
      id_cliente: idCliente,
      metodo_pago: selectedMethod,
      detalles,
      observaciones,
      id_direccion: id_direccion || undefined,
      direccion: id_direccion ? undefined : direccionData,
      costo_envio: costoEnvio || 0,
      tipo_documento: personalData.tipoDocumento || undefined,
      numero_documento: personalData.documento || undefined,
    });
  };

  return {
    guard,
    selectedMethod,
    handleSelectMethod,
    handleGoBack,
    handleLoginRedirect,
    handleConfirmOrder,
    isCalculandoEnvio,
    createOrder,
    isCreating,
  };
}
