"use client";

import { useMemo } from "react";
import { 
  IResultConfig, 
  CheckoutResultStatus,
  LocalPaymentMethod 
} from "../../types/checkout-result.type";

/**
 * Hook para obtener la configuración de UI según el estado del resultado
 * Centraliza toda la lógica de títulos, mensajes, iconos y acciones
 */
export function useCheckoutResultConfig(
  status: CheckoutResultStatus,
  metodo?: LocalPaymentMethod,
  isGuest?: boolean
): IResultConfig {
  return useMemo(() => {
    // Configuraciones base por estado
    const configs: Record<CheckoutResultStatus, IResultConfig> = {
      // Estados de Mercado Pago
      approved: {
        titulo: "¡Pedido Aprobado!",
        mensaje: "Tu pedido fue aprobado exitosamente. Recibirás un email con todos los detalles de tu compra y el seguimiento del envío.",
        icono: "CheckCircle2",
        color: "success",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Seguir comprando",
            variant: "outline-primary",
            href: "/tienda/productos",
          },
        ],
      },
      pending: {
        titulo: "Pago Pendiente",
        mensaje: "Tu pago está siendo procesado. Te notificaremos por email cuando sea confirmado. Esto puede tardar unos minutos.",
        icono: "Clock",
        color: "warning",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Volver al Inicio",
            variant: "outline-primary",
            href: "/",
          },
        ],
      },
      authorized: {
        titulo: "Pago Autorizado",
        mensaje: "Tu pago fue autorizado exitosamente. Estamos procesando la captura del pago. Recibirás una confirmación por email cuando se complete.",
        icono: "CheckCircle2",
        color: "info",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Seguir comprando",
            variant: "outline-primary",
            href: "/tienda/productos",
          },
        ],
      },
      in_process: {
        titulo: "Pago en Revisión",
        mensaje: "Tu pago está siendo revisado. Este proceso puede tardar entre 1 y 2 días hábiles. Te notificaremos por email cuando se complete la revisión.",
        icono: "Clock",
        color: "warning",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Volver al Inicio",
            variant: "outline-primary",
            href: "/",
          },
        ],
      },
      in_mediation: {
        titulo: "Pago en Mediación",
        mensaje: "Tu pago está en proceso de mediación. Esto ocurre cuando hay una disputa o reclamo. Estamos trabajando para resolverlo. Te mantendremos informado por email sobre el estado.",
        icono: "Info",
        color: "warning",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Contactar Soporte",
            variant: "outline-primary",
            href: "/contacto",
          },
        ],
      },
      rejected: {
        titulo: "Pago Rechazado",
        mensaje: "Lo sentimos, tu pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro método de pago.",
        icono: "XCircle",
        color: "error",
        acciones: [
          {
            label: "Volver al Carrito",
            variant: "primary",
            href: "/checkout?step=3",
          },
          {
            label: "Ver mis pedidos",
            variant: "outline-primary",
            href: "/mi-cuenta",
          },
        ],
      },
      cancelled: {
        titulo: "Pago Cancelado",
        mensaje: "Tu pago fue cancelado. Si realizaste el pago por error o deseas intentar nuevamente, puedes volver al carrito y completar tu compra.",
        icono: "XCircle",
        color: "error",
        acciones: [
          {
            label: "Volver al Carrito",
            variant: "primary",
            href: "/checkout?step=3",
          },
          {
            label: "Ver mis pedidos",
            variant: "outline-primary",
            href: "/mi-cuenta",
          },
        ],
      },
      refunded: {
        titulo: "Pago Reembolsado",
        mensaje: "Tu pago fue reembolsado exitosamente. El dinero será acreditado en tu cuenta según los tiempos de tu banco o método de pago. Si tienes dudas, contacta con nuestro soporte.",
        icono: "Info",
        color: "info",
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Contactar Soporte",
            variant: "outline-primary",
            href: "/contacto",
          },
        ],
      },
      charged_back: {
        titulo: "Contracargo Aplicado",
        mensaje: "Se aplicó un contracargo a tu pago. Esto significa que el banco emisor de tu tarjeta revirtió el pago. Por favor, contacta con nuestro equipo de soporte para resolver esta situación.",
        icono: "XCircle",
        color: "error",
        acciones: [
          {
            label: "Contactar Soporte",
            variant: "primary",
            href: "/contacto",
          },
          {
            label: "Ver mis pedidos",
            variant: "outline-primary",
            href: "/mi-cuenta",
          },
        ],
      },
      // Métodos de pago locales
      transferencia: {
        titulo: "Pedido reservado",
        mensaje: "Tu pedido fue reservado exitosamente. Realiza la transferencia bancaria con los datos que aparecen a continuación. Una vez confirmado el pago, te notificaremos por email.",
        icono: "CheckCircle2",
        color: "info",
        mostrarDatosBancarios: true,
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Seguir comprando",
            variant: "outline-primary",
            href: "/tienda/productos",
          },
        ],
      },
      efectivo: {
        titulo: "Pedido reservado",
        mensaje: "Tu pedido fue reservado exitosamente. Realiza el pago en RapiPago o Pago Fácil con los datos que aparecen a continuación. Una vez confirmado el pago, te notificaremos por email.",
        icono: "CheckCircle2",
        color: "info",
        mostrarDatosBancarios: true,
        acciones: [
          {
            label: "Ver mis pedidos",
            variant: "primary",
            href: "/mi-cuenta",
          },
          {
            label: "Seguir comprando",
            variant: "outline-primary",
            href: "/tienda/productos",
          },
        ],
      },
      // Estados de procesamiento/error
      processing: {
        titulo: "Procesando...",
        mensaje: "Estamos procesando tu pedido. Por favor, espera un momento.",
        icono: "Loader2",
        color: "info",
        acciones: [],
      },
      error: {
        titulo: "Error al Procesar",
        mensaje: "Ocurrió un error al procesar tu pedido. Por favor, intenta nuevamente o contáctanos.",
        icono: "XCircle",
        color: "error",
        acciones: [
          {
            label: "Intentar nuevamente",
            variant: "primary",
            href: "/checkout",
          },
          {
            label: "Volver al Inicio",
            variant: "outline-primary",
            href: "/",
          },
        ],
      },
    };

    const config = configs[status] || configs.processing;
    
    // Si es invitado, filtrar las acciones que requieren cuenta (href="/mi-cuenta")
    if (isGuest) {
      return {
        ...config,
        acciones: config.acciones.filter(accion => accion.href !== '/mi-cuenta')
      };
    }
    
    return config;
  }, [status, metodo, isGuest]);
}

