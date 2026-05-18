import React, { memo, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  resultCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = memo(({
  value,
  onChange,
  isLoading = false,
  placeholder = 'Search artworks, artists, periods…',
  resultCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <Search className="search-bar__icon" size={18} />
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search artworks"
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && (
          <Loader2 className="search-bar__spinner" size={16} />
        )}
        {value && !isLoading && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && !isLoading && (
        <div className="search-bar__hint">
          {resultCount.toLocaleString()} results for "{value}"
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
