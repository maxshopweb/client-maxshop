'use client';

import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { buildImageUrl } from '@/app/lib/upload';
import type { IProductos } from '@/app/types/producto.type';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const BOX_CLASS = 'w-full aspect-square max-h-[200px] rounded-lg border border-input bg-input/30 flex items-center justify-center overflow-hidden';

interface ProductoImagenesEditorProps {
  mode: 'create' | 'edit';
  product?: IProductos | null;
  mainFile: File | null;
  setMainFile: (f: File | null) => void;
  secondaryFiles: File[];
  setSecondaryFiles: (f: File[] | ((prev: File[]) => File[])) => void;
  existingSecondaryPaths?: string[];
  setExistingSecondaryPaths?: (paths: string[]) => void;
}

export function ProductoImagenesEditor({
  mode,
  product,
  mainFile,
  setMainFile,
  secondaryFiles,
  setSecondaryFiles,
  existingSecondaryPaths = [],
  setExistingSecondaryPaths,
}: ProductoImagenesEditorProps) {
  const mainInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  const mainPreviewUrl = mainFile ? URL.createObjectURL(mainFile) : null;
  const existingMainUrl = mode === 'edit' && product?.img_principal ? buildImageUrl(product.img_principal) : null;
  const showMainPreview = mainPreviewUrl ?? existingMainUrl;

  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMainFile(file ?? null);
    e.target.value = '';
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(files) : [];
    setSecondaryFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeSecondaryFile = (index: number) => {
    setSecondaryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingSecondary = (index: number) => {
    if (setExistingSecondaryPaths) {
      setExistingSecondaryPaths(existingSecondaryPaths.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 px-2">
      {/* Imagen principal */}
      <div className="rounded-xl border border-input/50 bg-card/50 p-4 shadow-sm">
        <label className="block text-sm font-medium text-input mb-3">Imagen principal</label>
        <div className={BOX_CLASS}>
          {showMainPreview ? (
            <img
              src={mainPreviewUrl ?? existingMainUrl ?? ''}
              alt="Principal"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-input/60">
              <ImagePlus className="w-10 h-10" />
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            ref={mainInputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={handleMainChange}
          />
          <button
            type="button"
            onClick={() => mainInputRef.current?.click()}
            className="text-sm px-4 py-2 rounded-xl border border-input hover:bg-input/30 text-input transition-colors font-medium"
          >
            {showMainPreview ? 'Reemplazar' : 'Elegir imagen'}
          </button>
          {mainFile && (
            <button
              type="button"
              onClick={() => setMainFile(null)}
              className="text-sm px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* Imágenes secundarias */}
      <div className="rounded-xl border border-input/50 bg-card/50 p-4 shadow-sm">
        <label className="block text-sm font-medium text-input mb-3">Imágenes secundarias</label>
        <div className="flex flex-wrap gap-3">
          {existingSecondaryPaths.map((path, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className={`${BOX_CLASS} w-[120px] max-h-[120px] rounded-xl overflow-hidden ring-1 ring-input/30`}>
                <img
                  src={buildImageUrl(path)}
                  alt={`Secundaria ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {mode === 'edit' && setExistingSecondaryPaths && (
                <button
                  type="button"
                  onClick={() => removeExistingSecondary(index)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                  aria-label="Quitar"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {secondaryFiles.map((file, index) => (
            <div key={`new-${index}`} className="relative group">
              <div className={`${BOX_CLASS} w-[120px] max-h-[120px] rounded-xl overflow-hidden ring-1 ring-input/30`}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Nueva ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSecondaryFile(index)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                aria-label="Quitar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className={`${BOX_CLASS} w-[120px] max-h-[120px] min-h-[100px] border-2 border-dashed border-input/50 rounded-xl hover:border-principal/50 hover:bg-principal/5 transition-colors`}>
            <input
              ref={secondaryInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={handleSecondaryChange}
            />
            <button
              type="button"
              onClick={() => secondaryInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-1 text-input/60 hover:text-principal transition-colors rounded-xl"
            >
              <ImagePlus className="w-8 h-8" />
              <span className="text-xs font-medium">Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
