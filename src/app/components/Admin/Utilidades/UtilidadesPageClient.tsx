'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { UtilidadesTabs, type UtilidadesTabKind } from './UtilidadesTabs';
import { MaestrosTable } from './MaestrosTable';
import { ListasPrecioTable } from './ListasPrecioTable';
import { MaestrosFilterInput } from './MaestrosFilterInput';
import { CreateMaestroModal } from './CreateMaestroModal';
import { EditMaestroModal } from './EditMaestroModal';
import { DeleteMaestroModal } from './DeleteMaestroModal';
import { UtilidadesPagination } from './UtilidadesPagination';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { MAESTRO_LABELS } from '@/app/types/maestro.type';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import { useCategorias } from '@/app/hooks/categorias/useCategorias';
import { useGrupos } from '@/app/hooks/grupos/useGrupos';
import { useListasPrecio } from '@/app/hooks/listas-precio/useListasPrecio';
import { useMaestrosFilters } from '@/app/hooks/maestros/useMaestrosFilters';
import { useUtilidadesPagination } from '@/app/hooks/utilidades/useUtilidadesPagination';
import type {
  MarcasPaginatedSSR,
  CategoriasPaginatedSSR,
  GruposPaginatedSSR,
  ListasPrecioPaginatedSSR,
} from '@/app/lib/getMaestros';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';

function pickPaginatedMeta(d: unknown): AdminPaginationMeta | undefined {
  if (d && typeof d === 'object' && 'pagination' in d) {
    return (d as { pagination: AdminPaginationMeta }).pagination;
  }
  return undefined;
}
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';

type ModalType = 'create' | 'edit' | 'delete' | null;

const PAGINATION_LABELS: Record<UtilidadesTabKind, string> = {
  marca: 'marcas',
  categoria: 'categorías',
  grupo: 'grupos',
  lista_precio: 'listas de precio',
};

interface UtilidadesPageClientProps {
  initialMarcasPaginated: MarcasPaginatedSSR;
  initialCategoriasPaginated: CategoriasPaginatedSSR;
  initialGruposPaginated: GruposPaginatedSSR;
  initialListasPaginated: ListasPrecioPaginatedSSR;
}

export function UtilidadesPageClient({
  initialMarcasPaginated,
  initialCategoriasPaginated,
  initialGruposPaginated,
  initialListasPaginated,
}: UtilidadesPageClientProps) {
  const [activeTab, setActiveTab] = useState<UtilidadesTabKind>('marca');
  const [modal, setModal] = useState<{ type: ModalType; item?: MaestroItem }>({ type: null });

  const { busquedaInput, setBusquedaInput, clearBusqueda, busqueda } = useMaestrosFilters();
  const { page, limit, setPage, setLimit, goToPage, nextPage, prevPage } = useUtilidadesPagination();

  const adminListParams = useMemo(() => ({ page, limit, busqueda }), [page, limit, busqueda]);

  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setPage(1);
    }
  }, [activeTab, setPage]);

  const marcasQuery = useMarcas({
    adminList: adminListParams,
    initialPaginated: initialMarcasPaginated,
    enabled: activeTab === 'marca',
  });
  const categoriasQuery = useCategorias({
    adminList: adminListParams,
    initialPaginated: initialCategoriasPaginated,
    enabled: activeTab === 'categoria',
  });
  const gruposQuery = useGrupos({
    adminList: adminListParams,
    initialPaginated: initialGruposPaginated,
    enabled: activeTab === 'grupo',
  });

  const listasAdminParams = useMemo(() => ({ page, limit, busqueda: '' as const }), [page, limit]);
  const {
    listas,
    pagination: listasPagination,
    isLoading: listasLoading,
    isFetching: listasFetching,
    refetch: listasRefetch,
  } = useListasPrecio(false, listasAdminParams, {
    enabled: activeTab === 'lista_precio',
    initialPaginated: initialListasPaginated,
  });

  const isListaTab = activeTab === 'lista_precio';

  const maestroItems =
    activeTab === 'marca'
      ? (marcasQuery.data?.data ?? [])
      : activeTab === 'categoria'
        ? (categoriasQuery.data?.data ?? [])
        : activeTab === 'grupo'
          ? (gruposQuery.data?.data ?? [])
          : [];

  const maestroPagination =
    activeTab === 'marca'
      ? pickPaginatedMeta(marcasQuery.data)
      : activeTab === 'categoria'
        ? pickPaginatedMeta(categoriasQuery.data)
        : activeTab === 'grupo'
          ? pickPaginatedMeta(gruposQuery.data)
          : undefined;

  const isLoading =
    activeTab === 'marca'
      ? marcasQuery.isLoading
      : activeTab === 'categoria'
        ? categoriasQuery.isLoading
        : activeTab === 'grupo'
          ? gruposQuery.isLoading
          : listasLoading;

  const refetch =
    activeTab === 'marca'
      ? marcasQuery.refetch
      : activeTab === 'categoria'
        ? categoriasQuery.refetch
        : activeTab === 'grupo'
          ? gruposQuery.refetch
          : listasRefetch;

  const isFetching =
    activeTab === 'marca'
      ? marcasQuery.isFetching
      : activeTab === 'categoria'
        ? categoriasQuery.isFetching
        : activeTab === 'grupo'
          ? gruposQuery.isFetching
          : listasFetching;

  const openCreate = () => setModal({ type: 'create' });
  const openEdit = (item: MaestroItem) => setModal({ type: 'edit', item });
  const openDelete = (item: MaestroItem) => setModal({ type: 'delete', item });
  const closeModal = () => setModal({ type: null });

  const handleSuccess = () => {
    void refetch();
  };

  const label = isListaTab ? null : MAESTRO_LABELS[activeTab as MaestroKind];

  const activePagination = isListaTab ? listasPagination : maestroPagination;

  return (
    <div className="min-h-screen">
      <AdminPageContainer>
        <AdminPageHeader
          title="Utilidades"
          description={
            isListaTab ? 'Activá o desactivá listas de precio para productos' : 'Gestioná marcas, categorías y grupos'
          }
        >
          <Button
            onClick={() => void refetch()}
            disabled={isFetching}
            variant="outline-primary"
            className="flex items-center gap-2 justify-center"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          {!isListaTab && label && (
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear {label.singular}
            </Button>
          )}
        </AdminPageHeader>

        <UtilidadesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {isListaTab ? (
          <>
            <ListasPrecioTable listas={listas} isLoading={isLoading} />
            {activePagination && (
              <UtilidadesPagination
                pagination={activePagination}
                entityLabelPlural={PAGINATION_LABELS.lista_precio}
                onPageChange={goToPage}
                onLimitChange={setLimit}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            )}
          </>
        ) : (
          <>
            <MaestrosFilterInput
              value={busquedaInput}
              onChange={setBusquedaInput}
              onClear={clearBusqueda}
              placeholder="Buscar por nombre o código..."
            />
            <MaestrosTable
              kind={activeTab as MaestroKind}
              items={maestroItems as MaestroItem[]}
              isLoading={isLoading}
              onEdit={openEdit}
              onDelete={openDelete}
            />
            {activePagination && (
              <UtilidadesPagination
                pagination={activePagination}
                entityLabelPlural={PAGINATION_LABELS[activeTab]}
                onPageChange={goToPage}
                onLimitChange={setLimit}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            )}
          </>
        )}
      </AdminPageContainer>

      {modal.type === 'create' && activeTab !== 'lista_precio' && (
        <CreateMaestroModal
          kind={activeTab as MaestroKind}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {modal.type === 'edit' && modal.item && activeTab !== 'lista_precio' && (
        <EditMaestroModal
          kind={activeTab as MaestroKind}
          item={modal.item}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {modal.type === 'delete' && modal.item && activeTab !== 'lista_precio' && (
        <DeleteMaestroModal
          kind={activeTab as MaestroKind}
          item={modal.item}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
