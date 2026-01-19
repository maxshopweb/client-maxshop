import { useMemo } from 'react';

export interface UsePaginationOptions<T> {
  items: T[];
  currentPage: number;
  itemsPerPage: number;
}

export interface UsePaginationResult<T> {
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePagination<T>({
  items,
  currentPage,
  itemsPerPage,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  return useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      paginatedItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
    };
  }, [items, currentPage, itemsPerPage]);
}

