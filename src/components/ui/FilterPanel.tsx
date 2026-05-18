import React, { memo } from 'react';
import { Filter, X } from 'lucide-react';
import type { ArtworkFilters } from '../../types/artwork';

interface FilterPanelProps {
  filters: ArtworkFilters;
  onFilterChange: <K extends keyof ArtworkFilters>(key: K, value: ArtworkFilters[K]) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const DEPARTMENTS = [
  'Applied Arts of Europe',
  'Architecture and Design',
  'Asian Art',
  'Contemporary Art',
  'European Painting and Sculpture',
  'Greek, Roman, and Byzantine Art',
  'Medieval to Modern European Painting and Sculpture',
  'Modern Art',
  'Photography and Media',
  'Prints and Drawings',
  'Textiles',
];

export const FilterPanel: React.FC<FilterPanelProps> = memo(({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="filter-panel">
      <button
        className={`btn btn--secondary filter-panel__toggle ${hasActiveFilters ? 'filter-panel__toggle--active' : ''}`}
        onClick={onToggle}
      >
        <Filter size={16} />
        Filters
        {hasActiveFilters && <span className="filter-panel__badge" />}
      </button>

      {isOpen && (
        <div className="filter-panel__dropdown">
          <div className="filter-panel__header">
            <h4>Filter Artworks</h4>
            {hasActiveFilters && (
              <button className="filter-panel__clear" onClick={onClear}>
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          <div className="filter-panel__group">
            <label className="filter-panel__label">Department</label>
            <select
              className="filter-panel__select"
              value={filters.department || ''}
              onChange={e => onFilterChange('department', e.target.value || undefined)}
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="filter-panel__group">
            <label className="filter-panel__label">Date Range</label>
            <div className="filter-panel__range">
              <input
                type="number"
                className="filter-panel__input"
                placeholder="From year"
                value={filters.dateFrom ?? ''}
                min={-3000}
                max={2024}
                onChange={e => onFilterChange('dateFrom', e.target.value ? Number(e.target.value) : undefined)}
              />
              <span className="filter-panel__range-sep">–</span>
              <input
                type="number"
                className="filter-panel__input"
                placeholder="To year"
                value={filters.dateTo ?? ''}
                min={-3000}
                max={2024}
                onChange={e => onFilterChange('dateTo', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="filter-panel__group">
            <label className="filter-panel__checkbox-label">
              <input
                type="checkbox"
                checked={filters.publicDomain ?? false}
                onChange={e => onFilterChange('publicDomain', e.target.checked || undefined)}
              />
              <span>Public domain only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';
