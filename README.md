# Artwork Explorer

A production-grade React web application for browsing, searching, and saving artworks from the **Art Institute of Chicago's permanent collection** (120,000+ artworks).

---

## What It Does

Artwork Explorer solves the problem of navigating a massive museum dataset in a clean, fast, and user-friendly way. Users can:

- Browse the full AIC collection in a responsive data table
- Search by keyword with debounced input (no lag, no wasted API calls)
- Filter by department, date range, and public domain status
- Sort by title, artist, date, or department
- Select rows persistently across pages
- Bookmark favorite artworks (saved to localStorage)
- View full artwork detail pages with high-res images and metadata
- See visual charts of the current results by department and decade
- Toggle dark mode (remembers your preference)

---

## Project Flow

```
User opens app
    └── App.tsx sets up QueryClient + Router + dark mode
            └── /artworks → ArtworksPage
                    ├── useSearch()        debounced query, sort, filters
                    ├── usePagination()    server-side page state
                    ├── useArtworks()      TanStack Query → artworkApi → AIC API
                    ├── ArtworkTable       renders rows with skeleton loaders
                    ├── FilterPanel        department / date / public domain
                    ├── Pagination         page controls with keep-previous-data
                    └── ArtworkCharts      Recharts pie + bar (optional toggle)

            └── /artworks/:id → ArtworkDetailPage
                    └── useArtwork(id)     fetches full detail, high-res IIIF image

            └── /favorites → FavoritesPage
                    └── useFavorites()     reads from localStorage
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **TypeScript** | Static typing, compile-time safety |
| **Vite 8** | Fast dev server and optimized production builds |
| **TanStack Query v5** | Server state — caching, background refetch, deduplication |
| **React Router v7** | Client-side routing (`/artworks`, `/artworks/:id`, `/favorites`) |
| **Axios** | HTTP client with clean API and easy test mocking |
| **Recharts** | React-native charting (pie + bar charts) |
| **use-debounce** | Delays search calls until user stops typing (400ms) |
| **lucide-react** | Consistent icon set |
| **Vitest + RTL** | Unit testing — components, hooks, API layer |

---

## Folder Structure

```
src/
├── components/
│   ├── artworks/       # ArtworkTable, ArtworkDetail
│   ├── charts/         # ArtworkCharts (Recharts)
│   ├── layout/         # Navbar
│   └── ui/             # SearchBar, FilterPanel, Pagination, Skeleton, ErrorState
├── hooks/
│   ├── useArtworks.ts  # TanStack Query wrappers with AbortController
│   ├── usePagination.ts
│   └── useSearch.ts    # Debounced query + sort/filter state
├── pages/
│   ├── ArtworksPage.tsx
│   ├── ArtworkDetailPage.tsx
│   └── FavoritesPage.tsx
├── services/
│   └── artworkApi.ts   # All API calls (list, search, detail, image URLs)
├── store/
│   └── favorites.ts    # useFavorites + usePersistentSelection (localStorage)
├── types/
│   └── artwork.ts      # TypeScript interfaces for API responses
├── utils/
│   └── helpers.ts      # truncate, stripHtml, groupBy, getDecade, cn
└── test/
    ├── helpers.test.ts
    ├── components.test.tsx
    └── artworkApi.test.ts
```

---

## Key Engineering Decisions

**Custom Hooks**
All business logic lives in hooks, not components. Components only handle rendering. This makes logic reusable and components easy to read.

**TanStack Query**
Replaces manual `useEffect`/`useState` for data fetching. Gives automatic caching (5min stale time), background refetching, and `keepPreviousData` so the table never flickers between pages.

**Request Cancellation**
Every search uses an `AbortController`. If the user types again before the previous request completes, it's cancelled — preventing race conditions and stale results overwriting fresh ones.

**Server-side Pagination**
Only 20 records are fetched at a time. The app stays fast regardless of the 120,000+ item collection size.

**localStorage Persistence**
Favorites and row selections are stored in localStorage — they survive page refresh and browser restarts, with no backend required.

**Code Splitting**
Production bundle is split into separate chunks so the browser loads only what it needs first:
- `react-vendor` — React, ReactDOM, React Router
- `query-vendor` — TanStack Query
- `chart-vendor` — Recharts + D3

**Performance**
- `React.memo` on every table row — prevents re-renders when unrelated state changes
- `useMemo` and `useCallback` for referential stability
- Lazy image loading on all thumbnails
- Skeleton loaders instead of spinners for perceived performance

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Run tests
npm run test:run

# Production build
npm run build
```

---

## Environment Variables

Create a `.env` file (or copy `.env.example`):

```
VITE_API_BASE_URL=https://api.artic.edu/api/v1
```

---

## Tests

**28 tests** across 3 files — all passing.

```
src/test/helpers.test.ts       11 tests — utility functions
src/test/components.test.tsx   11 tests — rendering + user interactions
src/test/artworkApi.test.ts     6 tests — mocked Axios API calls
```

```bash
npm run test:run       # run once
npm run test           # watch mode
npm run test:coverage  # with coverage report
```

---

## Deployment

### Vercel
```bash
npx vercel --prod
```
`vercel.json` is already configured with SPA rewrites.

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```
`netlify.toml` is already configured with redirect rules.

---

## API

This app uses the **Art Institute of Chicago public API** — no API key required.

| Endpoint | Used For |
|---|---|
| `GET /artworks` | Paginated list with sorting |
| `GET /artworks/search` | Keyword search |
| `GET /artworks/:id` | Full artwork detail |
| IIIF Image API | High-res and thumbnail images |

---

## Routes

| Path | Page |
|---|---|
| `/artworks` | Main browsable collection |
| `/artworks/:id` | Full detail view |
| `/favorites` | Bookmarked artworks |

---

## Design

- **Fonts**: Cormorant Garamond (display) · DM Sans (body) · DM Mono (data)
- **Accent color**: warm golden amber (`#c8975a`)
- **Theming**: CSS custom properties with `data-theme="dark"` toggle
- **Responsive**: breakpoints at 768px and 480px — columns collapse gracefully on mobile
