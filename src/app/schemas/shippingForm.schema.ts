import { z } from 'zod';

export const shippingFormSchema = z.object({
  tipoEntrega: z.enum(['envio', 'retiro'], {
    required_error: 'Debe seleccionar tipo de entrega',
  }),
  // Dirección de envío (solo envío a domicilio)
  address: z.string().optional(),
  altura: z.string().optional(),
  piso: z.string().trim().max(20, 'El piso admite como máximo 20 caracteres').optional(),
  dpto: z.string().trim().max(20, 'El departamento admite como máximo 20 caracteres').optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  usarMismaDireccionFacturacion: z.boolean().default(true),
  /** @deprecated alias persistido; usar usarMismaDireccionFacturacion */
  mismaDireccionEnvio: z.boolean().default(true).optional(),

  direccion_formateada: z.string().optional(),
  latitud: z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? undefined : val),
    z.number().optional()
  ),
  longitud: z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? undefined : val),
    z.number().optional()
  ),
}).superRefine((data, ctx) => {
  if (data.tipoEntrega === 'retiro') return;

  const addr = typeof data.address === 'string' ? data.address.trim() : '';
  const alt = typeof data.altura === 'string' ? data.altura.trim() : '';
  const cityVal = typeof data.city === 'string' ? data.city.trim() : '';
  const stateVal = data.state != null ? String(data.state).trim() : '';

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

  const cp = typeof data.postalCode === 'string' ? data.postalCode.trim() : '';
  if (!cp || !/^\d{4,5}$/.test(cp)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El código postal debe tener 4 o 5 dígitos', path: ['postalCode'] });
  }
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;
