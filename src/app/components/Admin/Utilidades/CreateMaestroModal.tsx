'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import type { MaestroKind } from '@/app/types/maestro.type';
import { MAESTRO_LABELS } from '@/app/types/maestro.type';
import { useCreateMarca, useCreateCategoria, useCreateGrupo } from '@/app/hooks/categorias/useCatSubMar';
import { marcaService } from '@/app/services/marca.service';
import { categoriaService } from '@/app/services/categoria.service';
import { grupoService } from '@/app/services/grupo.service';

interface CreateMaestroModalProps {
  kind: MaestroKind;
  onClose: () => void;
  onSuccess: () => void;
}

const CODIGO_LABEL: Record<MaestroKind, string> = {
  marca: 'Código de marca',
  categoria: 'Código de categoría',
  grupo: 'Código de grupo',
};

export function CreateMaestroModal({ kind, onClose, onSuccess }: CreateMaestroModalProps) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  const handleGenerarCodigo = async () => {
    setError(null);
    setGeneratingCode(true);
    try {
      const res =
        kind === 'marca' ? await marcaService.getSiguienteCodigo() :
        kind === 'categoria' ? await categoriaService.getSiguienteCodigo() :
        await grupoService.getSiguienteCodigo();
      if (res.success && res.data?.codigo) {
        setCodigo(res.data.codigo);
      }
    } catch {
      setError('No se pudo generar el código');
    } finally {
      setGeneratingCode(false);
    }
  };

  const createMarca = useCreateMarca();
  const createCategoria = useCreateCategoria();
  const createGrupo = useCreateGrupo();

  const isPending =
    kind === 'marca' ? createMarca.isPending :
    kind === 'categoria' ? createCategoria.isPending :
    createGrupo.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const codigoTrim = codigo.trim();
    const nombreTrim = nombre.trim();
    if (!codigoTrim || !nombreTrim) {
      setError('Código y nombre son obligatorios.');
      return;
    }

    try {
      if (kind === 'marca') {
        await createMarca.mutateAsync({ codi_marca: codigoTrim, nombre: nombreTrim, descripcion: descripcion.trim() || undefined });
      } else if (kind === 'categoria') {
        await createCategoria.mutateAsync({ codi_categoria: codigoTrim, nombre: nombreTrim, descripcion: descripcion.trim() || undefined });
      } else {
        await createGrupo.mutateAsync({ codi_grupo: codigoTrim, nombre: nombreTrim, descripcion: descripcion.trim() || undefined });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = axiosError.response?.data?.error ?? (err instanceof Error ? err.message : 'Error al crear');
      setError(msg);
    }
  };

  const label = MAESTRO_LABELS[kind].singular;
  const title = `Crear ${label}`;

  return (
    <SimpleModal
      isOpen
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      actions={(handleClose) => (
        <>
          <Button type="button" variant="outline-secondary" onClick={handleClose} className="!text-secundario dark:!text-white">
            Cancelar
          </Button>
          <Button type="submit" form="create-maestro-form" disabled={isPending}>
            {isPending ? 'Creando...' : 'Crear'}
          </Button>
        </>
      )}
    >
      <form id="create-maestro-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-medium text-input">{CODIGO_LABEL[kind]}</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerarCodigo}
              disabled={generatingCode}
              className="!text-principal text-xs gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {generatingCode ? 'Generando...' : 'Generar código'}
            </Button>
          </div>
          <Input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder={kind === 'marca' ? 'Ej: 001' : 'Ej: 0001'}
            required
          />
        </div>
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
