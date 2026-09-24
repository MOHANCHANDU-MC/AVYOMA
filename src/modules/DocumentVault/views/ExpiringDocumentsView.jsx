import React from 'react';
import { DocumentTable } from '../components/DocumentTable';
import { Clock, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ExpiringDocumentsView = ({
  documents,
  onSelectDocument,
  onPreview,
  onDownload,
  onToggleStar,
  onOpenVersions,
  onOpenApprovals,
  onSoftDelete
}) => {
  const expiringDocs = documents.filter(d => d.expiryDate || d.reviewDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-surface-l1" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--status-amber)' }}>
        <Clock size={24} style={{ color: 'var(--status-amber-text)' }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>Document Lifecycle & Expiry Tracker ({expiringDocs.length})</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tracks contracts, NDAs, supplier ISO certificates, and military specs requiring periodic review or renewal.</div>
        </div>
      </div>

      <DocumentTable
        documents={expiringDocs}
        onRowClick={onSelectDocument}
        onPreview={onPreview}
        onDownload={onDownload}
        onToggleStar={onToggleStar}
        onOpenVersions={onOpenVersions}
        onOpenApprovals={onOpenApprovals}
        onSoftDelete={onSoftDelete}
      />
    </div>
  );
};
