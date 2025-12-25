
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Filter, MoreHorizontal, Download } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  actions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  title, 
  actions, 
  isLoading 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = (a as any)[key];
    const bValue = (b as any)[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {(title || data.length > 0) && (
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors shadow-sm">
              <Download size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-slate-300 shadow-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ${col.sortable ? 'cursor-pointer hover:text-indigo-600' : ''}`}
                  onClick={() => col.sortable && typeof col.accessor === 'string' && handleSort(col.accessor as string)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      sortConfig?.key === col.accessor 
                      ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
                      : <ChevronsUpDown size={14} className="opacity-30" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-full"></div></td>
                  ))}
                  {actions && <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-full"></div></td>}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-slate-300">
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item as any)[col.accessor as string]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
        {!isLoading && paginatedData.length === 0 && (
          <EmptyState 
            title="No records found" 
            description="Adjust your search or filters to find what you're looking for." 
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/50">
          <div className="text-xs font-bold text-gray-500 dark:text-slate-500">
            Showing <span className="text-gray-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="text-gray-900 dark:text-white">{data.length}</span> entries
          </div>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 text-xs font-black bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-600 transition-all shadow-sm"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 text-xs font-black bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-600 transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
