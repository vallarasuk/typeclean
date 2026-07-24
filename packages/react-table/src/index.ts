import { useState, useMemo } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => any;
}

export interface UseTableOptions<T> {
  data: T[];
  columns: Column<T>[];
  initialPageSize?: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export function useTable<T>(options: UseTableOptions<T>) {
  const [data, setData] = useState<T[]>(options.data);
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting State
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.initialPageSize ?? 10);

  // Derived Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search / Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((row) => {
        return options.columns.some((col) => {
          const val = col.accessor ? col.accessor(row) : (row as any)[col.key];
          return String(val).toLowerCase().includes(lowerQuery);
        });
      });
    }

    // Sort (Optimized)
    if (sortKey && sortDirection) {
      const col = options.columns.find((c) => c.key === sortKey);
      if (col) {
        // Pre-compute accessors to avoid O(N log N) accessor calls
        const mapped = result.map((item, index) => {
          return {
            index,
            value: col.accessor ? col.accessor(item) : (item as any)[sortKey],
          };
        });

        mapped.sort((a, b) => {
          if (a.value < b.value) return sortDirection === 'asc' ? -1 : 1;
          if (a.value > b.value) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });

        result = mapped.map((el) => result[el.index]);
      }
    }

    return result;
  }, [data, searchQuery, sortKey, sortDirection, options.columns]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Actions
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const exportToCsv = (filename: string = 'export.csv') => {
    const headers = options.columns.map((c) => c.header).join(',');
    const rows = processedData.map((row) => {
      return options.columns
        .map((col) => {
          const val = col.accessor ? col.accessor(row) : (row as any)[col.key];
          // Escape quotes
          const stringVal = String(val ?? '').replace(/"/g, '""');
          return `"${stringVal}"`;
        })
        .join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    // Create download trigger (client side only)
    if (typeof window !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return csvContent;
  };

  return {
    // State
    searchQuery,
    sortKey,
    sortDirection,
    currentPage,
    pageSize,
    totalPages,
    totalItems: processedData.length,

    // Data
    paginatedData,
    processedData,

    // Actions
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    handleSort,
    exportToCsv,
    setData,
  };
}
