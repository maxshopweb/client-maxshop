import { z } from 'zod';

// Tipo base para el formulario
export type DatosEnvioFormData = {
  tipo: 'envio' | 'retiro';
  calle?: string;
  numero?: string;
  piso?: string;
  departamento?: string;
  codigo_postal?: string;
  ciudad?: string;
  provincia?: string;
  telefono?: string;
  sucursal?: string;
  fecha_retiro?: string;
  horario_retiro?: string;
};

// Schema con validación condicional
export const datosEnvioSchema = z.object({
  tipo: z.enum(['envio', 'retiro']),
  calle: z.string().optional(),
  numero: z.string().optional(),
  piso: z.string().optional(),
  departamento: z.string().optional(),
  codigo_postal: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  telefono: z.string().optional(),
  sucursal: z.string().optional(),
  fecha_retiro: z.string().optional(),
  horario_retiro: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.tipo === 'envio') {
    if (!data.calle || data.calle.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La calle es requerida',
        path: ['calle'],
      });
    }
    if (!data.numero || data.numero.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número es requerido',
        path: ['numero'],
      });
    }
    if (!data.codigo_postal || data.codigo_postal.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El código postal es requerido',
        path: ['codigo_postal'],
      });
    } else if (!/^[0-9]{4}$/.test(data.codigo_postal)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El código postal debe tener 4 dígitos',
        path: ['codigo_postal'],
      });
    }
    if (!data.ciudad || data.ciudad.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La ciudad es requerida',
        path: ['ciudad'],
      });
    }
    if (!data.provincia || data.provincia.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La provincia es requerida',
        path: ['provincia'],
      });
    }
    if (!data.telefono || data.telefono.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El teléfono es requerido',
        path: ['telefono'],
      });
    }
  } else if (data.tipo === 'retiro') {
    if (!data.sucursal || data.sucursal.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe seleccionar una sucursal',
        path: ['sucursal'],
      });
    }
  }
});

