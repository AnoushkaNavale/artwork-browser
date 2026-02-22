import { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable, DataTablePageEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Artwork, ApiResponse } from './types';

const ROWS_PER_PAGE = 12;
const API_BASE = 'https://api.artic.edu/api/v1/artworks';
const FIELDS = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Store selected and deselected IDs — NOT full objects across pages
  // Strategy: track a Set of selected IDs + a mode flag
  // selectedIds: IDs explicitly selected
  // We never prefetch other pages. When custom N rows are requested,
  // we simply mark IDs 0..N-1 as "selected by index" using a count.
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [customCount, setCustomCount] = useState<string>('');
  const [totalSelected, setTotalSelected] = useState(0);

  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?page=${page}&limit=${ROWS_PER_PAGE}&fields=${FIELDS}`);
      const json: ApiResponse = await res.json();
      setArtworks(json.data);
      setTotalRecords(json.pagination.total);
    } catch (err) {
      console.error('Failed to fetch artworks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage, fetchArtworks]);

  // Derive selected rows on current page from selectedIds
  const selectedRows = artworks.filter(a => selectedIds.has(a.id));

  const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    const newSelected = e.value as Artwork[];
    const newSelectedIds = new Set(selectedIds);

    // Determine which rows on current page were previously selected
    const currentPageIds = new Set(artworks.map(a => a.id));

    // Remove all current page IDs from selection, then add back new selection
    currentPageIds.forEach(id => newSelectedIds.delete(id));
    newSelected.forEach(row => newSelectedIds.add(row.id));

    setSelectedIds(newSelectedIds);
    setTotalSelected(newSelectedIds.size);
  };

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    setCurrentPage(e.page + 1);
  };

  /**
   * Custom row selection: Select N rows from the START of the dataset.
   * 
   * Strategy (NO prefetching):
   * - The API returns rows in consistent order per page.
   * - We know each page has ROWS_PER_PAGE items.
   * - We mark IDs of rows on the CURRENT page that fall within the first N rows.
   * - For rows on OTHER pages, we track them by "global index range" and resolve
   *   when those pages are visited.
   * 
   * Implementation: We store a separate `selectByIndexCount` which represents
   * "select the first N rows globally". When a page loads, rows whose global
   * index < selectByIndexCount get auto-selected.
   */
  const [selectByIndexCount, setSelectByIndexCount] = useState<number>(0);

  // On page load, apply index-based selection to current page rows
  useEffect(() => {
    if (selectByIndexCount <= 0) return;
    const offset = (currentPage - 1) * ROWS_PER_PAGE;
    const newSelectedIds = new Set(selectedIds);
    artworks.forEach((artwork, i) => {
      const globalIndex = offset + i;
      if (globalIndex < selectByIndexCount) {
        newSelectedIds.add(artwork.id);
      } else {
        // If this row was previously selected via index-count but now shouldn't be, 
        // we don't deselect manually selected rows — only clear if nothing was manually changed.
        // For simplicity, leave manual selections as-is.
      }
    });
    setSelectedIds(newSelectedIds);
    setTotalSelected(newSelectedIds.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks, selectByIndexCount]);

  const handleCustomSelect = () => {
    const count = parseInt(customCount);
    if (!count || count <= 0) {
      alert('Please enter a valid number');
      return;
    }

    // Set the global index count — no API calls, no prefetching
    setSelectByIndexCount(count);

    // Apply to current page immediately
    const offset = (currentPage - 1) * ROWS_PER_PAGE;
    const newSelectedIds = new Set<number>();
    artworks.forEach((artwork, i) => {
      const globalIndex = offset + i;
      if (globalIndex < count) {
        newSelectedIds.add(artwork.id);
      }
    });

    setSelectedIds(newSelectedIds);
    setTotalSelected(Math.min(count, totalRecords));
    overlayRef.current?.hide();
    setCustomCount('');
  };

  // Checkbox column header with chevron to open overlay
  const checkboxHeader = (
    <div className="checkbox-header">
      <button
        className="chevron-btn"
        onClick={(e) => overlayRef.current?.toggle(e)}
        title="Custom row selection"
      >
        <i className="pi pi-chevron-down" style={{ fontSize: '0.7rem' }} />
      </button>
    </div>
  );

  const truncateTemplate = (field: keyof Artwork) => (rowData: Artwork) => {
    const val = rowData[field];
    return (
      <span className="truncate-text" title={val?.toString() ?? 'N/A'}>
        {val ?? 'N/A'}
      </span>
    );
  };

  const displaySelected = selectByIndexCount > 0
    ? Math.min(selectByIndexCount, totalRecords)
    : totalSelected;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1> Art Institute of Chicago</h1>
        <p>Browse artworks from the collection — {totalRecords.toLocaleString()} total entries</p>
      </div>

      <div className="table-card">
        <div className="selection-info">
          Selected: {displaySelected} row{displaySelected !== 1 ? 's' : ''}
        </div>

        <DataTable
          value={artworks}
          loading={loading}
          selection={selectedRows}
          onSelectionChange={handleSelectionChange}
          selectionMode="multiple"
          dataKey="id"
          lazy
          paginator={false}
          rows={ROWS_PER_PAGE}
          emptyMessage="No artworks found."
          tableStyle={{ minWidth: '60rem' }}
        >
          <Column
            selectionMode="multiple"
            header={checkboxHeader}
            style={{ width: '3rem' }}
          />
          <Column field="title" header="Title" body={truncateTemplate('title')} style={{ minWidth: '180px' }} />
          <Column field="place_of_origin" header="Place of Origin" body={truncateTemplate('place_of_origin')} style={{ minWidth: '120px' }} />
          <Column field="artist_display" header="Artist" body={truncateTemplate('artist_display')} style={{ minWidth: '200px' }} />
          <Column field="inscriptions" header="Inscriptions" body={truncateTemplate('inscriptions')} style={{ minWidth: '200px' }} />
          <Column field="date_start" header="Start Date" style={{ minWidth: '90px' }} />
          <Column field="date_end" header="End Date" style={{ minWidth: '90px' }} />
        </DataTable>

        <Paginator
          first={(currentPage - 1) * ROWS_PER_PAGE}
          rows={ROWS_PER_PAGE}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          template="PrevPageLink PageLinks NextPageLink"
        />
      </div>

      {/* Custom Row Selection Overlay */}
      <OverlayPanel ref={overlayRef} dismissable>
        <div className="overlay-panel-content">
          <h4>Select rows across pages</h4>
          <p style={{ fontSize: '0.8rem', color: '#718096', margin: '0 0 0.75rem' }}>
            Enter number of rows to select from the beginning of the dataset.
          </p>
          <input
            type="number"
            placeholder={`Enter number (max ${totalRecords.toLocaleString()})`}
            value={customCount}
            min={1}
            max={totalRecords}
            onChange={(e) => setCustomCount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSelect()}
            autoFocus
          />
          <button className="overlay-btn" onClick={handleCustomSelect}>
            Apply Selection
          </button>
        </div>
      </OverlayPanel>
    </div>
  );
}