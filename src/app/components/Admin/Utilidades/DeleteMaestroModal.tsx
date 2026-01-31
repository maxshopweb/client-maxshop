'use client';

import ConfirmModal from '@/app/components/modals/ConfirmModal';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { MAESTRO_LABELS, getMaestroNombre, getMaestroCodigo } from '@/app/types/maestro.type';
import { getMaestroId } from '@/app/types/maestro.type';
import { useDeleteMarca, useDeleteCategoria, useDeleteGrupo } from '@/app/hooks/maestros/useMaestrosMutations';

interface DeleteMaestroModalProps {
  kind: MaestroKind;
  item: MaestroItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteMaestroModal({ kind, item, onClose, onSuccess }: DeleteMaestroModalProps) {
  const id = getMaestroId(item, kind);
  const nombre = getMaestroNombre(item) ?? getMaestroCodigo(item, kind);
  const label = MAESTRO_LABELS[kind].singular;

  const deleteMarca = useDeleteMarca();
  const deleteCategoria = useDeleteCategoria();
  const deleteGrupo = useDeleteGrupo();

  const handleConfirm = async () => {
    if (kind === 'marca') {
      await deleteMarca.mutateAsync(id);
    } else if (kind === 'categoria') {
      await deleteCategoria.mutateAsync(id);
    } else {
      await deleteGrupo.mutateAsync(id);
    }
    onSuccess();
  };

  return (
    <ConfirmModal
      isOpen
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`¿Eliminar ${label}?`}
      description={`¿Estás seguro de eliminar "${nombre}"? Solo se puede eliminar si no tiene productos vinculados.`}
      type="error"
      confirmText="Eliminar"
      cancelText="Cancelar"
    />
  );
}
