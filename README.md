# GrowMeOrganic React Internship Assignment

Art Institute of Chicago artwork browser built with React + TypeScript + Vite + PrimeReact.

## Features

-  **PrimeReact DataTable** with server-side pagination
-  **Row selection** with persistent state across pages
-  **Custom N-row selection** overlay (no prefetching!)
-  **TypeScript** throughout

## Tech Stack

- React 18
- TypeScript
- Vite
- PrimeReact DataTable

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Key Design Decisions

### Persistent Selection (no prefetching)
Selections are stored as a `Set<number>` of artwork IDs. When the user navigates to a new page, only the current page's data is fetched. The ID set persists in memory and is used to determine which rows should appear selected on any given page.

### Custom N-row Selection (no prefetching)
Instead of fetching multiple pages to collect N row objects, a `selectByIndexCount` integer is stored. When any page loads, rows whose global index (page offset + row index) falls within the first N rows are automatically marked selected. This avoids prefetching entirely.