import { useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import type { ArtworkFilters, SortField, SortOrder } from '../types/artwork';

export interface SearchState {
  query: string;
  debouncedQuery: string;
  sortField: SortField | undefined;
  sortOrder: SortOrder;
  filters: ArtworkFilters;
}

export function useSearch() {
  const [query, setQueryRaw] = useState('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState<ArtworkFilters>({});

  const setQuery = useCallback((value: string) => {
    setQueryRaw(value);
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortOrder('asc');
      return field;
    });
  }, []);

  const updateFilter = useCallback(<K extends keyof ArtworkFilters>(
    key: K,
    value: ArtworkFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSortField(undefined);
    setSortOrder('asc');
  }, []);

  const hasActiveFilters = Object.keys(filters).some(k => {
    const v = filters[k as keyof ArtworkFilters];
    return v !== undefined && v !== '' && v !== false;
  }) || !!sortField;

  return {
    query,
    debouncedQuery,
    sortField,
    sortOrder,
    filters,
    setQuery,
    toggleSort,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
