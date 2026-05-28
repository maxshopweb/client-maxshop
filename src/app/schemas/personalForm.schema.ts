import { z } from 'zod';

const facturacionASchema = z.object({
  razonSocial: z.string().optional(),
  nombreEmpresa: z.string().optional(),
  cuit: z.string().optional(),
  domicilioFiscal: z.string().optional(),
  ciudadFiscal: z.string().optional(),
  provinciaFiscal: z.string().optional(),
  codigoPostalFiscal: z.string().optional(),
});

function resolveFacturaACuit(data: {
  necesitaFacturaA: boolean;
  usarMismosDatosFacturacion: boolean;
  tipoDocumento: 'DNI' | 'CUIT';
  documento: string;
  facturacionA?: z.infer<typeof facturacionASchema>;
}) {
  if (!data.necesitaFacturaA) return null;
  if (data.usarMismosDatosFacturacion && data.tipoDocumento === 'CUIT') {
    return data.documento?.trim() || null;
  }
  return data.facturacionA?.cuit?.trim() || null;
}

const facturaAFieldsRefine = (data: {
  necesitaFacturaA: boolean;
  usarMismosDatosFacturacion: boolean;
  tipoDocumento: 'DNI' | 'CUIT';
  documento: string;
  facturacionA?: z.infer<typeof facturacionASchema>;
}) => {
  if (!data.necesitaFacturaA) return true;

  const cuit = resolveFacturaACuit(data);
  if (!cuit || !/^\d{11}$/.test(cuit)) return false;

  if (!data.usarMismosDatosFacturacion) {
    if (!data.facturacionA) return false;
    if (!data.facturacionA.razonSocial || data.facturacionA.razonSocial.length < 2) return false;
    if (!data.facturacionA.nombreEmpresa || data.facturacionA.nombreEmpresa.length < 2) return false;
  }

  return true;
};

export const personalFormSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  tipoDocumento: z.enum(['DNI', 'CUIT']),
  documento: z.string().min(7, 'Documento inválido').max(11, 'Documento inválido'),
  phone: z.string().regex(/^\d{7,8}$/, 'Celular debe tener 7 u 8 dígitos'),
  phoneArea: z.string()
    .regex(/^\d{2,4}$/, 'Código de área debe tener 2-4 dígitos')
    .refine((val) => !val.startsWith('0'), {
      message: 'El código de área no debe comenzar con 0',
    }),
  necesitaFacturaA: z.boolean().default(false),
  usarMismosDatosFacturacion: z.boolean().default(true),
  facturacionA: facturacionASchema.optional(),
})
.refine((data) => {
  const fullPhone = `${data.phoneArea}${data.phone}`;
  return /^\d{9,11}$/.test(fullPhone);
}, {
  message: 'Teléfono completo debe tener 9-11 dígitos',
  path: ['phone'],
})
.refine(facturaAFieldsRefine, {
  message: 'Factura A requiere CUIT de 11 dígitos y datos de empresa completos',
  path: ['facturacionA', 'cuit'],
});

export type PersonalFormData = z.infer<typeof personalFormSchema>;

/** Schema reducido para usuario autenticado (solo DNI + facturación en checkout) */
export const personalFormSchemaAuthUser = z.object({
  tipoDocumento: z.enum(['DNI', 'CUIT']),
  documento: z.string().min(7, 'Documento inválido').max(11, 'Documento inválido'),
  necesitaFacturaA: z.boolean().default(false),
  usarMismosDatosFacturacion: z.boolean().default(true),
  facturacionA: facturacionASchema.optional(),
}).refine(facturaAFieldsRefine, {
  message: 'Factura A requiere CUIT de 11 dígitos y datos de empresa completos',
  path: ['facturacionA', 'cuit'],
});

export type PersonalFormDataAuthUser = z.infer<typeof personalFormSchemaAuthUser>;

export { resolveFacturaACuit };
