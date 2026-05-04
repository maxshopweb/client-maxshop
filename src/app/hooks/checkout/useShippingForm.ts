"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema, ShippingFormData } from "../../schemas/shippingForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

export function useShippingForm() {
  const { shippingData, tipoEntrega } = useCheckoutStore();

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      tipoEntrega: tipoEntrega || undefined,
      address: '',
      altura: '',
      piso: '',
      dpto: '',
      city: '',
      state: '',
      postalCode: '',
      mismaDireccionEnvio: true,
      retiro_ciudad: '',
      retiro_provincia: '',
      ...(shippingData || {}),
      retiro_ciudad: shippingData?.retiro_ciudad ?? '',
      retiro_provincia: shippingData?.retiro_provincia ?? '',
    },
    mode: 'onChange',
  });

  return form;
}

