"use client";

import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PersonalFormDataAuthUser } from "../../schemas/personalForm.schema";
import { IUsuario } from "@/app/types/user";

interface UseBillingDataPersonalAuthUserOptions {
  user: IUsuario | null;
  setValue: UseFormSetValue<PersonalFormDataAuthUser>;
  watch: UseFormWatch<PersonalFormDataAuthUser>;
}

/**
 * Gestión de facturación para el formulario reducido (usuario autenticado).
 * Cuando "usar mismos datos", toma nombre/apellido del user y CUIT del form.
 */
export function useBillingDataPersonalAuthUser({
  user,
  setValue,
  watch,
}: UseBillingDataPersonalAuthUserOptions) {
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);

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
