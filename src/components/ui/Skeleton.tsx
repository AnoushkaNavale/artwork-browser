import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  circle = false,
  style: styleProp,
}) => {
  const style: React.CSSProperties = { ...styleProp };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`skeleton ${rounded ? 'skeleton--rounded' : ''} ${circle ? 'skeleton--circle' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export const ArtworkRowSkeleton: React.FC = () => (
  <tr className="artwork-row skeleton-row" aria-hidden="true">
    <td><Skeleton width={20} height={20} rounded /></td>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Skeleton width={48} height={48} rounded />
        <div>
          <Skeleton width={180} height={14} rounded style={{ marginBottom: '6px' }} />
          <Skeleton width={120} height={12} rounded />
        </div>
      </div>
    </td>
    <td><Skeleton width={140} height={13} rounded /></td>
    <td><Skeleton width={80} height={13} rounded /></td>
    <td><Skeleton width={100} height={13} rounded /></td>
    <td><Skeleton width={90} height={13} rounded /></td>
    <td><Skeleton width={60} height={26} rounded /></td>
  </tr>
);

export const DetailSkeleton: React.FC = () => (
  <div className="detail-skeleton">
    <div className="detail-skeleton__image">
      <Skeleton height={400} rounded />
    </div>
    <div className="detail-skeleton__content">
      <Skeleton width="80%" height={32} rounded style={{ marginBottom: '16px' }} />
      <Skeleton width="60%" height={20} rounded style={{ marginBottom: '24px' }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ marginBottom: '12px' }}>
          <Skeleton width="30%" height={12} rounded style={{ marginBottom: '4px' }} />
          <Skeleton width="70%" height={16} rounded />
        </div>
      ))}
    </div>
  </div>
);
