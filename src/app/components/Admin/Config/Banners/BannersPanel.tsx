'use client';

import { useState } from 'react';
import { Monitor, Smartphone, ImageOff } from 'lucide-react';
import type { IBanner, BannerTipo } from '@/app/types/banner.type';
import {
  useBannersAdmin,
  useCreateBanner,
  useUploadBannerImage,
  useToggleBannerActivo,
  useUpdateBanner,
  useDeleteBanner,
} from '@/app/hooks/banners';
import { BannerSlot } from './BannerSlot';
import ModalBase from '@/app/components/modals/BaseModal';
import { Button } from '@/app/components/ui/Button';

const MAX_BANNERS = 5;
const TIPOS: { key: BannerTipo; label: string; Icon: React.ElementType }[] = [
  { key: 'desktop', label: 'Desktop', Icon: Monitor },
  { key: 'mobile', label: 'Mobile', Icon: Smartphone },
];

export function BannersPanel() {
  const [tipoActivo, setTipoActivo] = useState<BannerTipo>('desktop');
  const [bannerToDelete, setBannerToDelete] = useState<IBanner | null>(null);

  const { data: banners = [], isLoading } = useBannersAdmin();

  const createMutation = useCreateBanner();
  const uploadMutation = useUploadBannerImage();
  const toggleMutation = useToggleBannerActivo();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const bannersDelTipo = banners
    .filter((b) => b.tipo === tipoActivo)
    .sort((a, b) => a.orden - b.orden);

  // Construir los 5 slots: llenos o vacíos
  const slots: Array<IBanner | null> = Array.from({ length: MAX_BANNERS }, (_, i) => {
    const orden = i + 1;
    return bannersDelTipo.find((b) => b.orden === orden) ?? null;
  });

  function handleCreate(orden: number) {
    createMutation.mutate({ orden, tipo: tipoActivo });
  }

  function handleUpload(id: number, file: File) {
    uploadMutation.mutate({ id, file });
  }

  function handleToggle(id: number, activo: boolean) {
    toggleMutation.mutate({ id, activo });
  }

  function handleMoveUp(id: number) {
    const banner = bannersDelTipo.find((b) => b.id === id);
    if (!banner || banner.orden <= 1) return;
    updateMutation.mutate({ id, dto: { orden: banner.orden - 1 } });
  }

  function handleMoveDown(id: number) {
    const banner = bannersDelTipo.find((b) => b.id === id);
    if (!banner || banner.orden >= MAX_BANNERS) return;
    updateMutation.mutate({ id, dto: { orden: banner.orden + 1 } });
  }

  function handleDeleteClick(banner: IBanner) {
    setBannerToDelete(banner);
  }

  function handleConfirmDelete() {
    if (!bannerToDelete) return;
    deleteMutation.mutate(bannerToDelete.id, {
      onSuccess: () => setBannerToDelete(null),
    });
  }

  return (
    <>
      {/* Tabs desktop / mobile */}
      <div className="flex gap-2 mb-5">
        {TIPOS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTipoActivo(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tipoActivo === key
                ? 'bg-principal text-white shadow'
                : 'bg-principal/10 dark:bg-white/5 text-text/60 hover:bg-principal/20 dark:hover:bg-white/10'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-principal/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((banner, i) => {
            const orden = i + 1;
            const filledBanners = bannersDelTipo;
            const bannerIndex = banner ? filledBanners.findIndex((b) => b.id === banner.id) : -1;
            const isFirst = bannerIndex === 0;
            const isLast = bannerIndex === filledBanners.length - 1;

            return (
              <BannerSlot
                key={banner?.id ?? `empty-${orden}`}
                orden={orden}
                banner={banner}
                isFirst={isFirst}
                isLast={isLast}
                isUploading={uploadMutation.isPending}
                onUpload={handleUpload}
                onCreate={handleCreate}
                onToggleActivo={handleToggle}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDeleteClick={handleDeleteClick}
                totalBanners={bannersDelTipo.length}
              />
            );
          })}

          {bannersDelTipo.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-text/30">
              <ImageOff size={36} />
              <p className="text-sm">No hay banners {tipoActivo}. Hacé clic en &quot;+ Agregar&quot; para crear el primero.</p>
            </div>
          )}
        </div>
      )}

      {/* Leyenda */}
      <p className="text-xs text-text/40 mt-4">
        Máximo {MAX_BANNERS} banners por tipo · Formatos: JPEG, PNG, WebP · Peso máximo: 2 MB
      </p>

      {/* Modal confirmar eliminar */}
      <ModalBase
        isOpen={!!bannerToDelete}
        onClose={() => setBannerToDelete(null)}
      >
        {({ handleClose }) => (
          <>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-text">Eliminar banner</h2>
              <p className="mt-2 text-text/70">
                ¿Eliminar este banner? Se borrará la imagen del servidor.
              </p>
            </div>
            <div className="flex gap-3 justify-end px-6 pb-6">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </>
        )}
      </ModalBase>
    </>
  );
}
