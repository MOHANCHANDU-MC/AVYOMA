import React from 'react';
import { DataTable } from '../../components/DataTable';
import { formatDate } from '../../utils/formatters';
import { FolderOpen, FileText, Download, Upload } from 'lucide-react';

export const DocumentsView = ({ documents }) => {
  const columns = [
    { header: 'ID', field: 'id', width: '90px', render: (val) => <span className="font-mono">{val}</span> },
    {
      header: 'File Name', field: 'fileName', render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} style={{ color: 'var(--primary-blue)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.size}</div>
          </div>
        </div>
      )
    },
    { header: 'Document Type', field: 'fileType', render: (val) => <span className="badge badge-purple">{val}</span> },
    { header: 'Related Entity', field: 'relatedEntity', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'Uploaded By', field: 'uploadedBy' },
    { header: 'Upload Date', field: 'uploadDate', render: (val) => formatDate(val) },
    {
      header: 'Actions', field: 'id', sortable: false, render: () => (
        <button className="btn btn-ghost btn-sm" title="Download Document">
          <Download size={14} /> Download
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Document Repository ({documents.length})</h2>
          <div className="page-subtitle">Centralized repository for RFQs, Tenders, NDAs, Technical Specs, CAD drawings, and Certificates</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Upload size={16} /> Upload Document
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        searchPlaceholder="Search documents by name, type, entity..."
      />
    </div>
  );
};
