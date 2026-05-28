"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCheckoutStore } from "./useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useShippingForm } from "./useShippingForm";
import { useContactFormOptions } from "./useContactFormOptions";
import { ShippingFormData } from "@/app/schemas/shippingForm.schema";
import { direccionesService } from "@/app/services/direcciones.service";

export function useStep3ShippingData() {
  const {
    billingAddress,
    shippingData,
    setShippingData,
    setCurrentStep,
    completeStep,
    costoEnvio,
    setCostoEnvio,
    setTipoEntrega,
    setIdDireccionEnvio,
    id_direccion_envio,
    id_direccion_facturacion,
    ciudad: ciudadStore,
    provincia: provinciaStore,
    codigoPostal: codigoPostalStore,
    setCodigoPostal: setCodigoPostalStore,
    setCiudad,
    setProvincia,
  } = useCheckoutStore();

  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDireccionId, setSelectedDireccionId] = useState<string | null>(id_direccion_envio);
  const inheritAppliedRef = useRef(false);

  const form = useShippingForm();
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, control, trigger } = form;
  const tipoEntrega = watch("tipoEntrega");
  const usarMismaDireccionFacturacion = watch("usarMismaDireccionFacturacion");
  const address = watch("address");
  const altura = watch("altura");
  const city = watch("city");
  const state = watch("state");
  const postalCode = watch("postalCode");

  const { provinciaOptions } = useContactFormOptions();
  const { data: direcciones = [] } = useQuery({
    queryKey: ["direcciones"],
    queryFn: () => direccionesService.getAll(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (tipoEntrega !== "envio") return;
    const t = setTimeout(() => {
      if (postalCode && /^[0-9]{4}$/.test(postalCode)) {
        if (codigoPostalStore !== postalCode) setCodigoPostalStore(postalCode);
      } else if (codigoPostalStore && !postalCode) {
        setCodigoPostalStore(null);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [postalCode, tipoEntrega, codigoPostalStore, setCodigoPostalStore]);

  useEffect(() => {
    if (tipoEntrega !== "envio") return;
    const empty = (s: string | undefined) => !s || !String(s).trim();
    if (provinciaStore && empty(state)) {
      const opt = provinciaOptions.find(
        (o) =>
          o.label.toLowerCase() === provinciaStore.toLowerCase() ||
          provinciaStore.toLowerCase().includes(o.label.toLowerCase()) ||
          o.label.toLowerCase().includes(provinciaStore.toLowerCase())
      );
      if (opt) {
        const v = typeof opt.value === "number" ? String(opt.value) : (opt.value as string);
        setValue("state", v, { shouldValidate: true });
      }
    }
    if (ciudadStore && empty(city)) {
      setValue("city", ciudadStore, { shouldValidate: true });
    }
  }, [tipoEntrega, state, city, ciudadStore, provinciaStore, provinciaOptions, setValue]);

  useEffect(() => {
    if (tipoEntrega !== "envio") {
      inheritAppliedRef.current = false;
      return;
    }
    if (!usarMismaDireccionFacturacion || !billingAddress) return;
    const opts = { shouldValidate: true, shouldDirty: true };
    setValue("address", billingAddress.address ?? "", opts);
    setValue("altura", billingAddress.altura ?? "", opts);
    setValue("piso", billingAddress.piso ?? "", opts);
    setValue("dpto", billingAddress.dpto ?? "", opts);
    setValue("city", billingAddress.city ?? "", opts);
    setValue("state", billingAddress.state ?? "", opts);
    setValue("postalCode", billingAddress.postalCode ?? "", opts);
    setValue("mismaDireccionEnvio", true, opts);
    if (!selectedDireccionId && id_direccion_facturacion) {
      setSelectedDireccionId(id_direccion_facturacion);
      setIdDireccionEnvio(id_direccion_facturacion);
    }
    inheritAppliedRef.current = true;
    void trigger();
  }, [
    tipoEntrega,
    usarMismaDireccionFacturacion,
    billingAddress,
    setValue,
    trigger,
    id_direccion_facturacion,
    selectedDireccionId,
    setIdDireccionEnvio,
  ]);

  useEffect(() => {
    if (tipoEntrega) {
      setTipoEntrega(tipoEntrega);
      if (tipoEntrega === "retiro") {
        setCostoEnvio(0);
        setIdDireccionEnvio(null);
        setSelectedDireccionId(null);
      }
    }
  }, [tipoEntrega, setTipoEntrega, setCostoEnvio, setIdDireccionEnvio]);

  const handleGoBack = () => {
    setCodigoPostalStore(null);
    setCiudad(null);
    setProvincia(null);
    setCostoEnvio(null);
    setCurrentStep(2);
  };

  const onSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    try {
      if (data.tipoEntrega === "retiro") setCostoEnvio(0);
      setShippingData(data);
      completeStep(3);
      setCurrentStep(4);
    } catch (e) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDireccionSelect = async (value: string | number) => {
    const newId = value ? String(value) : null;
    setSelectedDireccionId(newId);
    setIdDireccionEnvio(newId);
    setValue("usarMismaDireccionFacturacion", false, { shouldValidate: true });
    setValue("mismaDireccionEnvio", false, { shouldValidate: true });
    const dir = value ? direcciones.find((d) => d.id_direccion === String(value)) : null;
    const opts = { shouldValidate: true, shouldDirty: true };
    if (dir) {
      setValue("address", String(dir.direccion ?? ""), opts);
      setValue("altura", String(dir.altura ?? ""), opts);
      setValue("piso", String(dir.piso ?? ""), opts);
      setValue("dpto", String(dir.dpto ?? ""), opts);
      setValue("city", String(dir.ciudad ?? ""), opts);
      setValue("state", String(dir.provincia ?? ""), opts);
      setValue("postalCode", dir.cod_postal != null ? String(dir.cod_postal) : "", opts);
    } else {
      setValue("address", "", opts);
      setValue("altura", "", opts);
      setValue("piso", "", opts);
      setValue("dpto", "", opts);
      setValue("city", "", opts);
      setValue("state", "", opts);
      setValue("postalCode", "", opts);
    }
    await trigger();
  };

  const handleUsarMismaDireccionChange = (checked: boolean) => {
    setValue("usarMismaDireccionFacturacion", checked, { shouldValidate: true });
    setValue("mismaDireccionEnvio", checked, { shouldValidate: true });
    if (!checked) {
      setSelectedDireccionId(null);
      setIdDireccionEnvio(null);
    }
  };

  const cpValid = postalCode && /^\d{4,5}$/.test(String(postalCode).trim());
  const manualEnvioComplete =
    !!(address && String(address).trim()) &&
    !!(altura && String(altura).trim()) &&
    !!(city && String(city).trim()) &&
    !!(state && String(state).trim()) &&
    !!cpValid;

  const billingHasCp = !!(billingAddress?.postalCode && /^\d{4,5}$/.test(billingAddress.postalCode.trim()));

  const isAddressVerified =
    tipoEntrega === "retiro"
      ? true
      : tipoEntrega === "envio"
        ? usarMismaDireccionFacturacion
          ? !!selectedDireccionId || id_direccion_facturacion || (billingAddress && (billingHasCp || !!cpValid))
          : !!selectedDireccionId || manualEnvioComplete
        : false;

  return {
    form: { register, handleSubmit, errors, isValid, watch, setValue, control, trigger },
    tipoEntrega,
    address,
    costoEnvio,
    provinciaOptions,
    direcciones,
    isAuthenticated,
    isSubmitting,
    selectedDireccionId,
    usarMismaDireccionFacturacion,
    billingAddress,
    handleGoBack,
    onSubmit,
    handleDireccionSelect,
    handleUsarMismaDireccionChange,
    isAddressVerified,
  };
}
