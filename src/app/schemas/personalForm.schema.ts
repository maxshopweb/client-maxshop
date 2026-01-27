import { z } from 'zod';

// Schema para datos de facturación A (todos opcionales, validación condicional)
const facturacionASchema = z.object({
  razonSocial: z.string().optional(),
  nombreEmpresa: z.string().optional(),
  cuit: z.string().optional(),
  domicilioFiscal: z.string().optional(),
  ciudadFiscal: z.string().optional(),
  provinciaFiscal: z.string().optional(),
  codigoPostalFiscal: z.string().optional(),
});

export const personalFormSchema = z.object({
  // Información de contacto
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
  
  // Facturación
  necesitaFacturaA: z.boolean().default(false),
  usarMismosDatosFacturacion: z.boolean().default(true),
  
  // Datos de facturación A (condicional)
  facturacionA: facturacionASchema.optional(),
})
.refine((data) => {
  // Validar que phoneArea + phone tenga 9-11 dígitos
  const fullPhone = `${data.phoneArea}${data.phone}`;
  if (!/^\d{9,11}$/.test(fullPhone)) {
    return false;
  }
  return true;
}, {
  message: 'Teléfono completo debe tener 9-11 dígitos',
  path: ['phone'],
})
.refine((data) => {
  // Si necesita factura A y no usa los mismos datos, debe completar facturaciónA
  if (data.necesitaFacturaA && !data.usarMismosDatosFacturacion) {
    if (!data.facturacionA) return false;
    if (!data.facturacionA.razonSocial || data.facturacionA.razonSocial.length < 2) return false;
    if (!data.facturacionA.nombreEmpresa || data.facturacionA.nombreEmpresa.length < 2) return false;
    if (!data.facturacionA.cuit || !/^\d{11}$/.test(data.facturacionA.cuit)) return false;
  }
  return true;
}, {
  message: 'Debe completar los datos de facturación A (Razón Social, Nombre de Empresa y CUIT)',
  path: ['facturacionA'],
});

export type PersonalFormData = z.infer<typeof personalFormSchema>;


