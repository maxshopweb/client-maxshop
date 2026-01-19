import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ContactFormData } from "../../schemas/contactForm.schema";

interface UseBillingDataOptions {
  setValue: UseFormSetValue<ContactFormData>;
  watch: UseFormWatch<ContactFormData>;
}

/**
 * Hook para gestionar el estado y sincronización de datos de facturación
 */
export function useBillingData({ setValue, watch }: UseBillingDataOptions) {
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [mismaDireccionEnvio, setMismaDireccionEnvio] = useState(true);

  // Observar valores del formulario necesarios para sincronización
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const tipoDocumento = watch("tipoDocumento");
  const documento = watch("documento");
  const address = watch("address");
  const city = watch("city");
  const state = watch("state");
  const postalCode = watch("postalCode");

  // Sincronizar estado local con el formulario
  useEffect(() => {
    setValue("necesitaFacturaA", necesitaFacturaA, { shouldValidate: false });
  }, [necesitaFacturaA, setValue]);

  useEffect(() => {
    setValue("usarMismosDatosFacturacion", usarMismosDatos, { shouldValidate: false });
  }, [usarMismosDatos, setValue]);

  useEffect(() => {
    setValue("mismaDireccionEnvio", mismaDireccionEnvio, { shouldValidate: false });
  }, [mismaDireccionEnvio, setValue]);

  // Sincronizar datos de facturación cuando se usan los mismos datos de contacto
  useEffect(() => {
    if (necesitaFacturaA && usarMismosDatos) {
      const razonSocial = `${firstName || ""} ${lastName || ""}`.trim();
      setValue("facturacionA.razonSocial", razonSocial, { shouldValidate: false });
      setValue("facturacionA.nombreEmpresa", razonSocial, { shouldValidate: false });
      setValue("facturacionA.cuit", tipoDocumento === "CUIT" ? documento || "" : "", { shouldValidate: false });
    }
  }, [necesitaFacturaA, usarMismosDatos, firstName, lastName, tipoDocumento, documento, setValue]);

  // Sincronizar dirección fiscal cuando se usa la misma dirección de envío
  useEffect(() => {
    if (necesitaFacturaA && mismaDireccionEnvio) {
      setValue("facturacionA.domicilioFiscal", address || "", { shouldValidate: false });
      setValue("facturacionA.ciudadFiscal", city || "", { shouldValidate: false });
      setValue("facturacionA.provinciaFiscal", state || "", { shouldValidate: false });
      setValue("facturacionA.codigoPostalFiscal", postalCode || "", { shouldValidate: false });
    }
  }, [necesitaFacturaA, mismaDireccionEnvio, address, city, state, postalCode, setValue]);

  const handleNecesitaFacturaAChange = (checked: boolean) => {
    setNecesitaFacturaA(checked);
    if (!checked) {
      setUsarMismosDatos(true);
      setMismaDireccionEnvio(true);
    }
  };

  const handleUsarMismosDatosChange = (checked: boolean) => {
    setUsarMismosDatos(checked);
    if (checked) {
      setMismaDireccionEnvio(true);
    }
  };

  return {
    necesitaFacturaA,
    usarMismosDatos,
    mismaDireccionEnvio,
    setNecesitaFacturaA: handleNecesitaFacturaAChange,
    setUsarMismosDatos: handleUsarMismosDatosChange,
    setMismaDireccionEnvio,
  };
}

