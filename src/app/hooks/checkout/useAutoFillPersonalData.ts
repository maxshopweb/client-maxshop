"use client";

import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { PersonalFormData } from "../../schemas/personalForm.schema";
import { IUsuario } from "@/app/types/user";

interface UseAutoFillPersonalDataOptions {
  isAuthenticated: boolean;
  user: IUsuario | null;
  personalData: PersonalFormData | null;
  setValue: UseFormSetValue<PersonalFormData>;
}

/**
 * Hook para autocompletar el formulario personal con datos del usuario autenticado
 */
export function useAutoFillPersonalData({
  isAuthenticated,
  user,
  personalData,
  setValue,
}: UseAutoFillPersonalDataOptions) {
  useEffect(() => {
    if (!isAuthenticated || !user || personalData) return;

    setValue("email", user.email || "");
    setValue("firstName", user.nombre || "");
    setValue("lastName", user.apellido || "");

    if (user.telefono) {
      const phone = user.telefono.replace(/\D/g, "");

      if (phone.length >= 10) {
        const area = phone.slice(0, phone.length - 8);
        const number = phone.slice(-8); // Solo los últimos 8 dígitos

        setValue("phoneArea", area);
        setValue("phone", number); // Solo el número, sin el área
      }
    }
  }, [isAuthenticated, user, personalData, setValue]);
}
