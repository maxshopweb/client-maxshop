import { z } from 'zod';

export const shippingFormSchema = z.object({
  tipoEntrega: z.enum(['envio', 'retiro'], {
    required_error: 'Debe seleccionar tipo de entrega',
  }),
  // Dirección de envío (requerida solo si tipoEntrega === 'envio')
  address: z.string().optional(), // Calle (sin altura)
  altura: z.string().optional(), // Altura (número)
  piso: z.string().optional(), // Piso (opcional)
  dpto: z.string().optional(), // Departamento (opcional)
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  mismaDireccionEnvio: z.boolean().default(true),
  
  // Campos de geocodificación (opcionales, llenados por OpenCage)
  direccion_formateada: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
}).refine((data) => {
  // Si es envío, todos los campos de dirección son obligatorios (excepto piso y dpto)
  if (data.tipoEntrega === 'envio') {
    if (!data.address || data.address.length < 2) return false;
    if (!data.altura || data.altura.length < 1) return false;
    if (!data.city || data.city.length < 2) return false;
    if (!data.state || data.state.length < 1) return false;
    if (!data.postalCode || !/^\d{4,5}$/.test(data.postalCode)) return false;
  }
  return true;
}, {
  message: 'Debe completar todos los campos de dirección obligatorios',
  path: ['address'],
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

