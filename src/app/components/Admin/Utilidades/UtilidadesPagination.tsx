'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { UTILIDADES_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';

interface UtilidadesPaginationProps {
  pagination: AdminPaginationMeta;
  entityLabelPlural: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function UtilidadesPagination({
  pagination,
  entityLabelPlural,
  onPageChange,
  onLimitChange,
  onNextPage,
  onPrevPage,
}: UtilidadesPaginationProps) {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = total === 0 ? 0 : Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-card border border-card rounded-lg mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span className="text-sm text-input">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de <span className="font-medium">{total}</span>{' '}
          {entityLabelPlural}
        </span>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-input border border-input rounded-2xl px-3 py-1.5 text-sm text-input focus:outline-none focus:ring-2 focus:ring-principal transition-all w-full sm:w-auto"
        >
          {UTILIDADES_LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} por página
            </option>
          ))}
        </select>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className="inline-flex items-center px-3 py-2 bg-input border border-input rounded-2xl text-sm font-medium text-input hover:bg-input/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </button>

          <div className="flex gap-1 flex-wrap justify-center">
            {getPageNumbers().map((pageNum, idx) =>
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-input">
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => onPageChange(pageNum as number)}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all ${
                    page === pageNum ? 'text-text' : 'text-input hover:bg-input'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="inline-flex items-center px-3 py-2 bg-input border border-input rounded-2xl text-sm font-medium text-input hover:bg-input/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
