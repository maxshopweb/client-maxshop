"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  billingAddressSchema,
  BillingAddressData,
  emptyBillingAddress,
} from "@/app/schemas/billingAddress.schema";
import { useCheckoutStore } from "./useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useContactFormOptions } from "./useContactFormOptions";
import { direccionesService } from "@/app/services/direcciones.service";

export function useStep2BillingAddress() {
  const {
    billingAddress,
    setBillingAddress,
    id_direccion_facturacion,
    setIdDireccionFacturacion,
  } = useCheckoutStore();
  const { isAuthenticated } = useAuth();
  const autofillAppliedRef = useRef(false);

  const form = useForm<BillingAddressData>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: billingAddress ?? emptyBillingAddress,
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors, isValid }, setValue, control, trigger, watch } = form;
  const { provinciaOptions } = useContactFormOptions();

  const { data: direcciones = [] } = useQuery({
    queryKey: ["direcciones"],
    queryFn: () => direccionesService.getAll(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated || autofillAppliedRef.current || billingAddress) return;
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
    setIdDireccionFacturacion(principal.id_direccion);
    autofillAppliedRef.current = true;
    void trigger();
  }, [isAuthenticated, direcciones, billingAddress, setValue, trigger, setIdDireccionFacturacion]);

  const handleDireccionSelect = async (value: string | number) => {
    const newId = value ? String(value) : null;
    setIdDireccionFacturacion(newId);
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

  const saveBillingAddress = async (): Promise<boolean> => {
    let ok = false;
    await handleSubmit((data) => {
      setBillingAddress(data);
      ok = true;
    })();
    return ok;
  };

  const isBillingComplete =
    !!id_direccion_facturacion ||
    (isValid &&
      !!(watch("address")?.trim()) &&
      !!(watch("altura")?.trim()) &&
      !!(watch("city")?.trim()) &&
      !!(watch("state")?.trim()));

  return {
    form: { register, handleSubmit, errors, isValid, setValue, control, trigger, watch },
    provinciaOptions,
    direcciones,
    isAuthenticated,
    selectedDireccionId: id_direccion_facturacion,
    handleDireccionSelect,
    saveBillingAddress,
    isBillingComplete,
  };
}
