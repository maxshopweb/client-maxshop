import { PersonalFormData, PersonalFormDataAuthUser } from "@/app/schemas/personalForm.schema";
import { IUsuario } from "@/app/types/user";

/**
 * Construye PersonalFormData completo a partir del usuario autenticado
 * y los datos del formulario reducido (DNI + facturación).
 */
export function personalDataFromAuthUser(
  user: IUsuario,
  form: PersonalFormDataAuthUser
): PersonalFormData {
  let phoneArea = "351";
  let phone = "0000000";
  if (user.telefono) {
    const digits = user.telefono.replace(/\D/g, "");
    if (digits.length >= 9) {
      phoneArea = digits.slice(0, digits.length - 8);
      phone = digits.slice(-8);
    }
  }

  return {
    email: user.email || "",
    firstName: user.nombre || "",
    lastName: user.apellido ?? "",
    tipoDocumento: form.tipoDocumento,
    documento: form.documento,
    phoneArea,
    phone,
    necesitaFacturaA: form.necesitaFacturaA,
    usarMismosDatosFacturacion: form.usarMismosDatosFacturacion,
    facturacionA: form.facturacionA,
  };
}
