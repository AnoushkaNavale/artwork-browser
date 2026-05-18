import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navbar } from './components/layout/Navbar';
import { ArtworksPage } from './pages/ArtworksPage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { useFavorites } from './store/favorites';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const DARK_MODE_KEY = 'artwork-explorer-dark';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showCharts, setShowCharts] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar
          favoriteCount={favorites.size}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(v => !v)}
          showCharts={showCharts}
          onToggleCharts={() => setShowCharts(v => !v)}
        />
        <div className="app__body">
          <Routes>
            <Route path="/" element={<Navigate to="/artworks" replace />} />
            <Route path="/artworks" element={<ArtworksPage showCharts={showCharts} />} />
            <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
