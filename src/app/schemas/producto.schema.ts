import { z } from 'zod';

const optionalNumberField = z
  .union([z.string(), z.number()])
  .optional()
  .transform((val) => {
    if (!val || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });


const selectNumberField = z
  .union([z.string(), z.number()])
  .optional()
  .transform((val) => {
    if (!val || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

export const productoStepOneSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  descripcion: z.string().optional(),
  cod_sku: z.string().optional(),
  id_interno: z.string().optional(),
  modelo: z.string().optional(),
  id_cat: selectNumberField,
  id_subcat: selectNumberField,
  id_marca: selectNumberField,
  img_principal: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  destacado: z.boolean().default(false),
  financiacion: z.boolean().default(false),
  estado: selectNumberField
});

export const productoStepTwoSchema = z.object({
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  precio_mayorista: optionalNumberField,
  precio_minorista: optionalNumberField,
  precio_evento: optionalNumberField,
  id_iva: optionalNumberField,
  stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
  stock_min: optionalNumberField,
  stock_mayorista: optionalNumberField,
});

export const createProductoSchema = productoStepOneSchema.merge(productoStepTwoSchema);

export type ProductoStepOneData = z.infer<typeof productoStepOneSchema>;
export type ProductoStepTwoData = z.infer<typeof productoStepTwoSchema>;
export type CreateProductoData = z.infer<typeof createProductoSchema>;