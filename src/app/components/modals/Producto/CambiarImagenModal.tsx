'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ModalBase from '@/app/components/modals/BaseModal';
import { ProductoImagenesEditor } from './ProductoImagenesEditor';
import { uploadService } from '@/app/services/upload.service';
import { productosService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/hooks/productos/useProductos';
import type { IProductos } from '@/app/types/producto.type';

interface CambiarImagenModalProps {
    product: IProductos;
    onClose: () => void;
}

export function CambiarImagenModal({ product, onClose }: CambiarImagenModalProps) {
    const queryClient = useQueryClient();
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
    const [existingSecondaryPaths, setExistingSecondaryPaths] = useState<string[]>(
        Array.isArray(product.imagenes) ? [...product.imagenes] : []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSecondarySection, setShowSecondarySection] = useState(
        () => Array.isArray(product.imagenes) && product.imagenes.length > 0
    );

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const idProd = product.id_prod;
            let mainPath = product.img_principal ?? undefined;

            if (mainFile) {
                const res = await uploadService.uploadProductImage(idProd, mainFile);
                mainPath = res.path;
            }

            const newPaths: string[] = [];
            for (const file of secondaryFiles) {
                const res = await uploadService.uploadProductSecondaryImage(idProd, file);
                newPaths.push(res.path);
            }

            const finalImagenes = [...existingSecondaryPaths, ...newPaths];

            await productosService.update(idProd, {
                img_principal: mainPath,
                imagenes: finalImagenes.length ? finalImagenes : undefined,
            });

            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productosKeys.detail(idProd) });
            queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });
            queryClient.invalidateQueries({ queryKey: productosKeys.stockBajo() });

            toast.success('Imágenes actualizadas');
            onClose();
        } catch (error: any) {
            toast.error('Error al guardar imágenes', {
                description: error?.message ?? 'Intente de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBase isOpen={true} onClose={onClose} fitContent maxWidth="max-w-[92vw]">
            {({ handleClose }) => (
                <div className="flex flex-col flex-1 min-h-0 min-w-[320px] py-6 px-6 animate-bounce-in overflow-hidden">
                    <div className="shrink-0 mb-4">
                        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                            Cambiar imágenes
                        </h2>
                        {product.nombre && (
                            <p className="text-sm text-input/70 mt-1 truncate">{product.nombre}</p>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex flex-col pb-1 min-w-0">
                        <ProductoImagenesEditor
                            mode="edit"
                            layout="row"
                            product={product}
                            mainFile={mainFile}
                            setMainFile={setMainFile}
                            secondaryFiles={secondaryFiles}
                            setSecondaryFiles={setSecondaryFiles}
                            existingSecondaryPaths={existingSecondaryPaths}
                            setExistingSecondaryPaths={setExistingSecondaryPaths}
                            showSecondarySection={showSecondarySection}
                            onRequestSecondary={() => setShowSecondarySection(true)}
                        />
                    </div>

                    <div className="shrink-0 flex justify-end gap-3 mt-4 pt-4 border-t border-input/40">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2.5 rounded-xl border border-input text-input hover:bg-input/20 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-principal text-white hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-sm"
                        >
                            {isSubmitting ? 'Guardando…' : 'Guardar'}
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}
