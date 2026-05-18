import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import type { ArtworkListItem } from '../../types/artwork';
import { getDecade, groupBy } from '../../utils/helpers';

interface ArtworkChartsProps {
  artworks: ArtworkListItem[];
}

const COLORS = [
  '#c8975a', '#7b9e87', '#6b7fb8', '#b87c8a', '#8fa8c0',
  '#c4a882', '#7dada0', '#a89bc8', '#c4937a', '#9db8a0',
];

const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }> = ({
  active, payload, label
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__value">{payload[0].value} artworks</p>
    </div>
  );
};

export const ArtworkCharts: React.FC<ArtworkChartsProps> = ({ artworks }) => {
  const deptData = useMemo(() => {
    const groups = groupBy(artworks, a => a.department_title || 'Unknown');
    return Object.entries(groups)
      .map(([name, items]) => ({ name: name.replace('and', '&'), count: items.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [artworks]);

  const decadeData = useMemo(() => {
    const groups = groupBy(artworks.filter(a => a.date_start), a => getDecade(a.date_start));
    return Object.entries(groups)
      .map(([decade, items]) => ({ decade, count: items.length }))
      .sort((a, b) => {
        const aY = parseInt(a.decade) || 0;
        const bY = parseInt(b.decade) || 0;
        return aY - bY;
      })
      .slice(-12);
  }, [artworks]);

  if (!artworks.length) return null;

  return (
    <div className="charts-panel">
      <h3 className="charts-panel__title">Artwork Distribution</h3>
      <div className="charts-grid">
        {deptData.length > 0 && (
          <div className="chart-card">
            <h4 className="chart-card__title">By Department</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={deptData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={30}
                >
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value: string) => value.length > 20 ? value.slice(0, 20) + '…' : value}
                  iconSize={10}
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {decadeData.length > 0 && (
          <div className="chart-card">
            <h4 className="chart-card__title">By Decade</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={decadeData} margin={{ top: 4, right: 4, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="decade"
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  angle={-45}
                  textAnchor="end"
                  height={40}
                />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--accent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
