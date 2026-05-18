import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { artworkApi } from '../services/artworkApi';
import type { SearchParams } from '../types/artwork';

export const ARTWORKS_QUERY_KEY = 'artworks';

export function useArtworks(params: SearchParams) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const queryFn = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    return artworkApi.getArtworks(params, abortControllerRef.current.signal);
  }, [params]);

  return useQuery({
    queryKey: [ARTWORKS_QUERY_KEY, params],
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: 2,
  });
}

export function useArtwork(id: number | null) {
  return useQuery({
    queryKey: ['artwork', id],
    queryFn: async ({ signal }) => {
      if (!id) throw new Error('No ID provided');
      return artworkApi.getArtworkById(id, signal);
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
