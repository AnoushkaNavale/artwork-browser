import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { artworkApi, getImageUrl, getThumbnailUrl } from '../services/artworkApi';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const mockArtworkData = {
  data: [
    {
      id: 1,
      title: 'A Sunday on La Grande Jatte',
      artist_title: 'Georges Seurat',
      date_display: '1884–86',
      date_start: 1884,
      artwork_type_title: 'Painting',
      classification_title: null,
      department_title: 'Modern Art',
      image_id: 'abc123',
      thumbnail: { lqip: null, alt_text: 'A painting' },
      is_public_domain: true,
    }
  ],
  pagination: {
    total: 120000,
    limit: 20,
    offset: 0,
    total_pages: 6000,
    current_page: 1,
    next_url: null,
    prev_url: null,
  },
  info: { license_text: '', license_links: [], version: '1.9' },
  config: { iiif_url: 'https://www.artic.edu/iiif/2', website_url: 'https://www.artic.edu' },
};

describe('artworkApi.getArtworks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses list endpoint when no query', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockArtworkData });
    const result = await artworkApi.getArtworks({ page: 1, limit: 20 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('A Sunday on La Grande Jatte');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/artworks'),
      expect.objectContaining({ params: expect.objectContaining({ page: 1 }) })
    );
  });

  it('uses search endpoint when query provided', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockArtworkData });
    await artworkApi.getArtworks({ query: 'Seurat', page: 1, limit: 20 });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/artworks/search'),
      expect.any(Object)
    );
  });
});

describe('getImageUrl', () => {
  it('returns null for null imageId', () => {
    expect(getImageUrl(null)).toBeNull();
  });
  it('builds correct URL', () => {
    const url = getImageUrl('abc123');
    expect(url).toContain('abc123');
    expect(url).toContain('artic.edu/iiif/2');
  });
});

describe('getThumbnailUrl', () => {
  it('returns null for null', () => {
    expect(getThumbnailUrl(null)).toBeNull();
  });
  it('returns thumbnail URL', () => {
    const url = getThumbnailUrl('xyz');
    expect(url).toContain('xyz');
    expect(url).toContain('200,');
  });
});
