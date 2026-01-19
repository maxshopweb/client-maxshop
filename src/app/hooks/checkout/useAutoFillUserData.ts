import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { ContactFormData } from "../../schemas/contactForm.schema";
import { IUsuario } from "@/app/types/user";

interface UseAutoFillUserDataOptions {
  isAuthenticated: boolean;
  user: IUsuario | null;
  contactData: ContactFormData | null;
  setValue: UseFormSetValue<ContactFormData>;
}

/**
 * Hook para autocompletar el formulario con datos del usuario autenticado
 */
export function useAutoFillUserData({
  isAuthenticated,
  user,
  contactData,
  setValue,
}: UseAutoFillUserDataOptions) {
  useEffect(() => {
    if (isAuthenticated && user && !contactData) {
      setValue("email", user.email || "");
      setValue("firstName", user.nombre || "");
      setValue("lastName", user.apellido || "");
      setValue("phone", user.telefono?.toString() || "");
    }
  }, [isAuthenticated, user, contactData, setValue]);
}

