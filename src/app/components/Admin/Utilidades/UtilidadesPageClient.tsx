'use client';

import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { UtilidadesTabs } from './UtilidadesTabs';
import { MaestrosTable } from './MaestrosTable';
import { MaestrosFilterInput } from './MaestrosFilterInput';
import { CreateMaestroModal } from './CreateMaestroModal';
import { EditMaestroModal } from './EditMaestroModal';
import { DeleteMaestroModal } from './DeleteMaestroModal';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { MAESTRO_LABELS } from '@/app/types/maestro.type';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import { useCategorias } from '@/app/hooks/categorias/useCategorias';
import { useGrupos } from '@/app/hooks/grupos/useGrupos';
import { useMaestrosFilters } from '@/app/hooks/maestros/useMaestrosFilters';
import type { MarcasSSRResponse, CategoriasSSRResponse, GruposSSRResponse } from '@/app/lib/getMaestros';

type ModalType = 'create' | 'edit' | 'delete' | null;

interface UtilidadesPageClientProps {
  initialMarcas?: MarcasSSRResponse;
  initialCategorias?: CategoriasSSRResponse;
  initialGrupos?: GruposSSRResponse;
}

export function UtilidadesPageClient({
  initialMarcas,
  initialCategorias,
  initialGrupos,
}: UtilidadesPageClientProps) {
  const [activeTab, setActiveTab] = useState<MaestroKind>('marca');
  const [modal, setModal] = useState<{ type: ModalType; item?: MaestroItem }>({ type: null });

  const { busquedaInput, setBusquedaInput, filterItems, clearBusqueda } = useMaestrosFilters();

  const marcasQuery = useMarcas({ initialData: initialMarcas });
  const categoriasQuery = useCategorias({ initialData: initialCategorias });
  const gruposQuery = useGrupos({ initialData: initialGrupos });

  const allItems =
    activeTab === 'marca' ? (marcasQuery.data?.data ?? []) :
    activeTab === 'categoria' ? (categoriasQuery.data?.data ?? []) :
    (gruposQuery.data?.data ?? []);

  const items = filterItems(allItems as MaestroItem[], activeTab);

  const isLoading =
    activeTab === 'marca' ? marcasQuery.isLoading :
    activeTab === 'categoria' ? categoriasQuery.isLoading :
    gruposQuery.isLoading;

  const refetch =
    activeTab === 'marca' ? marcasQuery.refetch :
    activeTab === 'categoria' ? categoriasQuery.refetch :
    gruposQuery.refetch;

  const isFetching =
    activeTab === 'marca' ? marcasQuery.isFetching :
    activeTab === 'categoria' ? categoriasQuery.isFetching :
    gruposQuery.isFetching;

  const openCreate = () => setModal({ type: 'create' });
  const openEdit = (item: MaestroItem) => setModal({ type: 'edit', item });
  const openDelete = (item: MaestroItem) => setModal({ type: 'delete', item });
  const closeModal = () => setModal({ type: null });

  const handleSuccess = () => {
    refetch();
  };

  const label = MAESTRO_LABELS[activeTab];

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Utilidades</h1>
            <p className="mt-1 text-sm text-text">
              Gestioná marcas, categorías y grupos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline-primary"
              className="flex items-center gap-2 justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refrescar
            </Button>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear {label.singular}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <UtilidadesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <MaestrosFilterInput
          value={busquedaInput}
          onChange={setBusquedaInput}
          onClear={clearBusqueda}
          placeholder="Buscar por nombre o código..."
        />
        <MaestrosTable
          kind={activeTab}
          items={items as MaestroItem[]}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </div>

      {modal.type === 'create' && (
        <CreateMaestroModal
          kind={activeTab}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {modal.type === 'edit' && modal.item && (
        <EditMaestroModal
          kind={activeTab}
          item={modal.item}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {modal.type === 'delete' && modal.item && (
        <DeleteMaestroModal
          kind={activeTab}
          item={modal.item}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
