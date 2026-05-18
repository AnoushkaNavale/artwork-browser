import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
}

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
  });

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState({ page: 1, limit });
  }, []);

  const nextPage = useCallback(() => {
    setState(prev => ({ ...prev, page: prev.page + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prevPage = useCallback(() => {
    setState(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = useCallback(() => {
    setState({ page: 1, limit: state.limit });
  }, [state.limit]);

  return { ...state, setPage, setLimit, nextPage, prevPage, reset };
}

export function getPaginationRange(currentPage: number, totalPages: number, maxVisible = 7) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const range: (number | '...')[] = [];

  if (start > 1) {
    range.push(1);
    if (start > 2) range.push('...');
  }

  for (let i = start; i <= end; i++) range.push(i);

  if (end < totalPages) {
    if (end < totalPages - 1) range.push('...');
    range.push(totalPages);
  }

  return range;
}
