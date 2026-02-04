"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalFormSchemaAuthUser,
  PersonalFormDataAuthUser,
  PersonalFormData,
} from "../../schemas/personalForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

export function usePersonalFormAuthUser() {
  const { personalData } = useCheckoutStore();

  const defaultFromStore: Partial<PersonalFormDataAuthUser> = personalData
    ? {
        tipoDocumento: personalData.tipoDocumento,
        documento: personalData.documento,
        necesitaFacturaA: personalData.necesitaFacturaA,
        usarMismosDatosFacturacion: personalData.usarMismosDatosFacturacion,
        facturacionA: personalData.facturacionA,
      }
    : {};

  const form = useForm<PersonalFormDataAuthUser>({
    resolver: zodResolver(personalFormSchemaAuthUser),
    defaultValues: {
      tipoDocumento: "DNI",
      documento: "",
      necesitaFacturaA: false,
      usarMismosDatosFacturacion: true,
      facturacionA: undefined,
      ...defaultFromStore,
    },
    mode: "onChange",
  });

  return form;
}
