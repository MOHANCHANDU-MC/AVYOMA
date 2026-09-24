import React from 'react';
import { DocumentTable } from '../components/DocumentTable';
import { Trash2, RotateCcw, Shield } from 'lucide-react';

export const ArchivedTrashView = ({
  deletedDocuments,
  onRestore,
  onSelectDocument,
  onPreview
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-surface-l1" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--status-red)' }}>
        <Trash2 size={24} style={{ color: 'var(--status-red)' }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>Trash & Recovery Vault ({deletedDocuments.length})</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Soft-deleted documents remain in recovery storage for 90 days before permanent compliance purge.</div>
        </div>
      </div>

      {deletedDocuments.length > 0 ? (
        <DocumentTable
          documents={deletedDocuments}
          onRowClick={onSelectDocument}
          onPreview={onPreview}
          onRestore={onRestore}
          isTrashView={true}
        />
      ) : (
        <div className="glass-surface-l1" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-dark)' }}>Trash Vault is Empty</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>No documents are currently soft-deleted.</div>
        </div>
      )}

    </div>
  );
};
