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

export const contactFormSchema = z.object({
  // Información de contacto
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  tipoDocumento: z.enum(['DNI', 'CUIT'], {
    required_error: 'Debe seleccionar tipo de documento',
  }),
  documento: z.string().min(7, 'Documento inválido').max(11, 'Documento inválido'),
  phone: z.string().regex(/^\d{10,11}$/, 'Teléfono debe tener 10-11 dígitos'),
  
  // Dirección de envío
  address: z.string().min(5, 'Dirección completa requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(1, 'Provincia requerida'),
  postalCode: z.string().regex(/^\d{4,5}$/, 'Código postal inválido'),
  
  // Campos de geocodificación (opcionales, llenados por OpenCage)
  direccion_formateada: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  
  // Facturación
  necesitaFacturaA: z.boolean().default(false),
  usarMismosDatosFacturacion: z.boolean().default(true),
  mismaDireccionEnvio: z.boolean().default(true),
  
  // Datos de facturación A (condicional)
  facturacionA: facturacionASchema.optional(),
}).refine((data) => {
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
}).refine((data) => {
  // Si necesita factura A y no es la misma dirección de envío, debe completar domicilio fiscal
  if (data.necesitaFacturaA && !data.mismaDireccionEnvio) {
    if (!data.facturacionA) return false;
    if (!data.facturacionA.domicilioFiscal || data.facturacionA.domicilioFiscal.length < 5) return false;
    if (!data.facturacionA.ciudadFiscal || data.facturacionA.ciudadFiscal.length < 2) return false;
    if (!data.facturacionA.provinciaFiscal || data.facturacionA.provinciaFiscal.length < 1) return false;
    if (!data.facturacionA.codigoPostalFiscal || !/^\d{4,5}$/.test(data.facturacionA.codigoPostalFiscal)) return false;
  }
  return true;
}, {
  message: 'Debe completar el domicilio fiscal completo',
  path: ['facturacionA', 'domicilioFiscal'],
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

