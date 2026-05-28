import { z } from 'zod';

export const billingAddressSchema = z
  .object({
    address: z.string().min(2, 'La calle debe tener al menos 2 caracteres'),
    altura: z.string().min(1, 'La altura es obligatoria'),
    piso: z.string().trim().max(20, 'El piso admite como máximo 20 caracteres').optional(),
    dpto: z.string().trim().max(20, 'El departamento admite como máximo 20 caracteres').optional(),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: z.string().min(1, 'Seleccioná una provincia'),
    postalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const cp = typeof data.postalCode === 'string' ? data.postalCode.trim() : '';
    if (cp.length > 0 && !/^\d{4,5}$/.test(cp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El código postal debe tener 4 o 5 dígitos',
        path: ['postalCode'],
      });
    }
  });

export type BillingAddressData = z.infer<typeof billingAddressSchema>;

export const emptyBillingAddress: BillingAddressData = {
  address: '',
  altura: '',
  piso: '',
  dpto: '',
  city: '',
  state: '',
  postalCode: '',
};
