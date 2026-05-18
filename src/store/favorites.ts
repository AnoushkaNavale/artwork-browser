import { useState, useCallback, useEffect } from 'react';
import type { ArtworkListItem } from '../types/artwork';

const STORAGE_KEY = 'artwork-explorer-favorites';
const SELECTION_KEY = 'artwork-explorer-selections';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Map<number, ArtworkListItem>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const arr: ArtworkListItem[] = JSON.parse(stored);
        return new Map(arr.map(a => [a.id, a]));
      }
    } catch {}
    return new Map();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites.values()]));
    } catch {}
  }, [favorites]);

  const addFavorite = useCallback((artwork: ArtworkListItem) => {
    setFavorites(prev => new Map(prev).set(artwork.id, artwork));
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((artwork: ArtworkListItem) => {
    setFavorites(prev => {
      const next = new Map(prev);
      if (next.has(artwork.id)) {
        next.delete(artwork.id);
      } else {
        next.set(artwork.id, artwork);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites]);

  const clearFavorites = useCallback(() => setFavorites(new Map()), []);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites };
}

export function usePersistentSelection() {
  const [selected, setSelected] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(SELECTION_KEY);
      if (stored) return new Set<number>(JSON.parse(stored));
    } catch {}
    return new Set<number>();
  });

  useEffect(() => {
    try {
      localStorage.setItem(SELECTION_KEY, JSON.stringify([...selected]));
    } catch {}
  }, [selected]);

  const toggleSelection = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: number[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const deselectAll = useCallback((ids: number[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.delete(id));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  return { selected, toggleSelection, selectAll, deselectAll, clearSelection, isSelected };
}
