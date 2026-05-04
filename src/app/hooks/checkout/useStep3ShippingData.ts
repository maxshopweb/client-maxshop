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
    shippingData,
    setShippingData,
    setCurrentStep,
    completeStep,
    costoEnvio,
    setCostoEnvio,
    setTipoEntrega,
    setIdDireccion,
    id_direccion,
    ciudad: ciudadStore,
    provincia: provinciaStore,
    codigoPostal: codigoPostalStore,
    setCodigoPostal: setCodigoPostalStore,
    setCiudad,
    setProvincia,
  } = useCheckoutStore();

  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDireccionId, setSelectedDireccionId] = useState<string | null>(id_direccion);
  const retiroAutofillAppliedRef = useRef(false);

  const form = useShippingForm();
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, control, trigger } = form;
  const tipoEntrega = watch("tipoEntrega");
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

  // Sync postalCode form → store (debounced)
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

  // Sync store (provincia/ciudad) → form when empty
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

  // Autocompletar dirección en retiro desde dirección principal (una vez por selección de retiro)
  useEffect(() => {
    if (tipoEntrega !== "retiro") {
      retiroAutofillAppliedRef.current = false;
      return;
    }
    if (!isAuthenticated || retiroAutofillAppliedRef.current) return;
    const principal = direcciones.find((d) => d.es_principal) ?? direcciones[0];
    if (!principal) return;
    const opts = { shouldValidate: true, shouldDirty: true };
    setValue("address", String(principal.direccion ?? ""), opts);
    setValue("altura", String(principal.altura ?? ""), opts);
    setValue("piso", String(principal.piso ?? ""), opts);
    setValue("dpto", String(principal.dpto ?? ""), opts);
    setValue("city", String(principal.ciudad ?? ""), opts);
    setValue("state", String(principal.provincia ?? ""), opts);
    setValue("postalCode", principal.cod_postal != null ? String(principal.cod_postal) : "", opts);
    retiroAutofillAppliedRef.current = true;
    void trigger();
  }, [tipoEntrega, isAuthenticated, direcciones, setValue, trigger]);

  // Sync tipoEntrega → store
  useEffect(() => {
    if (tipoEntrega) {
      setTipoEntrega(tipoEntrega);
      if (tipoEntrega === "retiro") {
        setCostoEnvio(0);
        setIdDireccion(null);
        setSelectedDireccionId(null);
      }
    }
  }, [tipoEntrega, setTipoEntrega, setCostoEnvio, setIdDireccion]);

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
    setIdDireccion(newId);
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

  const cpValid = postalCode && /^\d{4,5}$/.test(String(postalCode).trim());
  const manualEnvioComplete =
    !!(address && String(address).trim()) &&
    !!(altura && String(altura).trim()) &&
    !!(city && String(city).trim()) &&
    !!(state && String(state).trim()) &&
    !!cpValid;

  const manualRetiroComplete =
    !!(address && String(address).trim()) &&
    !!(altura && String(altura).trim()) &&
    !!(city && String(city).trim()) &&
    !!(state && String(state).trim());

  const isAddressVerified =
    tipoEntrega === "envio"
      ? !!selectedDireccionId || manualEnvioComplete
      : tipoEntrega === "retiro"
        ? !!selectedDireccionId || manualRetiroComplete
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
    setSelectedDireccionId,
    handleGoBack,
    onSubmit,
    handleDireccionSelect,
    isAddressVerified,
  };
}
