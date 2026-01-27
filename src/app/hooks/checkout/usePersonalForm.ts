"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalFormSchema, PersonalFormData } from "../../schemas/personalForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

export function usePersonalForm() {
  const { personalData } = useCheckoutStore();

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: personalData || {
      email: '',
      firstName: '',
      lastName: '',
      tipoDocumento: 'DNI', // Preseleccionar DNI para mejor UX
      documento: '',
      phoneArea: '',
      phone: '',
      necesitaFacturaA: false,
      usarMismosDatosFacturacion: true,
      facturacionA: undefined,
    },
    mode: 'onChange',
  });

  return form;
}

