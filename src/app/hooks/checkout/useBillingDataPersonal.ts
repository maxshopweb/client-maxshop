"use client";

import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PersonalFormData } from "../../schemas/personalForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

interface UseBillingDataPersonalOptions {
  setValue: UseFormSetValue<PersonalFormData>;
  watch: UseFormWatch<PersonalFormData>;
}

export function useBillingDataPersonal({ setValue, watch }: UseBillingDataPersonalOptions) {
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const billingAddress = useCheckoutStore((s) => s.billingAddress);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const tipoDocumento = watch("tipoDocumento");
  const documento = watch("documento");

  useEffect(() => {
    setValue("necesitaFacturaA", necesitaFacturaA, { shouldValidate: true });
  }, [necesitaFacturaA, setValue]);

  useEffect(() => {
    setValue("usarMismosDatosFacturacion", usarMismosDatos, { shouldValidate: true });
  }, [usarMismosDatos, setValue]);

  useEffect(() => {
    if (necesitaFacturaA && usarMismosDatos) {
      const razonSocial = `${firstName || ""} ${lastName || ""}`.trim();
      setValue("facturacionA.razonSocial", razonSocial, { shouldValidate: false });
      setValue("facturacionA.nombreEmpresa", razonSocial, { shouldValidate: false });
      setValue("facturacionA.cuit", tipoDocumento === "CUIT" ? documento || "" : "", { shouldValidate: false });
    }
  }, [necesitaFacturaA, usarMismosDatos, firstName, lastName, tipoDocumento, documento, setValue]);

  useEffect(() => {
    if (!necesitaFacturaA || !billingAddress) return;
    const domicilio = `${billingAddress.address || ""} ${billingAddress.altura || ""}`.trim();
    setValue("facturacionA.domicilioFiscal", domicilio, { shouldValidate: false });
    setValue("facturacionA.ciudadFiscal", billingAddress.city || "", { shouldValidate: false });
    setValue("facturacionA.provinciaFiscal", billingAddress.state || "", { shouldValidate: false });
    setValue("facturacionA.codigoPostalFiscal", billingAddress.postalCode || "", { shouldValidate: false });
  }, [necesitaFacturaA, billingAddress, setValue]);

  const handleNecesitaFacturaAChange = (checked: boolean) => {
    setNecesitaFacturaA(checked);
    if (!checked) setUsarMismosDatos(true);
  };

  return {
    necesitaFacturaA,
    usarMismosDatos,
    setNecesitaFacturaA: handleNecesitaFacturaAChange,
    setUsarMismosDatos,
  };
}
