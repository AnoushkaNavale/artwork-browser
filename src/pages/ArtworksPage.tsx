import React, { useState, useMemo, useCallback } from 'react';
import { useArtworks } from '../hooks/useArtworks';
import { usePagination } from '../hooks/usePagination';
import { useSearch } from '../hooks/useSearch';
import { useFavorites, usePersistentSelection } from '../store/favorites';
import { ArtworkTable } from '../components/artworks/ArtworkTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterPanel } from '../components/ui/FilterPanel';
import { ErrorState, EmptyState } from '../components/ui/ErrorState';
import { ArtworkCharts } from '../components/charts/ArtworkCharts';
import type { ArtworkListItem } from '../types/artwork';

interface ArtworksPageProps {
  showCharts: boolean;
}

export const ArtworksPage: React.FC<ArtworksPageProps> = ({ showCharts }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const search = useSearch();
  const pagination = usePagination(1, 20);
  const { favorites, toggleFavorite } = useFavorites();
  const { selected, toggleSelection, selectAll, deselectAll } = usePersistentSelection();

  const favoriteIds = useMemo(() => new Set(favorites.keys()), [favorites]);

  const queryParams = useMemo(() => ({
    query: search.debouncedQuery,
    page: pagination.page,
    limit: pagination.limit,
    sortField: search.sortField,
    sortOrder: search.sortOrder,
    filters: search.filters,
  }), [search.debouncedQuery, pagination.page, pagination.limit, search.sortField, search.sortOrder, search.filters]);

  const { data, isLoading, isFetching, isError, refetch } = useArtworks(queryParams);

  // Reset page on new search
  const handleQueryChange = useCallback((q: string) => {
    search.setQuery(q);
    pagination.reset();
  }, [search, pagination]);

  const handleSortChange = useCallback((field: Parameters<typeof search.toggleSort>[0]) => {
    search.toggleSort(field);
    pagination.reset();
  }, [search, pagination]);

  const artworks = data?.data ?? [];
  const paginationInfo = data?.pagination;

  const selectedCount = selected.size;

  return (
    <main className="artworks-page">
      <div className="artworks-page__header">
        <div className="artworks-page__title-row">
          <div>
            <h1 className="artworks-page__title">Collection Browser</h1>
            <p className="artworks-page__subtitle">
              Explore the Art Institute of Chicago's permanent collection
            </p>
          </div>
          {selectedCount > 0 && (
            <div className="selection-chip">
              <span>{selectedCount} selected</span>
              <button onClick={() => { /* export/clear */ }} className="selection-chip__clear">×</button>
            </div>
          )}
        </div>

        <div className="artworks-page__toolbar">
          <SearchBar
            value={search.query}
            onChange={handleQueryChange}
            isLoading={isFetching && !!search.debouncedQuery}
            resultCount={paginationInfo?.total}
          />
          <FilterPanel
            filters={search.filters}
            onFilterChange={search.updateFilter}
            onClear={() => { search.clearFilters(); pagination.reset(); }}
            hasActiveFilters={search.hasActiveFilters}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(v => !v)}
          />
        </div>
      </div>

      {showCharts && artworks.length > 0 && (
        <ArtworkCharts artworks={artworks} />
      )}

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !isLoading && artworks.length === 0 ? (
        <EmptyState query={search.debouncedQuery} onClear={() => { handleQueryChange(''); search.clearFilters(); }} />
      ) : (
        <>
          <ArtworkTable
            artworks={artworks}
            isLoading={isLoading}
            isFetching={isFetching}
            selectedIds={selected}
            favoriteIds={favoriteIds}
            onToggleSelect={toggleSelection}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onToggleFavorite={(artwork: ArtworkListItem) => toggleFavorite(artwork)}
            sortField={search.sortField}
            sortOrder={search.sortOrder}
            onSort={handleSortChange}
            skeletonCount={pagination.limit}
          />

          {paginationInfo && (
            <Pagination
              currentPage={paginationInfo.current_page}
              totalPages={paginationInfo.total_pages}
              totalItems={paginationInfo.total}
              limit={pagination.limit}
              onPageChange={pagination.setPage}
              onLimitChange={pagination.setLimit}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </main>
  );
};
