import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We had trouble loading the artworks. Please try again.',
  onRetry,
}) => (
  <div className="empty-state">
    <div className="empty-state__icon empty-state__icon--error">
      <AlertTriangle size={32} />
    </div>
    <h3 className="empty-state__title">{title}</h3>
    <p className="empty-state__message">{message}</p>
    {onRetry && (
      <button className="btn btn--primary" onClick={onRetry}>
        <RefreshCw size={16} />
        Try Again
      </button>
    )}
  </div>
);

interface EmptyStateProps {
  query?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ query, onClear }) => (
  <div className="empty-state">
    <div className="empty-state__icon">
      <span style={{ fontSize: '2rem' }}>🖼️</span>
    </div>
    <h3 className="empty-state__title">No artworks found</h3>
    <p className="empty-state__message">
      {query
        ? `No results for "${query}". Try adjusting your search or filters.`
        : 'No artworks match your current filters.'}
    </p>
    {onClear && (
      <button className="btn btn--secondary" onClick={onClear}>
        Clear filters
      </button>
    )}
  </div>
);
