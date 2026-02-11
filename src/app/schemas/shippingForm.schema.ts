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
  // valueAsNumber en inputs vacíos devuelve NaN; convertir a undefined para que pase la validación
  latitud: z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? undefined : val),
    z.number().optional()
  ),
  longitud: z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? undefined : val),
    z.number().optional()
  ),
}).superRefine((data, ctx) => {
  // Si es envío, validar cada campo y mostrar error en el campo correcto
  if (data.tipoEntrega !== 'envio') return;
  const addr = typeof data.address === 'string' ? data.address.trim() : '';
  const alt = typeof data.altura === 'string' ? data.altura.trim() : '';
  const cityVal = typeof data.city === 'string' ? data.city.trim() : '';
  const stateVal = data.state != null ? String(data.state).trim() : '';
  const cp = typeof data.postalCode === 'string' ? data.postalCode.trim() : '';
  if (addr.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La calle debe tener al menos 2 caracteres', path: ['address'] });
  }
  if (alt.length < 1) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La altura es obligatoria', path: ['altura'] });
  }
  if (cityVal.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ciudad debe tener al menos 2 caracteres', path: ['city'] });
  }
  if (stateVal.length < 1) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Seleccioná una provincia', path: ['state'] });
  }
  if (!cp || !/^\d{4,5}$/.test(cp)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El código postal debe tener 4 o 5 dígitos', path: ['postalCode'] });
  }
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

