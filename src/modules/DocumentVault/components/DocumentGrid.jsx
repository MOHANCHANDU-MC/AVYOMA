import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Compass,
  Download,
  Eye,
  Star,
  MoreVertical,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Lock,
  GitBranch
} from 'lucide-react';
import { CONFIDENTIALITY_LEVELS, APPROVAL_STATUSES } from '../data/vaultConstants';

export const DocumentGrid = ({ documents, onSelectDocument, onPreview, onDownload, onToggleStar, onOpenVersions, onOpenApprovals }) => {
  const getFileIcon = (ext) => {
    switch ((ext || '').toLowerCase()) {
      case 'pdf': return <FileText size={24} style={{ color: '#EF4444' }} />;
      case 'xlsx': case 'csv': return <FileSpreadsheet size={24} style={{ color: '#10B981' }} />;
      case 'png': case 'jpg': case 'jpeg': return <ImageIcon size={24} style={{ color: '#8B5CF6' }} />;
      case 'dxf': case 'step': case 'dwg': return <Compass size={24} style={{ color: '#2563EB' }} />;
      default: return <FileText size={24} style={{ color: '#3B82F6' }} />;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {documents.map(doc => {
        const conf = CONFIDENTIALITY_LEVELS[doc.confidentiality] || CONFIDENTIALITY_LEVELS.INTERNAL;
        const appStatus = APPROVAL_STATUSES[doc.status] || APPROVAL_STATUSES.APPROVED;

        return (
          <div
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className="glass-surface-l1 prec-card-hover"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div>
              {/* Header Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getFileIcon(doc.fileExtension)}
                  <div>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {doc.id}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(226, 232, 240, 0.7)',
                      color: 'var(--text-secondary)',
                      marginLeft: '6px'
                    }}>
                      v{doc.version}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={(e) => { e.stopPropagation(); onToggleStar(doc.id); }}
                  style={{ color: doc.starred ? '#F59E0B' : 'var(--text-muted)' }}
                >
                  <Star size={16} fill={doc.starred ? '#F59E0B' : 'none'} />
                </button>
              </div>

              {/* Title & Desc */}
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)', marginBottom: '4px', lineHeight: 1.3 }}>
                {doc.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {doc.description}
              </div>
            </div>

            {/* Footer Metadata & Badges */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: conf.badgeBg,
                  color: conf.text,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {conf.label}
                </span>

                <span className={`badge ${appStatus.badgeClass}`}>
                  {appStatus.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{doc.fileSize} • {doc.department}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={(e) => { e.stopPropagation(); onPreview(doc); }}
                    title="Preview Document"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
                    title="Download File"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={(e) => { e.stopPropagation(); onOpenVersions(doc); }}
                    title="Version History"
                  >
                    <GitBranch size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
