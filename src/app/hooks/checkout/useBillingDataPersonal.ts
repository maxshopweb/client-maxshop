"use client";

import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PersonalFormData } from "../../schemas/personalForm.schema";

interface UseBillingDataPersonalOptions {
  setValue: UseFormSetValue<PersonalFormData>;
  watch: UseFormWatch<PersonalFormData>;
}

/**
 * Hook para gestionar el estado y sincronización de datos de facturación
 * Versión adaptada para PersonalFormData (sin dirección de envío)
 */
export function useBillingDataPersonal({ setValue, watch }: UseBillingDataPersonalOptions) {
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);

  // Observar valores del formulario necesarios para sincronización
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const tipoDocumento = watch("tipoDocumento");
  const documento = watch("documento");

  // Sincronizar estado local con el formulario
  useEffect(() => {
    setValue("necesitaFacturaA", necesitaFacturaA, { shouldValidate: false });
  }, [necesitaFacturaA, setValue]);

  useEffect(() => {
    setValue("usarMismosDatosFacturacion", usarMismosDatos, { shouldValidate: false });
  }, [usarMismosDatos, setValue]);

  // Sincronizar datos de facturación cuando se usan los mismos datos de contacto
  useEffect(() => {
    if (necesitaFacturaA && usarMismosDatos) {
      const razonSocial = `${firstName || ""} ${lastName || ""}`.trim();
      setValue("facturacionA.razonSocial", razonSocial, { shouldValidate: false });
      setValue("facturacionA.nombreEmpresa", razonSocial, { shouldValidate: false });
      setValue("facturacionA.cuit", tipoDocumento === "CUIT" ? documento || "" : "", { shouldValidate: false });
    }
  }, [necesitaFacturaA, usarMismosDatos, firstName, lastName, tipoDocumento, documento, setValue]);

  const handleNecesitaFacturaAChange = (checked: boolean) => {
    setNecesitaFacturaA(checked);
    if (!checked) {
      setUsarMismosDatos(true);
    }
  };

  const handleUsarMismosDatosChange = (checked: boolean) => {
    setUsarMismosDatos(checked);
  };

  return {
    necesitaFacturaA,
    usarMismosDatos,
    setNecesitaFacturaA: handleNecesitaFacturaAChange,
    setUsarMismosDatos: handleUsarMismosDatosChange,
  };
}


