import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}: PaginationControlsProps) {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-input">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-principal hover:text-white hover:border-principal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Anterior</span>
        </button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`dots-${index}`} className="px-2 text-foreground/50">
                ...
              </span>
            );
          }

          const page = pageNum as number;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`
                min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-principal text-white border-principal'
                  : 'bg-background text-foreground border-input hover:bg-principal hover:text-white hover:border-principal'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-principal hover:text-white hover:border-principal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-sm text-foreground/70">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
}

