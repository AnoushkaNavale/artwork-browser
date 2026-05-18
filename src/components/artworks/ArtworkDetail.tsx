import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink, Calendar, MapPin, Layers, Tag } from 'lucide-react';
import { useArtwork } from '../../hooks/useArtworks';
import { getImageUrl } from '../../services/artworkApi';
import { DetailSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { stripHtml } from '../../utils/helpers';

interface ArtworkDetailProps {
  onToggleFavorite?: (id: number, title: string, imageId: string | null, artist: string | null) => void;
  isFavorite?: (id: number) => boolean;
}

const MetaItem: React.FC<{ icon: React.ReactNode; label: string; value: string | null }> = ({
  icon, label, value,
}) => {
  if (!value) return null;
  return (
    <div className="meta-item">
      <div className="meta-item__label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="meta-item__value">{value}</div>
    </div>
  );
};

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ onToggleFavorite, isFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const artworkId = id ? parseInt(id, 10) : null;

  const { data, isLoading, isError, refetch } = useArtwork(artworkId);

  const artwork = data?.data;
  const imageUrl = artwork ? getImageUrl(artwork.image_id, 843) : null;
  const articUrl = artwork ? `https://www.artic.edu/artworks/${artwork.id}` : null;

  const handleFavorite = useCallback(() => {
    if (!artwork || !onToggleFavorite) return;
    onToggleFavorite(artwork.id, artwork.title, artwork.image_id, artwork.artist_title);
  }, [artwork, onToggleFavorite]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <button className="detail-page__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !artwork) {
    return (
      <div className="detail-page">
        <button className="detail-page__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <ErrorState
          title="Artwork not found"
          message="We couldn't load this artwork. It may have been removed or is temporarily unavailable."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const favored = isFavorite ? isFavorite(artwork.id) : false;
  const description = stripHtml(artwork.description || artwork.short_description);

  return (
    <div className="detail-page">
      <div className="detail-page__nav">
        <button className="detail-page__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to artworks
        </button>
        <div className="detail-page__actions">
          {onToggleFavorite && (
            <button
              className={`btn ${favored ? 'btn--primary' : 'btn--secondary'}`}
              onClick={handleFavorite}
            >
              <Heart size={16} fill={favored ? 'currentColor' : 'none'} />
              {favored ? 'Saved' : 'Save'}
            </button>
          )}
          {articUrl && (
            <a
              className="btn btn--secondary"
              href={articUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} /> View on ARTIC
            </a>
          )}
        </div>
      </div>

      <div className="detail-page__content">
        <div className="detail-page__image-col">
          {imageUrl ? (
            <div className="detail-page__image-wrap">
              <img
                src={imageUrl}
                alt={artwork.thumbnail?.alt_text || artwork.title}
                className="detail-page__image"
                loading="lazy"
              />
              {artwork.is_public_domain && (
                <div className="detail-page__pd-badge">Public Domain</div>
              )}
            </div>
          ) : (
            <div className="detail-page__no-image">
              <span>🖼️</span>
              <p>No image available</p>
            </div>
          )}
        </div>

        <div className="detail-page__info-col">
          <div className="detail-page__header">
            <h1 className="detail-page__title">{artwork.title}</h1>
            {artwork.artist_display && (
              <p className="detail-page__artist">{artwork.artist_display}</p>
            )}
          </div>

          <div className="detail-page__meta">
            <MetaItem
              icon={<Calendar size={14} />}
              label="Date"
              value={artwork.date_display}
            />
            <MetaItem
              icon={<MapPin size={14} />}
              label="Place of Origin"
              value={artwork.place_of_origin}
            />
            <MetaItem
              icon={<Layers size={14} />}
              label="Medium"
              value={artwork.medium_display}
            />
            <MetaItem
              icon={<Tag size={14} />}
              label="Type"
              value={artwork.artwork_type_title}
            />
            <MetaItem
              icon={<Tag size={14} />}
              label="Department"
              value={artwork.department_title}
            />
            {artwork.dimensions && (
              <div className="meta-item">
                <div className="meta-item__label">
                  <span>📐</span>
                  <span>Dimensions</span>
                </div>
                <div className="meta-item__value">{artwork.dimensions}</div>
              </div>
            )}
            {artwork.credit_line && (
              <div className="meta-item">
                <div className="meta-item__label">
                  <span>ℹ️</span>
                  <span>Credit</span>
                </div>
                <div className="meta-item__value">{artwork.credit_line}</div>
              </div>
            )}
          </div>

          {description && (
            <div className="detail-page__desc">
              <h3>About this artwork</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
