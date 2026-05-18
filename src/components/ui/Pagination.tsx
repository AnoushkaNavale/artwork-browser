import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getPaginationRange } from '../../hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

const LIMIT_OPTIONS = [10, 20, 50, 100];

export const Pagination: React.FC<PaginationProps> = memo(({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}) => {
  const pages = getPaginationRange(currentPage, totalPages);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="pagination">
      <div className="pagination__info">
        <span>
          Showing <strong>{startItem.toLocaleString()}–{endItem.toLocaleString()}</strong> of{' '}
          <strong>{totalItems.toLocaleString()}</strong> artworks
        </span>
        <select
          className="pagination__limit"
          value={limit}
          onChange={e => onLimitChange(Number(e.target.value))}
          disabled={isLoading}
        >
          {LIMIT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt} per page</option>
          ))}
        </select>
      </div>

      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          title="First page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          className="pagination__btn pagination__btn--icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="pagination__pages">
          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
            ) : (
              <button
                key={page}
                className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="pagination__btn pagination__btn--icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="pagination__btn pagination__btn--icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          title="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';
