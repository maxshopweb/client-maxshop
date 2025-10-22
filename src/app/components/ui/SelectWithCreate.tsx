import { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { ChevronDown, Plus, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';

interface SelectOption {
    value: string | number;
    label: string;
}

interface InlineCreateForm {
    nombre: string;
    descripcion?: string;
    id_cat?: number; // Para subcategorías
}

interface SelectWithCreateProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    // Props para creación inline
    canCreate?: boolean;
    createLabel?: string; // "Crear Marca", "Crear Categoría"
    onCreateSubmit?: (data: InlineCreateForm) => Promise<any>;
    isCreating?: boolean;
    // Para subcategorías que necesitan id_cat
    parentId?: number;
    needsParent?: boolean;
    parentLabel?: string;
}

const SelectWithCreate = forwardRef<HTMLSelectElement, SelectWithCreateProps>(
    ({
        label,
        error,
        options,
        placeholder = 'Seleccionar',
        disabled,
        className,
        canCreate = false,
        createLabel = 'Crear nuevo',
        onCreateSubmit,
        isCreating = false,
        parentId,
        needsParent = false,
        parentLabel = 'categoría',
        onChange,
        ...props
    }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [isCreatingMode, setIsCreatingMode] = useState(false);

        const { register, handleSubmit, reset, formState: { errors: formErrors } } = useForm<InlineCreateForm>();

        const handleCreate = async (data: InlineCreateForm) => {
            if (!onCreateSubmit) return;

            try {
                const result = await onCreateSubmit({
                    ...data,
                    ...(needsParent && parentId ? { id_cat: parentId } : {})
                });

                // Resetear form y cerrar
                reset();
                setIsCreatingMode(false);

                // Auto-seleccionar el nuevo item
                if (result?.data?.id) {
                    const event = {
                        target: { value: result.data.id }
                    } as any;
                    onChange?.(event);
                }
            } catch (err) {
                console.error('Error al crear:', err);
            }
        };

        const cancelCreate = () => {
            reset();
            setIsCreatingMode(false);
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-input mb-1.5">
                        {label}
                    </label>
                )}

                <div className="space-y-2">
                    {/* SELECT */}
                    <div className="relative group">
                        <select
                            ref={ref}
                            disabled={disabled || isCreatingMode}
                            onMouseDown={() => setIsOpen(!isOpen)}
                            onBlur={() => setIsOpen(false)}
                            onChange={(e) => {
                                setIsOpen(false);
                                onChange?.(e);
                            }}
                            className={clsx(
                                'w-full px-4 py-2.5 pr-10 rounded-2xl font-medium transition-all duration-300 appearance-none',
                                'focus:outline-none focus:ring-2 focus:ring-principal focus:shadow-lg focus:shadow-principal/20',
                                'bg-input border-2 border-input text-input',
                                'hover:border-principal/50 hover:shadow-md',
                                (disabled || isCreatingMode) && 'opacity-40 cursor-not-allowed hover:border-input hover:shadow-none',
                                error && 'border-red-500 focus:ring-red-500 focus:shadow-red-500/20',
                                className
                            )}
                            {...props}
                        >
                            <option value="">{placeholder}</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className={clsx(
                            'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300',
                            isOpen && 'rotate-180',
                            (disabled || isCreatingMode) && 'opacity-40'
                        )}>
                            <ChevronDown className="w-5 h-5 text-principal" />
                        </div>
                    </div>

                    {/* BOTÓN + CREAR */}
                    {canCreate && !isCreatingMode && (
                        <button
                            type="button"
                            onClick={() => {
                                if (needsParent && !parentId) return;
                                setIsCreatingMode(true);
                            }}
                            disabled={disabled || (needsParent && !parentId)}
                            className={clsx(
                                'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-2xl',
                                'border-2 border-dashed transition-all duration-300',
                                'text-sm font-medium',
                                (needsParent && !parentId)
                                    ? 'border-input/30 text-input/40 cursor-not-allowed'
                                    : 'border-principal/30 text-principal hover:border-principal hover:bg-principal/5'
                            )}
                        >
                            <Plus className="w-4 h-4" />
                            {needsParent && !parentId
                                ? `Selecciona ${parentLabel} primero`
                                : createLabel
                            }
                        </button>
                    )}

                    {/* FORM INLINE (EXPANDIBLE) */}
                    <div className={clsx(
                        'overflow-hidden transition-all duration-300',
                        isCreatingMode ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    )}>
                        <form
                            onSubmit={handleSubmit(handleCreate)}
                            className="p-4 bg-card border-2 border-principal/20 rounded-2xl space-y-3"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-principal">
                                    {createLabel}
                                </h4>
                                <button
                                    type="button"
                                    onClick={cancelCreate}
                                    className="text-input/60 hover:text-principal transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <Input
                                label="Nombre *"
                                placeholder="Ingresa el nombre"
                                {...register('nombre', { required: 'El nombre es requerido' })}
                                error={formErrors.nombre?.message}
                                disabled={isCreating}
                            />

                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Descripción
                                </label>
                                <textarea
                                    {...register('descripcion')}
                                    placeholder="Descripción opcional..."
                                    rows={2}
                                    disabled={isCreating}
                                    className="w-full px-3 py-2.5 bg-input border-2 border-input rounded-2xl text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-2 flex justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={cancelCreate}
                                    disabled={isCreating}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>Creando...</>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Guardar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

SelectWithCreate.displayName = 'SelectWithCreate';

export default SelectWithCreate;