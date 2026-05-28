'use client';

import { useMemo, useState } from 'react';
import { useSyncRuns } from '@/app/hooks/sincronizacion/useSyncRuns';
import { useSyncRunsPagination } from '@/app/hooks/sincronizacion/useSyncRunsPagination';
import { toAdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { SyncRunsTable } from './SyncRunsTable';
import { SyncRunsPaginacion } from './SyncRunsPaginacion';

export function SyncRunsTableWrapper() {
  const { page, limit, goToPage, setLimit, nextPage, prevPage } = useSyncRunsPagination();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { runs, pagination, isLoading, isFetching, isError, refetch } = useSyncRuns({
    page,
    limit,
  });

  const paginationMeta = useMemo(
    () => (pagination ? toAdminPaginationMeta(pagination) : null),
    [pagination]
  );

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (p: number) => {
    goToPage(p);
    setExpandedId(null);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setExpandedId(null);
  };

  const handleNextPage = () => {
    nextPage();
    setExpandedId(null);
  };

  const handlePrevPage = () => {
    prevPage();
    setExpandedId(null);
  };

  return (
    <div className="space-y-4">
      <SyncRunsTable
        runs={runs}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRefetch={() => refetch()}
        expandedId={expandedId}
        onToggleExpand={handleToggleExpand}
      />

      {paginationMeta && paginationMeta.total > 0 && (
        <SyncRunsPaginacion
          pagination={paginationMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}
    </div>
  );
}
