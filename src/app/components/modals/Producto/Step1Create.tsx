import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { Package, Tag, FileText } from 'lucide-react';
import { useCategorias } from '@/app/hooks/categorias/useCategorias';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import { useGrupos } from '@/app/hooks/grupos/useGrupos';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ICategoria } from '@/app/types/categoria.type';
import { IMarca } from '@/app/types/marca.type';
import Select from '@/app/components/ui/Select';

interface StepOneProps {
    form: UseFormReturn<CreateProductoData>;
    /** ID del producto (solo en edición). Se muestra como "ID interno" en solo lectura. */
    idProd?: number;
}

export function StepOneBasicInfo({ form, idProd }: StepOneProps) {
    const { register, watch, setValue, formState: { errors } } = form;

    const { data: categorias, isLoading: loadingCategorias } = useCategorias();
    const { data: marcas, isLoading: loadingMarcas } = useMarcas();
    const { data: gruposResponse, isLoading: loadingGrupos } = useGrupos();

    const categoriasList: ICategoria[] = Array.isArray(categorias?.data)
        ? categorias.data
        : categorias?.data
            ? [categorias.data]
            : [];

    const marcasList: IMarca[] = Array.isArray(marcas?.data)
        ? marcas.data
        : marcas?.data
            ? [marcas.data]
            : [];

    const gruposList = Array.isArray(gruposResponse?.data) ? gruposResponse.data : [];

    const codiGrupoWatched = watch('codi_grupo');
    const normalizedGrupoForSelect = (() => {
        if (!codiGrupoWatched) return '';
        const raw = String(codiGrupoWatched).trim();
        if (!raw) return '';
        const normalized = raw.replace(/^0+/, '') || '0';
        const g = gruposList.find((gr: { codi_grupo?: string }) =>
            String(gr.codi_grupo || '').trim().replace(/^0+/, '') === normalized
        );
        return g ? String(g.codi_grupo || '') : raw;
    })();

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Información básica del producto
            </h3>

            {/* FILA 1: SKU (código de artículo) + Nombre */}
            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="SKU *"
                    placeholder="Ej: ART-001"
                    icon={Tag}
                    {...register('codi_arti')}
                    error={errors.codi_arti?.message}
                />
                <Input
                    label="Nombre del producto *"
                    placeholder="Ej: Taladro Inalámbrico 20V"
                    icon={Package}
                    {...register('nombre')}
                    error={errors.nombre?.message}
                />
            </div>

            {/* CREAR: solo Modelo + Código de barras. EDITAR: ID interno + Modelo + Código de barras */}
            {idProd != null ? (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-input">ID interno</label>
                            <div
                                className="w-full px-3 py-2.5 rounded-sm bg-input/50 border border-input text-sm text-foreground/80"
                                style={{ borderColor: 'var(--outline-subtle)' }}
                            >
                                {idProd}
                            </div>
                        </div>
                        <Input
                            label="Modelo"
                            placeholder="Ej: DCD771C2"
                            icon={FileText}
                            maxLength={50}
                            {...register('modelo')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Código de barras"
                            placeholder="1234567890123"
                            {...register('codi_barras')}
                        />
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Modelo"
                        placeholder="Ej: DCD771C2"
                        icon={FileText}
                        maxLength={50}
                        {...register('modelo')}
                    />
                    <Input
                        label="Código de barras"
                        placeholder="1234567890123"
                        {...register('codi_barras')}
                    />
                </div>
            )}

            <div className="grid grid-cols-3 gap-3">
                <Select
                    label="Categoria"
                    options={categoriasList.map((cat) => {
                        const optValue = (cat.codi_categoria && String(cat.codi_categoria).trim()) || (cat.id_cat != null ? String(cat.id_cat) : '');
                        return {
                            value: optValue || `cat-${cat.id_cat ?? ''}`,
                            label: `${cat.nombre || ''} ${cat.codi_categoria ? `(${cat.codi_categoria})` : ''}`.trim() || optValue
                        };
                    }).filter((o) => o.value)}
                    placeholder="Seleccionar"
                    disabled={loadingCategorias}
                    value={(() => {
                        const codi = watch('codi_categoria');
                        const idCat = watch('id_cat');
                        if (codi && String(codi).trim()) return String(codi).trim();
                        if (idCat != null && idCat !== '') return String(idCat);
                        return '';
                    })()}
                    onChange={(value) => {
                        const strVal = String(value);
                        const selectedCat = categoriasList.find((cat) =>
                            (cat.codi_categoria && String(cat.codi_categoria).trim() === strVal) ||
                            (cat.id_cat != null && String(cat.id_cat) === strVal)
                        );
                        if (selectedCat) {
                            setValue('codi_categoria', selectedCat.codi_categoria && String(selectedCat.codi_categoria).trim() ? selectedCat.codi_categoria : undefined, { shouldDirty: true });
                            setValue('id_cat', selectedCat.id_cat ?? undefined, { shouldDirty: true });
                        }
                    }}
                />

                <Select
                    label="Grupo"
                    preserveString
                    options={gruposList.map((g) => ({
                        value: (g.codi_grupo && String(g.codi_grupo).trim()) || '',
                        label: `${g.nombre || ''} ${g.codi_grupo ? `(${g.codi_grupo})` : ''}`.trim() || g.codi_grupo || ''
                    })).filter((o) => o.value)}
                    placeholder="Seleccionar grupo"
                    disabled={loadingGrupos}
                    value={normalizedGrupoForSelect}
                    onChange={(value) => setValue('codi_grupo', value && String(value).trim() ? String(value) : undefined, { shouldDirty: true })}
                />

                <Select
                    label="Marca"
                    options={marcasList.map((marca) => {
                        const optValue = (marca.codi_marca && String(marca.codi_marca).trim()) || (marca.id_marca != null ? String(marca.id_marca) : '');
                        return {
                            value: optValue || `marca-${marca.id_marca ?? ''}`,
                            label: `${marca.nombre || ''} ${marca.codi_marca ? `(${marca.codi_marca})` : ''}`.trim() || optValue
                        };
                    }).filter((o) => o.value)}
                    placeholder="Seleccionar marca"
                    disabled={loadingMarcas}
                    value={(() => {
                        const codi = watch('codi_marca');
                        const idMar = watch('id_marca');
                        if (codi && String(codi).trim()) return String(codi).trim();
                        if (idMar != null && idMar !== '') return String(idMar);
                        return '';
                    })()}
                    onChange={(value) => {
                        const strVal = String(value);
                        const selectedMarca = marcasList.find((marca) =>
                            (marca.codi_marca && String(marca.codi_marca).trim() === strVal) ||
                            (marca.id_marca != null && String(marca.id_marca) === strVal)
                        );
                        if (selectedMarca) {
                            setValue('codi_marca', selectedMarca.codi_marca && String(selectedMarca.codi_marca).trim() ? selectedMarca.codi_marca : undefined, { shouldDirty: true });
                            setValue('id_marca', selectedMarca.id_marca ?? undefined, { shouldDirty: true });
                        }
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-input mb-1.5">
                    Descripcion
                </label>
                <textarea
                    {...register('descripcion')}
                    placeholder="Describe las características del producto..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-input border border-input rounded-2xl text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all resize-none"
                />
            </div>
        </div>
    );
}
