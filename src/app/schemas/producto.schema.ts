import { z } from 'zod';

const optionalNumberField = z
  .preprocess((val) => {
    // Si el valor es NaN, string vacío, null o undefined, retornar undefined
    if (val === undefined || val === null || val === '') return undefined;
    if (typeof val === 'number' && isNaN(val)) return undefined;
    return val;
  }, z.union([z.string(), z.number()]).optional())
  .transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
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
  codi_arti: z.string().min(1, 'El código de artículo es requerido').max(50, 'Máximo 50 caracteres'),
  nombre: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  descripcion: z.string().optional(),
  cod_sku: z.string().optional(),
  id_interno: z.string().optional(),
  modelo: z.string().optional(),
  codi_categoria: z.string().optional(),
  codi_marca: z.string().optional(),
  codi_grupo: z.string().optional(),
  codi_impuesto: z.string().optional(),
  // Campos legacy para compatibilidad
  id_cat: selectNumberField,
  id_subcat: selectNumberField,
  id_marca: selectNumberField,
  img_principal: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  destacado: z.boolean().default(false),
  financiacion: z.boolean().default(false),
  estado: selectNumberField,
  publicado: z.boolean().optional(),
});

export const productoStepTwoSchema = z
  .object({
    // Precios por lista (V=venta, O=especial, P=pvp, Q=campaña)
    precio_venta: optionalNumberField,
    precio_especial: optionalNumberField,
    precio_pvp: optionalNumberField,
    precio_campanya: optionalNumberField,
    lista_precio_activa: z.string().optional(), // Con cuál lista se publica: V | O | P | Q
    precio_mayorista: optionalNumberField,
    precio_minorista: optionalNumberField,
    precio_evento: optionalNumberField,
    precio_sin_iva: optionalNumberField,
    codi_barras: z.string().optional(),
    unidad_medida: z.string().optional(),
    unidades_por_producto: optionalNumberField,
    id_iva: optionalNumberField,
    stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0').optional().default(0),
    stock_min: optionalNumberField,
    stock_mayorista: optionalNumberField,
  })
  .refine(
    (data) => {
      const hasPrice =
        (data.precio_venta != null && data.precio_venta > 0) ||
        (data.precio_especial != null && data.precio_especial > 0) ||
        (data.precio_pvp != null && data.precio_pvp > 0) ||
        (data.precio_campanya != null && data.precio_campanya > 0);
      return hasPrice;
    },
    { message: 'Ingrese al menos un precio (por lista)', path: ['precio_venta'] }
  );

export const createProductoSchema = productoStepOneSchema.merge(productoStepTwoSchema);

export type ProductoStepOneData = z.infer<typeof productoStepOneSchema>;
export type ProductoStepTwoData = z.infer<typeof productoStepTwoSchema>;
export type CreateProductoData = z.infer<typeof createProductoSchema>;