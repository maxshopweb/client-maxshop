import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import type { CreateVentaData } from '@/app/schemas/venta.schema';
import { useProductos } from '@/app/hooks/productos/useProductos';
import Select from '@/app/components/ui/Select';

interface StepTwoProps {
    form: UseFormReturn<CreateVentaData>;
}

export function StepTwoVentaDetalles({ form }: StepTwoProps) {
    const { control, watch, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'detalles',
    });

    // Obtener productos para el selector
    const { productos } = useProductos({ 
        filters: { 
            limit: 100,
            estado: 1 // Solo activos
        } 
    });

    const addDetalle = () => {
        append({
            id_prod: 0,
            cantidad: 1,
            precio_unitario: 0,
            descuento_aplicado: 0,
        });
    };

    const calcularSubtotal = (index: number) => {
        const detalle = watch(`detalles.${index}`);
        if (!detalle) return 0;
        const cantidad = detalle.cantidad || 0;
        const precio = detalle.precio_unitario || 0;
        const descuento = detalle.descuento_aplicado || 0;
        return (cantidad * precio) - descuento;
    };

    const calcularTotal = () => {
        return fields.reduce((total, _, index) => {
            return total + calcularSubtotal(index);
        }, 0);
    };

    const handleProductoChange = (index: number, productoId: number) => {
        const producto = productos.find(p => p.id_prod === productoId);
        if (producto) {
            // Usar las propiedades del producto directamente del tipo IProductos
            form.setValue(`detalles.${index}.id_prod`, productoId);
            
            // Usar el precio de lista del producto (precio principal)
            // Prioridad: precio > precio_sin_iva > precio_minorista
            const precioBase = producto.precio 
                ? Number(producto.precio) 
                : producto.precio_sin_iva 
                    ? Number(producto.precio_sin_iva) 
                    : producto.precio_minorista 
                        ? Number(producto.precio_minorista) 
                        : 0;
            
            form.setValue(`detalles.${index}.precio_unitario`, precioBase);
            
            // Si hay stock disponible, podemos mostrar una advertencia si la cantidad excede el stock
            // pero no limitamos automáticamente para permitir ventas futuras
        }
    };

    const getProductoInfo = (productoId: number) => {
        return productos.find(p => p.id_prod === productoId);
    };

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto px-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-input">
                    Productos de la venta
                </h3>
                <Button
                    type="button"
                    onClick={addDetalle}
                    variant="secondary"
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                    Agregar producto
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay productos agregados</p>
                    <p className="text-sm">Haz clic en "Agregar producto" para comenzar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="p-4 border border-input rounded-lg bg-card space-y-3"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-input">
                                    Producto #{index + 1}
                                </span>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                        variant="danger"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Producto */}
                            <div className="space-y-2">
                                <Select
                                    label="Producto *"
                                    icon={Package}
                                    iconPosition="left"
                                    options={[
                                        { value: '', label: 'Seleccionar producto' },
                                        ...productos.map(prod => ({
                                            value: prod.id_prod.toString(),
                                            label: `${prod.nombre || 'Sin nombre'} - ${prod.codi_arti || 'Sin código'}`,
                                        }))
                                    ]}
                                    value={watch(`detalles.${index}.id_prod`)?.toString() || ''}
                                    onChange={(value) => handleProductoChange(index, Number(value))}
                                    error={errors.detalles?.[index]?.id_prod?.message}
                                />
                                
                                {/* Mostrar información del producto seleccionado */}
                                {watch(`detalles.${index}.id_prod`) && (() => {
                                    const producto = getProductoInfo(watch(`detalles.${index}.id_prod`));
                                    if (producto) {
                                        return (
                                            <div className="text-xs text-gray-500 space-y-1 pl-1">
                                                {producto.stock !== null && producto.stock !== undefined && (
                                                    <p>Stock disponible: {producto.stock}</p>
                                                )}
                                                {producto.precio && (
                                                    <p>Precio base: ${Number(producto.precio).toFixed(2)}</p>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Cantidad */}
                                <Input
                                    label="Cantidad *"
                                    type="number"
                                    min="1"
                                    {...form.register(`detalles.${index}.cantidad`, {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.detalles?.[index]?.cantidad?.message}
                                />

                                {/* Precio Unitario */}
                                <Input
                                    label="Precio unitario *"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    {...form.register(`detalles.${index}.precio_unitario`, {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.detalles?.[index]?.precio_unitario?.message}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Descuento */}
                                <Input
                                    label="Descuento"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    {...form.register(`detalles.${index}.descuento_aplicado`, {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.detalles?.[index]?.descuento_aplicado?.message}
                                />

                                {/* Subtotal */}
                                <div>
                                    <label className="block text-sm font-medium text-input mb-1.5">
                                        Subtotal
                                    </label>
                                    <div className="px-3 py-2.5 bg-input border border-input rounded-2xl text-input text-sm font-semibold">
                                        ${calcularSubtotal(index).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="mt-4 p-4 bg-principal/10 border border-principal/30 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-input">Total:</span>
                            <span className="text-2xl font-bold text-principal">
                                ${calcularTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {errors.detalles && typeof errors.detalles === 'object' && 'message' in errors.detalles && (
                <p className="text-red-500 text-xs mt-1">{errors.detalles.message as string}</p>
            )}
        </div>
    );
}

