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
    if (isAuthenticated && user && !personalData) {
      setValue("email", user.email || "");
      setValue("firstName", user.nombre || "");
      setValue("lastName", user.apellido || "");
      setValue("phone", user.telefono?.toString() || "");
    }
  }, [isAuthenticated, user, personalData, setValue]);
}


