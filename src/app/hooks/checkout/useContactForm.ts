import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "../../schemas/contactForm.schema";

interface UseContactFormOptions {
  defaultValues?: ContactFormData | null;
}

export function useContactForm({ defaultValues }: UseContactFormOptions = {}) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema) as any,
    mode: "onChange",
    defaultValues: defaultValues || {
      email: "",
      firstName: "",
      lastName: "",
      tipoDocumento: "DNI",
      documento: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      necesitaFacturaA: false,
      usarMismosDatosFacturacion: true,
      mismaDireccionEnvio: true,
    },
  });

  return form;
}

