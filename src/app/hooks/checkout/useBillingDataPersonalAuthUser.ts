"use client";

import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PersonalFormDataAuthUser } from "../../schemas/personalForm.schema";
import { IUsuario } from "@/app/types/user";
import { useCheckoutStore } from "./useCheckoutStore";

interface UseBillingDataPersonalAuthUserOptions {
  user: IUsuario | null;
  setValue: UseFormSetValue<PersonalFormDataAuthUser>;
  watch: UseFormWatch<PersonalFormDataAuthUser>;
}

export function useBillingDataPersonalAuthUser({
  user,
  setValue,
  watch,
}: UseBillingDataPersonalAuthUserOptions) {
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const billingAddress = useCheckoutStore((s) => s.billingAddress);

  const tipoDocumento = watch("tipoDocumento");
  const documento = watch("documento");

  useEffect(() => {
    setValue("necesitaFacturaA", necesitaFacturaA, { shouldValidate: true });
  }, [necesitaFacturaA, setValue]);

  useEffect(() => {
    setValue("usarMismosDatosFacturacion", usarMismosDatos, { shouldValidate: true });
  }, [usarMismosDatos, setValue]);

  useEffect(() => {
    if (necesitaFacturaA && usarMismosDatos && user) {
      const razonSocial = `${user.nombre || ""} ${user.apellido || ""}`.trim();
      setValue("facturacionA.razonSocial", razonSocial, { shouldValidate: false });
      setValue("facturacionA.nombreEmpresa", razonSocial, { shouldValidate: false });
      setValue("facturacionA.cuit", tipoDocumento === "CUIT" ? documento || "" : "", { shouldValidate: false });
    }
  }, [necesitaFacturaA, usarMismosDatos, user, tipoDocumento, documento, setValue]);

  useEffect(() => {
    if (!necesitaFacturaA || !billingAddress) return;
    const domicilio = `${billingAddress.address || ""} ${billingAddress.altura || ""}`.trim();
    setValue("facturacionA.domicilioFiscal", domicilio, { shouldValidate: false });
    setValue("facturacionA.ciudadFiscal", billingAddress.city || "", { shouldValidate: false });
    setValue("facturacionA.provinciaFiscal", billingAddress.state || "", { shouldValidate: false });
    setValue("facturacionA.codigoPostalFiscal", billingAddress.postalCode || "", { shouldValidate: false });
  }, [necesitaFacturaA, billingAddress, setValue]);

  return {
    necesitaFacturaA,
    usarMismosDatos,
    setNecesitaFacturaA: (checked: boolean) => {
      setNecesitaFacturaA(checked);
      if (!checked) setUsarMismosDatos(true);
    },
    setUsarMismosDatos,
  };
}
