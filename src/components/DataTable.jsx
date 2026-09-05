import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Eye, Filter, SlidersHorizontal } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  onRowClick,
  searchPlaceholder = 'Search records...',
  bulkActions = [],
  emptyMessage = 'No records found.'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Data
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val =>
      String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate Data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div className="input-search-wrapper" style={{ flex: 1, maxWidth: '320px' }}>
            <Search size={16} className="input-search-icon" />
            <input
              type="text"
              className="input-field input-search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Showing {filteredData.length} records
          </span>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-blue)' }}>
              {selectedIds.length} selected
            </span>
            {bulkActions.map((action, idx) => (
              <button key={idx} className="btn btn-secondary btn-sm" onClick={() => action.onClick(selectedIds)}>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="prec-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.field}
                  style={{ cursor: col.sortable !== false ? 'pointer' : 'default', width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.field)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{col.header}</span>
                    {sortField === col.field && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => toggleSelectRow(row.id, e)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.field}>
                      {col.render ? col.render(row[col.field], row) : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-toolbar" style={{ borderTop: '1px solid var(--border-color)', borderBottom: 'none' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Page {currentPage} of {totalPages}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
