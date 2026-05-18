import React from 'react';
import { ArtworkDetail } from '../components/artworks/ArtworkDetail';
import { useFavorites } from '../store/favorites';
import type { ArtworkListItem } from '../types/artwork';

export const ArtworkDetailPage: React.FC = () => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleToggle = (id: number, title: string, imageId: string | null, artist: string | null) => {
    const stub: ArtworkListItem = {
      id, title, artist_title: artist, date_display: null, date_start: null,
      artwork_type_title: null, classification_title: null, department_title: null,
      image_id: imageId, thumbnail: null, is_public_domain: false,
    };
    toggleFavorite(stub);
  };

  return (
    <ArtworkDetail
      onToggleFavorite={handleToggle}
      isFavorite={isFavorite}
    />
  );
};
