"use client";

import { useState, useEffect } from "react";
import { IDatosPago } from "@/app/types/cart.type";
import { cartFormsConfig } from "@/app/config/cartForms.config";
import { useCartStore } from "@/app/stores/cartStore";

interface UsePaymentFormOptions {
  initialData?: Partial<IDatosPago>;
}

export function usePaymentForm(options: UsePaymentFormOptions = {}) {
  const { checkoutState, setDatosPago } = useCartStore();
  const [formData, setFormData] = useState<Partial<IDatosPago>>(
    options.initialData || checkoutState.datosPago || { metodo: 'efectivo' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Guardar datos cuando cambian
    if (formData.metodo) {
      const datos: IDatosPago = {
        metodo: formData.metodo as 'efectivo' | 'transferencia' | 'credito' | 'debito',
        ...(formData.metodo === 'transferencia' && {
          comprobante: formData.comprobante,
        }),
        ...((formData.metodo === 'credito' || formData.metodo === 'debito') && {
          tarjeta: {
            numero: formData.tarjeta?.numero,
            nombre: formData.tarjeta?.nombre,
            vencimiento: formData.tarjeta?.vencimiento,
            cvv: formData.tarjeta?.cvv,
          },
        }),
      };
      setDatosPago(datos);
    }
  }, [formData, setDatosPago]);

  const handleChange = (name: string, value: string | File | null) => {
    if (name.startsWith('tarjeta_')) {
      const tarjetaField = name.replace('tarjeta_', '');
      setFormData((prev) => ({
        ...prev,
        tarjeta: {
          ...prev.tarjeta,
          [tarjetaField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Filtrar campos según el método de pago
  const getVisibleFields = () => {
    if (formData.metodo === 'efectivo') {
      return cartFormsConfig.pago.filter((field) => field.name === 'metodo');
    }
    if (formData.metodo === 'transferencia') {
      return cartFormsConfig.pago.filter(
        (field) => field.name === 'metodo' || field.name === 'comprobante'
      );
    }
    // Para crédito/débito, mostrar todos los campos de tarjeta
    return cartFormsConfig.pago.filter(
      (field) =>
        field.name === 'metodo' ||
        field.name === 'numero_tarjeta' ||
        field.name === 'nombre_tarjeta' ||
        field.name === 'vencimiento' ||
        field.name === 'cvv'
    );
  };

  return {
    formData,
    errors,
    handleChange,
    getVisibleFields,
    setFormData,
    setErrors,
  };
}

