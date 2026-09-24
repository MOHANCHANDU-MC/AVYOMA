import React, { useState } from 'react';
import { DocumentGrid } from '../components/DocumentGrid';
import { DocumentTable } from '../components/DocumentTable';
import { VAULT_CATEGORIES } from '../data/vaultConstants';
import { LayoutGrid, List, Filter, Download } from 'lucide-react';

export const AllDocumentsView = ({
  documents,
  onSelectDocument,
  onPreview,
  onDownload,
  onToggleStar,
  onOpenVersions,
  onOpenApprovals,
  onSoftDelete,
  onRestore
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'grid' | 'table'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState('ALL');

  const filteredDocs = documents.filter(doc => {
    if (selectedCategory !== 'ALL' && doc.categoryCode !== selectedCategory) return false;
    if (selectedConfidentiality !== 'ALL' && doc.confidentiality !== selectedConfidentiality) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* View Toolbar & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <select
            className="select-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', fontSize: '13px', padding: '6px 12px' }}
          >
            <option value="ALL">All Categories ({documents.length})</option>
            {VAULT_CATEGORIES.map(c => (
              <option key={c.id} value={c.code}>{c.name}</option>
            ))}
          </select>

          {/* Confidentiality Filter */}
          <select
            className="select-field"
            value={selectedConfidentiality}
            onChange={(e) => setSelectedConfidentiality(e.target.value)}
            style={{ width: 'auto', fontSize: '13px', padding: '6px 12px' }}
          >
            <option value="ALL">All Classifications</option>
            <option value="PUBLIC">Public</option>
            <option value="INTERNAL">Internal Use Only</option>
            <option value="CONFIDENTIAL">Confidential</option>
            <option value="RESTRICTED">Restricted (Defence)</option>
          </select>
        </div>

        {/* Layout Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(226, 232, 240, 0.6)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('table')}
            style={{ padding: '5px 10px' }}
          >
            <List size={14} /> Table
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('grid')}
            style={{ padding: '5px 10px' }}
          >
            <LayoutGrid size={14} /> Grid
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      {viewMode === 'table' ? (
        <DocumentTable
          documents={filteredDocs}
          onRowClick={onSelectDocument}
          onPreview={onPreview}
          onDownload={onDownload}
          onToggleStar={onToggleStar}
          onOpenVersions={onOpenVersions}
          onOpenApprovals={onOpenApprovals}
          onSoftDelete={onSoftDelete}
          onRestore={onRestore}
        />
      ) : (
        <DocumentGrid
          documents={filteredDocs}
          onSelectDocument={onSelectDocument}
          onPreview={onPreview}
          onDownload={onDownload}
          onToggleStar={onToggleStar}
          onOpenVersions={onOpenVersions}
          onOpenApprovals={onOpenApprovals}
        />
      )}

    </div>
  );
};
