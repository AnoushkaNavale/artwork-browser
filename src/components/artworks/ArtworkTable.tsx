import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronUp, ChevronDown, ChevronsUpDown, Check } from 'lucide-react';
import type { ArtworkListItem, SortField, SortOrder } from '../../types/artwork';
import { ArtworkRowSkeleton } from '../ui/Skeleton';
import { getThumbnailUrl } from '../../services/artworkApi';
import { truncate } from '../../utils/helpers';

interface ArtworkTableProps {
  artworks: ArtworkListItem[];
  isLoading: boolean;
  isFetching: boolean;
  selectedIds: Set<number>;
  favoriteIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  onDeselectAll: (ids: number[]) => void;
  onToggleFavorite: (artwork: ArtworkListItem) => void;
  sortField?: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  skeletonCount?: number;
}

const COLUMNS: { key: SortField; label: string; width?: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'artist_title', label: 'Artist' },
  { key: 'date_start', label: 'Date', width: '100px' },
  { key: 'department_title', label: 'Department', width: '160px' },
];

const SortIcon: React.FC<{ field: SortField; activeField?: SortField; order: SortOrder }> = ({
  field, activeField, order
}) => {
  if (field !== activeField) return <ChevronsUpDown size={14} className="sort-icon sort-icon--inactive" />;
  return order === 'asc'
    ? <ChevronUp size={14} className="sort-icon sort-icon--active" />
    : <ChevronDown size={14} className="sort-icon sort-icon--active" />;
};

const ArtworkRow: React.FC<{
  artwork: ArtworkListItem;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onClick: () => void;
}> = memo(({ artwork, isSelected, isFavorite, onSelect, onFavorite, onClick }) => {
  const thumb = getThumbnailUrl(artwork.image_id);

  return (
    <tr
      className={`artwork-row ${isSelected ? 'artwork-row--selected' : ''}`}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      role="button"
      aria-label={`View ${artwork.title}`}
    >
      <td onClick={e => { e.stopPropagation(); onSelect(); }} className="artwork-row__check">
        <div className={`checkbox ${isSelected ? 'checkbox--checked' : ''}`}>
          {isSelected && <Check size={12} />}
        </div>
      </td>
      <td className="artwork-row__title-cell">
        <div className="artwork-row__title-wrap">
          <div className="artwork-row__thumb">
            {thumb ? (
              <img
                src={thumb}
                alt={artwork.thumbnail?.alt_text || artwork.title}
                loading="lazy"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="artwork-row__thumb-placeholder">🖼️</div>
            )}
          </div>
          <div className="artwork-row__title-text">
            <span className="artwork-row__title">{truncate(artwork.title, 60)}</span>
            {artwork.artwork_type_title && (
              <span className="artwork-row__type-badge">{artwork.artwork_type_title}</span>
            )}
          </div>
        </div>
      </td>
      <td className="artwork-row__artist">
        {artwork.artist_title || <span className="artwork-row__unknown">Unknown</span>}
      </td>
      <td className="artwork-row__date">
        {artwork.date_display || '—'}
      </td>
      <td className="artwork-row__dept">
        {artwork.department_title ? truncate(artwork.department_title, 30) : '—'}
      </td>
      <td onClick={e => { e.stopPropagation(); onFavorite(); }} className="artwork-row__fav">
        <button
          className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          tabIndex={-1}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </td>
    </tr>
  );
});
ArtworkRow.displayName = 'ArtworkRow';

export const ArtworkTable: React.FC<ArtworkTableProps> = memo(({
  artworks, isLoading, isFetching, selectedIds, favoriteIds,
  onToggleSelect, onSelectAll, onDeselectAll, onToggleFavorite,
  sortField, sortOrder, onSort, skeletonCount = 20,
}) => {
  const navigate = useNavigate();
  const currentIds = artworks.map(a => a.id);
  const allSelected = currentIds.length > 0 && currentIds.every(id => selectedIds.has(id));

  const handleSelectAll = useCallback(() => {
    if (allSelected) onDeselectAll(currentIds);
    else onSelectAll(currentIds);
  }, [allSelected, currentIds, onSelectAll, onDeselectAll]);

  return (
    <div className={`table-container ${isFetching && !isLoading ? 'table-container--refetching' : ''}`}>
      <table className="artwork-table" aria-label="Artworks">
        <thead>
          <tr>
            <th className="th-check">
              <div
                className={`checkbox ${allSelected ? 'checkbox--checked' : ''}`}
                onClick={handleSelectAll}
                role="checkbox"
                aria-checked={allSelected}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelectAll()}
              >
                {allSelected && <Check size={12} />}
              </div>
            </th>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                className="th-sortable"
                style={col.width ? { width: col.width } : undefined}
                onClick={() => onSort(col.key)}
                aria-sort={sortField === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <span className="th-label">
                  {col.label}
                  <SortIcon field={col.key} activeField={sortField} order={sortOrder} />
                </span>
              </th>
            ))}
            <th className="th-fav" aria-label="Favorites" />
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => <ArtworkRowSkeleton key={i} />)
            : artworks.map(artwork => (
              <ArtworkRow
                key={artwork.id}
                artwork={artwork}
                isSelected={selectedIds.has(artwork.id)}
                isFavorite={favoriteIds.has(artwork.id)}
                onSelect={() => onToggleSelect(artwork.id)}
                onFavorite={() => onToggleFavorite(artwork)}
                onClick={() => navigate(`/artworks/${artwork.id}`)}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  );
});

ArtworkTable.displayName = 'ArtworkTable';
