import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductosFilters } from '@/app/hooks/productos/useProductFilter';

interface PaginationProps {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export function ProductosPagination({ pagination }: PaginationProps) {
    const { nextPage, prevPage, goToPage, setFilter } = useProductosFilters();

    const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-card border border-card rounded-lg">
            {/* Info de resultados */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-input">
                    Mostrando <span className="font-medium">{startItem}</span> a{' '}
                    <span className="font-medium">{endItem}</span> de{' '}
                    <span className="font-medium">{total}</span> productos
                </span>

                {/* Selector de items por página */}
                <select
                    value={limit}
                    onChange={(e) => setFilter('limit', Number(e.target.value))}
                    className="bg-input border border-input rounded-2xl px-3 py-1.5 text-sm text-input focus:outline-none focus:ring-2 focus:ring-principal transition-all"
                >
                    <option value={10}>10 por página</option>
                    <option value={25}>25 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                </select>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                    onClick={prevPage}
                    disabled={!hasPrevPage}
                    className="inline-flex items-center px-3 py-2 bg-input border border-input rounded-2xl text-sm font-medium text-input hover:bg-input/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                </button>

                {/* Números de página */}
                <div className="flex gap-1">
                    {getPageNumbers().map((pageNum, idx) =>
                        pageNum === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-input">
                                ...
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum as number)}
                                className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all ${
                                    page === pageNum
                                        ? 'text-text'
                                        : 'text-input hover:bg-input'
                                }`}
                            >
                                {pageNum}
                            </button>
                        )
                    )}
                </div>

                {/* Botón siguiente */}
                <button
                    onClick={nextPage}
                    disabled={!hasNextPage}
                    className="inline-flex items-center px-3 py-2 bg-input border border-input rounded-2xl text-sm font-medium text-input hover:bg-input/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
}