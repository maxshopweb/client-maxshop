'use client';

import { useState, useEffect } from 'react';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { MAESTRO_LABELS, getMaestroId, getMaestroNombre, getMaestroDescripcion } from '@/app/types/maestro.type';
import { useUpdateMarca, useUpdateCategoria, useUpdateGrupo } from '@/app/hooks/maestros/useMaestrosMutations';

interface EditMaestroModalProps {
  kind: MaestroKind;
  item: MaestroItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMaestroModal({ kind, item, onClose, onSuccess }: EditMaestroModalProps) {
  const id = getMaestroId(item, kind);
  const [nombre, setNombre] = useState(getMaestroNombre(item) ?? '');
  const [descripcion, setDescripcion] = useState(getMaestroDescripcion(item) ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNombre(getMaestroNombre(item) ?? '');
    setDescripcion(getMaestroDescripcion(item) ?? '');
  }, [item]);

  const updateMarca = useUpdateMarca();
  const updateCategoria = useUpdateCategoria();
  const updateGrupo = useUpdateGrupo();

  const isPending =
    kind === 'marca' ? updateMarca.isPending :
    kind === 'categoria' ? updateCategoria.isPending :
    updateGrupo.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nombreTrim = nombre.trim();
    if (!nombreTrim) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      if (kind === 'marca') {
        await updateMarca.mutateAsync({ id, data: { nombre: nombreTrim, descripcion: descripcion.trim() || undefined } });
      } else if (kind === 'categoria') {
        await updateCategoria.mutateAsync({ id, data: { nombre: nombreTrim, descripcion: descripcion.trim() || undefined } });
      } else {
        await updateGrupo.mutateAsync({ id, data: { nombre: nombreTrim, descripcion: descripcion.trim() || undefined } });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const label = MAESTRO_LABELS[kind].singular;
  const title = `Editar ${label}`;

  return (
    <SimpleModal
      isOpen
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      actions={(handleClose) => (
        <>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleClose}
            className="border-foreground/30 hover:bg-foreground/10"
            style={{ color: 'var(--foreground)' }}
          >
            Cancelar
          </Button>
          <Button type="submit" form="edit-maestro-form" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      )}
    >
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
        Al guardar, el cambio se verá en todos los productos que usen este {label.toLowerCase()}.
      </div>
      <form id="edit-maestro-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <Textarea
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Opcional"
          rows={3}
        />
      </form>
    </SimpleModal>
  );
}
