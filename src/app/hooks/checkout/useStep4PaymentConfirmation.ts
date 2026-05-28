"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "./useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCreateOrderFromCheckout } from "@/app/hooks/ventas/useCreateOrderFromCheckout";
import { useCheckoutFlowGuard } from "./useCheckoutFlowGuard";
import { useCostoEnvioEnStep4 } from "./useCostoEnvioEnStep4";
import { toast } from "sonner";
import { isCarritoStockOk, validateCarritoCompleto } from "@/app/utils/stock";
import { OBSERVACION_RETIRO_EN_TIENDA } from "@/app/utils/venta-envio.validation";
import {
  buildCheckoutOrderExtras,
  resolveCheckoutDireccionPayload,
} from "@/app/utils/buildCheckoutOrderPayload";

export function useStep4PaymentConfirmation() {
  const router = useRouter();
  const {
    paymentMethod,
    setPaymentMethod,
    setCurrentStep,
    setCodigoPostal,
    setCostoEnvio,
    personalData,
    billingAddress,
    shippingData,
    costoEnvio,
    id_direccion_facturacion,
    id_direccion_envio,
  } = useCheckoutStore();
  const { user, isAuthenticated } = useAuth();
  const { items } = useCartStore();
  const { isCalculandoEnvio } = useCostoEnvioEnStep4();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(paymentMethod);

  const carritoStockOk = useMemo(() => isCarritoStockOk(items), [items]);

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

      const errorMsg: string =
        error?.response?.data?.error || error?.message || "Ocurrió un error al procesar tu pedido";

      if (/stock/i.test(errorMsg)) {
        toast.error("Stock insuficiente", {
          description: "Revisá las cantidades en tu carrito e intentá de nuevo.",
        });
        setCurrentStep(1);
        return;
      }

      if (/precio/i.test(errorMsg)) {
        toast.error("Precios actualizados", {
          description: "Los precios cambiaron. Revisá tu carrito e intentá de nuevo.",
        });
        setCurrentStep(1);
        return;
      }

      const backendDetails = error?.response?.data?.details;
      const detailsDescription = Array.isArray(backendDetails) && backendDetails.length > 0
        ? backendDetails.join(" | ")
        : null;

      toast.error("Error al crear pedido", {
        description: detailsDescription || errorMsg,
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
    if (!billingAddress) {
      toast.error("Datos incompletos", { description: "Por favor completa la dirección de facturación" });
      setCurrentStep(2);
      return;
    }
    if (!shippingData) {
      toast.error("Datos incompletos", { description: "Por favor completa los datos de envío" });
      setCurrentStep(3);
      return;
    }

    const stockCheck = validateCarritoCompleto(items);
    if (!stockCheck.ok) {
      toast.error("Stock insuficiente", { description: stockCheck.message });
      setCurrentStep(1);
      return;
    }

    // El API calcula precios desde catálogo; omitir precio_unitario evita desync por cache local.
    const detalles = items.map((item) => ({
      id_prod: item.id_prod,
      cantidad: item.cantidad,
      descuento_aplicado: item.descuento || 0,
    }));
    const idCliente = user?.uid || undefined;
    const fullPhone = `${personalData.phoneArea}${personalData.phone}`;
    const observaciones =
      shippingData.tipoEntrega === "retiro" ? OBSERVACION_RETIRO_EN_TIENDA : "";

    const { id_direccion, direccion } = resolveCheckoutDireccionPayload({
      tipoEntrega: shippingData.tipoEntrega,
      billingAddress,
      shippingData,
      fullPhone,
      id_direccion_facturacion,
      id_direccion_envio,
    });

    const orderExtras = buildCheckoutOrderExtras(personalData, billingAddress);

    createOrder({
      id_cliente: idCliente,
      metodo_pago: selectedMethod,
      detalles,
      observaciones,
      id_direccion: id_direccion || undefined,
      direccion,
      costo_envio: costoEnvio || 0,
      tipo_documento: orderExtras.tipo_documento,
      numero_documento: orderExtras.numero_documento,
      referencia_facturacion: orderExtras.referencia_facturacion,
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
    carritoStockOk,
  };
}
