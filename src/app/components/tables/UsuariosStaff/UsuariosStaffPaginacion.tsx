'use client';

import { Button } from '@/app/components/ui/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type Props = {
  total: number;
  page: number;
  limit: number;
  onGoToPage: (page: number) => void;
};

export function UsuariosStaffPaginacion({ total, page, limit, onGoToPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1 && total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-card border border-card rounded-lg">
      <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
        <span>
          Mostrando <span className="font-semibold">{startItem}</span> a{' '}
          <span className="font-semibold">{endItem}</span> de <span className="font-semibold">{total}</span>{' '}
          usuarios
        </span>
      </div>

      {totalPages <= 1 ? null : (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToPage(1)}
            disabled={!hasPrev}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToPage(page - 1)}
            disabled={!hasPrev}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              const n = pageNum as number;
              const isActive = n === page;
              return (
                <Button
                  key={n}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onGoToPage(n)}
                  className={`h-8 min-w-8 px-2 ${isActive ? 'bg-principal text-white' : 'hover:bg-gray-100'}`}
                >
                  {n}
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToPage(page + 1)}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToPage(totalPages)}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
