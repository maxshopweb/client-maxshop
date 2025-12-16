import { z } from 'zod';

// Enums para validación
const MetodoPagoEnum = z.enum(['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'mercadopago', 'otro']);
const TipoVentaEnum = z.enum(['presencial', 'online', 'telefono']);
const EstadoPagoEnum = z.enum(['pendiente', 'aprobado', 'rechazado', 'cancelado']);
const EstadoEnvioEnum = z.enum(['pendiente', 'preparando', 'enviado', 'en_transito', 'entregado', 'cancelado']);

// Schema para detalle de venta
export const ventaDetalleSchema = z.object({
    id_prod: z.number().min(1, 'Debe seleccionar un producto'),
    cantidad: z.number()
        .min(1, 'La cantidad debe ser mayor a 0')
        .int('La cantidad debe ser un número entero'),
    precio_unitario: z.number()
        .min(0.01, 'El precio debe ser mayor a 0')
        .positive('El precio debe ser positivo'),
    descuento_aplicado: z.number()
        .min(0, 'El descuento no puede ser negativo')
        .optional()
        .default(0),
    evento_aplicado: z.number()
        .positive('El ID del evento debe ser positivo')
        .optional(),
}).refine((data) => {
    // Validar que el descuento no sea mayor al subtotal
    const subtotal = data.cantidad * data.precio_unitario;
    return (data.descuento_aplicado || 0) <= subtotal;
}, {
    message: 'El descuento no puede ser mayor al subtotal',
    path: ['descuento_aplicado'],
});

// Schema para información básica de la venta
export const ventaStepOneSchema = z.object({
    id_cliente: z.string()
        .optional()
        .refine((val) => !val || (val.trim().length > 0), {
            message: 'El ID del cliente no puede estar vacío',
        }),
    metodo_pago: z.union([MetodoPagoEnum, z.literal('')])
        .refine((val) => val !== '', {
            message: 'Debe seleccionar un método de pago',
        })
        .transform((val) => val as z.infer<typeof MetodoPagoEnum>),
    tipo_venta: z.union([TipoVentaEnum, z.literal('')])
        .refine((val) => val !== '', {
            message: 'Debe seleccionar un tipo de venta',
        })
        .transform((val) => val as z.infer<typeof TipoVentaEnum>),
    observaciones: z.string()
        .max(500, 'Las observaciones no pueden exceder 500 caracteres')
        .optional(),
});

// Schema para los detalles (productos) de la venta
export const ventaStepTwoSchema = z.object({
    detalles: z.array(ventaDetalleSchema).min(1, 'Debe agregar al menos un producto'),
});

// Schema completo para crear venta
export const createVentaSchema = ventaStepOneSchema.merge(ventaStepTwoSchema);

// Schema para actualizar venta
export const updateVentaSchema = z.object({
    estado_pago: EstadoPagoEnum.optional(),
    estado_envio: EstadoEnvioEnum.optional(),
    metodo_pago: MetodoPagoEnum.optional(),
    observaciones: z.string().optional(),
    id_envio: z.string().optional(),
});

// Tipos inferidos
export type VentaDetalleData = z.infer<typeof ventaDetalleSchema>;
export type VentaStepOneData = z.infer<typeof ventaStepOneSchema>;
export type VentaStepTwoData = z.infer<typeof ventaStepTwoSchema>;
export type CreateVentaData = z.infer<typeof createVentaSchema>;
export type UpdateVentaData = z.infer<typeof updateVentaSchema>;

