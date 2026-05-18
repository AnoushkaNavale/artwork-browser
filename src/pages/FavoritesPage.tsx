import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../store/favorites';
import { getThumbnailUrl } from '../services/artworkApi';
import { truncate } from '../utils/helpers';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const items = [...favorites.values()];

  return (
    <main className="favorites-page">
      <div className="favorites-page__header">
        <button className="detail-page__back" onClick={() => navigate('/artworks')}>
          <ArrowLeft size={18} /> Back to Browse
        </button>
        <div className="favorites-page__title-row">
          <div>
            <h1 className="artworks-page__title">
              <Heart size={24} fill="currentColor" style={{ color: 'var(--accent)' }} />
              Saved Artworks
            </h1>
            <p className="artworks-page__subtitle">{items.length} saved artwork{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button className="btn btn--ghost" onClick={clearFavorites}>
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <Heart size={32} />
          </div>
          <h3 className="empty-state__title">No saved artworks yet</h3>
          <p className="empty-state__message">
            Browse the collection and click the heart icon to save artworks you love.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/artworks')}>
            Browse Collection
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {items.map(artwork => {
            const thumb = getThumbnailUrl(artwork.image_id);
            return (
              <div
                key={artwork.id}
                className="favorite-card"
                onClick={() => navigate(`/artworks/${artwork.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/artworks/${artwork.id}`)}
              >
                <div className="favorite-card__image">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={artwork.thumbnail?.alt_text || artwork.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="favorite-card__placeholder">🖼️</div>
                  )}
                </div>
                <div className="favorite-card__info">
                  <h4 className="favorite-card__title">{truncate(artwork.title, 50)}</h4>
                  {artwork.artist_title && (
                    <p className="favorite-card__artist">{artwork.artist_title}</p>
                  )}
                  {artwork.date_display && (
                    <p className="favorite-card__date">{artwork.date_display}</p>
                  )}
                </div>
                <button
                  className="favorite-card__remove"
                  onClick={e => { e.stopPropagation(); removeFavorite(artwork.id); }}
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};
