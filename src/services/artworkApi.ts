import axios, { AxiosError } from 'axios';
import type {
  ApiResponse,
  ArtworkListItem,
  SingleArtworkResponse,
  SearchParams,
} from '../types/artwork';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.artic.edu/api/v1';

const LIST_FIELDS = [
  'id', 'title', 'artist_title', 'date_display', 'date_start',
  'artwork_type_title', 'classification_title', 'department_title',
  'image_id', 'thumbnail', 'is_public_domain'
].join(',');

const DETAIL_FIELDS = [
  'id', 'title', 'artist_title', 'artist_display', 'date_display', 'date_start', 'date_end',
  'medium_display', 'dimensions', 'artwork_type_title', 'classification_title', 'style_title',
  'place_of_origin', 'description', 'short_description', 'image_id', 'thumbnail', 'color',
  'department_title', 'credit_line', 'is_public_domain', 'is_boosted'
].join(',');

export const artworkApi = {
  getArtworks: async (
    params: SearchParams,
    signal?: AbortSignal
  ): Promise<ApiResponse<ArtworkListItem>> => {
    const { query, page = 1, limit = 20, sortField, sortOrder, filters } = params;

    if (query && query.trim().length > 0) {
      // Use search endpoint
      const searchParams: Record<string, unknown> = {
        q: query,
        page,
        limit,
        fields: LIST_FIELDS,
      };

      if (sortField) {
        searchParams['sort[0][field]'] = sortField;
        searchParams['sort[0][order]'] = sortOrder || 'asc';
      }

      if (filters?.department) {
        searchParams['query[term][department_title]'] = filters.department;
      }

      const response = await axios.get<ApiResponse<ArtworkListItem>>(
        `${BASE_URL}/artworks/search`,
        { params: searchParams, signal }
      );
      return response.data;
    }

    // Use list endpoint
    const listParams: Record<string, unknown> = {
      page,
      limit,
      fields: LIST_FIELDS,
    };

    if (sortField) {
      listParams['sort[0][field]'] = sortField;
      listParams['sort[0][order]'] = sortOrder || 'asc';
    }

    if (filters?.publicDomain) {
      listParams['query[term][is_public_domain]'] = true;
    }

    const response = await axios.get<ApiResponse<ArtworkListItem>>(
      `${BASE_URL}/artworks`,
      { params: listParams, signal }
    );
    return response.data;
  },

  getArtworkById: async (
    id: number,
    signal?: AbortSignal
  ): Promise<SingleArtworkResponse> => {
    const response = await axios.get<SingleArtworkResponse>(
      `${BASE_URL}/artworks/${id}`,
      { params: { fields: DETAIL_FIELDS }, signal }
    );
    return response.data;
  },

  getDepartments: async (): Promise<string[]> => {
    const response = await axios.get<ApiResponse<{ title: string }>>( 
      `${BASE_URL}/artworks`,
      { params: { limit: 100, fields: 'department_title' } }
    );
    const departments = [...new Set(
      response.data.data
        .map(d => d.title)
        .filter(Boolean)
    )].sort();
    return departments;
  },
};

export const getImageUrl = (imageId: string | null, size = 843): string | null => {
  if (!imageId) return null;
  return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`;
};

export const getThumbnailUrl = (imageId: string | null): string | null => {
  if (!imageId) return null;
  return `https://www.artic.edu/iiif/2/${imageId}/full/200,/0/default.jpg`;
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};
