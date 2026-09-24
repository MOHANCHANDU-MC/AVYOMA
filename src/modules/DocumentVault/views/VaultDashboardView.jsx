import React from 'react';
import { VaultStatsCard } from '../components/VaultStatsCard';
import { DocumentGrid } from '../components/DocumentGrid';
import {
  Upload,
  Plus,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const VaultDashboardView = ({
  stats,
  documents,
  approvals,
  onNavigateSubTab,
  onSelectDocument,
  onPreview,
  onDownload,
  onToggleStar,
  onOpenVersions,
  onOpenApprovals,
  onOpenUpload,
  onOpenCreateFolder
}) => {
  const recentDocs = documents.slice(0, 4);
  const pendingApprovalsList = approvals.filter(a => a.stage === 'UNDER_REVIEW' || a.stage === 'SUBMITTED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 📊 Live Statistics Row */}
      <VaultStatsCard
        stats={stats}
        onSelectMetricFilter={(cardId) => {
          if (cardId === 'approvals') onNavigateSubTab('approvals');
          else if (cardId === 'expiring') onNavigateSubTab('expiring');
          else onNavigateSubTab('all-documents');
        }}
      />

      {/* 👑 Hero Quick Actions Strip */}
      <div className="glass-surface-l1" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Quick Document Operations</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instantly execute vault workflows or upload technical specifications</div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenCreateFolder} style={{ gap: '6px' }}>
            <Plus size={14} /> Create Folder
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigateSubTab('approvals')} style={{ gap: '6px' }}>
            <CheckCircle2 size={14} /> Review Approvals ({pendingApprovalsList.length})
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenUpload} style={{ gap: '6px' }}>
            <Upload size={14} /> Upload New Document
          </button>
        </div>
      </div>

      {/* 📄 Two-Column Section: Pending Approvals & Recent Documents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Pending Approvals Widget */}
        <div className="glass-surface-l1" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Pending Document Approvals ({pendingApprovalsList.length})</div>
              <div className="card-subtitle">Documents requiring compliance or technical review</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateSubTab('approvals')}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingApprovalsList.map(app => (
              <div
                key={app.id}
                onClick={() => onOpenApprovals(app)}
                className="prec-card-hover"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-dark)' }}>{app.documentTitle}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Requested by: {app.requestedBy} • Assigned to: <strong>{app.assignedApprover}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-purple">{app.stage}</span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Due: {app.deadlineAt?.substring(0, 10)}</div>
                </div>
              </div>
            ))}

            {pendingApprovalsList.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                ✓ No pending document approvals requiring action.
              </div>
            )}
          </div>
        </div>

        {/* Expiring Soon Alerts */}
        <div className="glass-surface-l1" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Document Reviews & Expiry Alerts</div>
              <div className="card-subtitle">Contracts & certs nearing retention/expiry dates</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateSubTab('expiring')}>Manage</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documents.filter(d => d.expiryDate).slice(0, 3).map(doc => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="prec-card-hover"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(254, 243, 199, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{doc.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--status-amber-text)', marginTop: '2px' }}>
                    Category: {doc.category} • Contract: {doc.contractNumber || 'N/A'}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-amber-text)' }} className="num-tabular">
                  Expires {doc.expiryDate}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 📄 Recent Documents Grid */}
      <div className="glass-surface-l1">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div>
            <div className="card-title">Recent Document Library</div>
            <div className="card-subtitle">Latest active specifications, contracts, and engineering schematics</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigateSubTab('all-documents')}>
            View Full Library <ArrowRight size={14} />
          </button>
        </div>

        <DocumentGrid
          documents={recentDocs}
          onSelectDocument={onSelectDocument}
          onPreview={onPreview}
          onDownload={onDownload}
          onToggleStar={onToggleStar}
          onOpenVersions={onOpenVersions}
          onOpenApprovals={onOpenApprovals}
        />
      </div>

    </div>
  );
};
