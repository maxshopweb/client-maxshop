import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  address: z.string().min(5, 'Dirección completa requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(2, 'Provincia requerida'),
  postalCode: z.string().regex(/^\d{4,5}$/, 'Código postal inválido'),
  phone: z.string().regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

