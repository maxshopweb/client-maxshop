"use client";

import { Button } from '@/app/components/ui/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';

interface ClientesPaginacionProps {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export function ClientesPaginacion({ pagination }: ClientesPaginacionProps) {
    const { goToPage, nextPage, prevPage } = useClientesFilters();

    const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    // Calcular páginas a mostrar
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-card border border-card rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                    Mostrando <span className="font-semibold">{startItem}</span> a{' '}
                    <span className="font-semibold">{endItem}</span> de{' '}
                    <span className="font-semibold">{total}</span> clientes
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* Primera página */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={!hasPrevPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Página anterior */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevPage}
                    disabled={!hasPrevPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum, index) => {
                        if (pageNum === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = pageNum as number;
                        const isActive = pageNumber === page;

                        return (
                            <Button
                                key={pageNumber}
                                variant={isActive ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => goToPage(pageNumber)}
                                className={`h-8 min-w-8 px-2 ${
                                    isActive
                                        ? 'bg-principal text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                </div>

                {/* Página siguiente */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextPage}
                    disabled={!hasNextPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Última página */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={!hasNextPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

