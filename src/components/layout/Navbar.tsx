import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { Palette, Heart, Moon, Sun, BarChart2 } from 'lucide-react';

interface NavbarProps {
  favoriteCount: number;
  darkMode: boolean;
  onToggleDark: () => void;
  showCharts: boolean;
  onToggleCharts: () => void;
}

export const Navbar: React.FC<NavbarProps> = memo(({
  favoriteCount, darkMode, onToggleDark, showCharts, onToggleCharts,
}) => (
  <header className="navbar">
    <div className="navbar__inner">
      <NavLink to="/artworks" className="navbar__brand">
        <Palette size={22} className="navbar__logo" />
        <span className="navbar__name">Artwork Explorer</span>
        <span className="navbar__sub">Art Institute of Chicago</span>
      </NavLink>

      <nav className="navbar__links">
        <NavLink
          to="/artworks"
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
        >
          Browse
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
        >
          <Heart size={15} />
          Favorites
          {favoriteCount > 0 && (
            <span className="navbar__badge">{favoriteCount}</span>
          )}
        </NavLink>
      </nav>

      <div className="navbar__controls">
        <button
          className={`btn btn--ghost btn--icon-only ${showCharts ? 'btn--active' : ''}`}
          onClick={onToggleCharts}
          title="Toggle charts"
        >
          <BarChart2 size={18} />
        </button>
        <button
          className="btn btn--ghost btn--icon-only"
          onClick={onToggleDark}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  </header>
));

Navbar.displayName = 'Navbar';
