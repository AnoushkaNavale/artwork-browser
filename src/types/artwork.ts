export interface Artwork {
  id: number;
  title: string;
  artist_title: string | null;
  artist_display: string | null;
  date_display: string | null;
  date_start: number | null;
  date_end: number | null;
  medium_display: string | null;
  dimensions: string | null;
  artwork_type_title: string | null;
  classification_title: string | null;
  style_title: string | null;
  place_of_origin: string | null;
  description: string | null;
  short_description: string | null;
  image_id: string | null;
  thumbnail: {
    lqip: string | null;
    width: number | null;
    height: number | null;
    alt_text: string | null;
  } | null;
  color: {
    h: number;
    l: number;
    s: number;
    percentage: number;
    population: number;
  } | null;
  department_title: string | null;
  credit_line: string | null;
  is_public_domain: boolean;
  is_boosted: boolean;
}

export interface ArtworkListItem {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  date_start: number | null;
  artwork_type_title: string | null;
  classification_title: string | null;
  department_title: string | null;
  image_id: string | null;
  thumbnail: {
    lqip: string | null;
    alt_text: string | null;
  } | null;
  is_public_domain: boolean;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string | null;
    prev_url: string | null;
  };
  info: {
    license_text: string;
    license_links: string[];
    version: string;
  };
  config: {
    iiif_url: string;
    website_url: string;
  };
}

export interface SingleArtworkResponse {
  data: Artwork;
  info: {
    license_text: string;
    license_links: string[];
    version: string;
  };
  config: {
    iiif_url: string;
    website_url: string;
  };
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
  filters?: ArtworkFilters;
}

export type SortField = 'title' | 'artist_title' | 'date_start' | 'department_title';
export type SortOrder = 'asc' | 'desc';

export interface ArtworkFilters {
  department?: string;
  classification?: string;
  dateFrom?: number;
  dateTo?: number;
  publicDomain?: boolean;
}

export interface ArtworkStats {
  byDepartment: { name: string; count: number }[];
  byDecade: { decade: string; count: number }[];
  byType: { name: string; count: number }[];
}
