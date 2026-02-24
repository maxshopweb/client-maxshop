'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ImageOff } from 'lucide-react';
import type { IBanner } from '@/app/types/banner.type';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';

const MAX_BANNERS = 5;

interface BannerSlotProps {
  orden: number;
  banner: IBanner | null;
  isFirst: boolean;
  isLast: boolean;
  isUploading: boolean;
  onUpload: (id: number, file: File) => void;
  onCreate: (orden: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  onDeleteClick: (banner: IBanner) => void;
  totalBanners: number;
}

export function BannerSlot({
  orden,
  banner,
  isFirst,
  isLast,
  isUploading,
  onUpload,
  onCreate,
  onToggleActivo,
  onMoveUp,
  onMoveDown,
  onDeleteClick,
  totalBanners,
}: BannerSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !banner) return;
    onUpload(banner.id, file);
    e.target.value = '';
  }

  if (!banner) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-principal/20 dark:border-white/10">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-principal/10 text-principal font-bold text-sm">
          {orden}
        </div>
        <p className="text-sm text-text/40 flex-1">Posición {orden} — vacía</p>
        {totalBanners < MAX_BANNERS && (
          <Button
            variant="secondary"
            className="text-xs px-3 py-1.5"
            onClick={() => onCreate(orden)}
          >
            + Agregar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
      banner.activo
        ? 'border-green-400/40 dark:border-green-500/30 bg-green-50/30 dark:bg-green-900/5'
        : 'border-principal/15 dark:border-white/10 bg-white dark:bg-secundario'
    }`}>
      {/* Número de posición */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
          banner.activo ? 'bg-green-100 dark:bg-green-700/60 text-green-900 dark:text-white' : 'bg-principal/10 text-principal'
        }`}>
          {banner.orden}
        </div>
        {/* Mover arriba/abajo */}
        <button
          onClick={() => onMoveUp(banner.id)}
          disabled={isFirst}
          className="p-1 rounded text-text/40 hover:text-principal disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Subir posición"
        >
          <ArrowUp size={14} />
        </button>
        <button
          onClick={() => onMoveDown(banner.id)}
          disabled={isLast}
          className="p-1 rounded text-text/40 hover:text-principal disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Bajar posición"
        >
          <ArrowDown size={14} />
        </button>
      </div>

      {/* Preview de imagen */}
      <div
        className="relative shrink-0 w-32 h-20 rounded-lg overflow-hidden border border-principal/10 dark:border-white/10 bg-gray-100 dark:bg-gray-800 cursor-pointer group"
        onClick={() => inputRef.current?.click()}
        title="Clic para cambiar imagen"
      >
        {banner.url ? (
          <>
            <Image src={banner.url} alt={`Banner ${banner.orden}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-text/30 group-hover:text-principal transition-colors">
            <ImageOff size={20} />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {/* Info y link */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text/50 uppercase tracking-wide">
            Posición {banner.orden}
          </span>
          <Badge variant={banner.activo ? 'success' : 'neutral'}>
            {banner.activo ? 'Publicado' : 'Inactivo'}
          </Badge>
          {!banner.path_img && (
            <Badge variant="warning">Sin imagen</Badge>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="shrink-0 flex flex-col gap-1.5 items-end">
        {/* Upload */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          title="Subir imagen"
          className="p-1.5 rounded-lg text-text/50 hover:text-principal hover:bg-principal/10 transition-colors disabled:opacity-40"
        >
          <Upload size={15} />
        </button>

        {/* Activar / Desactivar */}
        <button
          onClick={() => onToggleActivo(banner.id, !banner.activo)}
          disabled={!banner.path_img && !banner.activo}
          title={banner.activo ? 'Desactivar' : 'Activar'}
          className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            banner.activo
              ? 'text-green-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-text/40 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
        >
          {banner.activo ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>

        {/* Eliminar */}
        <button
          onClick={() => onDeleteClick(banner)}
          title="Eliminar banner"
          className="p-1.5 rounded-lg text-text/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
