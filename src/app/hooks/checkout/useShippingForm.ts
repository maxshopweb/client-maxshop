"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema, ShippingFormData } from "../../schemas/shippingForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

export function useShippingForm() {
  const { shippingData, tipoEntrega } = useCheckoutStore();

  const persistedShipping = shippingData
    ? (() => {
        const s = { ...shippingData } as Record<string, unknown>;
        delete s.retiro_ciudad;
        delete s.retiro_provincia;
        return s;
      })()
    : {};

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
      ...persistedShipping,
    },
    mode: 'onChange',
  });

  return form;
}

