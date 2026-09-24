import React from 'react';
import { DataTable } from '../../../components/DataTable';
import { CONFIDENTIALITY_LEVELS, APPROVAL_STATUSES } from '../data/vaultConstants';
import {
  FileText,
  Download,
  Eye,
  Star,
  GitBranch,
  ShieldCheck,
  RotateCcw,
  Trash2
} from 'lucide-react';

export const DocumentTable = ({
  documents,
  onRowClick,
  onPreview,
  onDownload,
  onToggleStar,
  onOpenVersions,
  onOpenApprovals,
  onSoftDelete,
  onRestore,
  isTrashView = false
}) => {
  const columns = [
    {
      header: 'Doc ID',
      field: 'id',
      width: '120px',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            onClick={(e) => { e.stopPropagation(); onToggleStar(row.id); }}
            style={{ padding: '2px', color: row.starred ? '#F59E0B' : 'var(--text-muted)' }}
          >
            <Star size={14} fill={row.starred ? '#F59E0B' : 'none'} />
          </button>
          <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span>
        </div>
      )
    },
    {
      header: 'Title & File Name',
      field: 'title',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.fileName} • {row.fileSize}</div>
          </div>
        </div>
      )
    },
    { header: 'Category', field: 'category' },
    {
      header: 'Version',
      field: 'version',
      width: '80px',
      render: (val) => (
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(226, 232, 240, 0.8)',
          color: 'var(--text-dark)'
        }}>
          v{val}
        </span>
      )
    },
    {
      header: 'Confidentiality',
      field: 'confidentiality',
      render: (val) => {
        const conf = CONFIDENTIALITY_LEVELS[val] || CONFIDENTIALITY_LEVELS.INTERNAL;
        return (
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: conf.badgeBg,
            color: conf.text
          }}>
            {conf.label}
          </span>
        );
      }
    },
    {
      header: 'Approval Status',
      field: 'status',
      render: (val) => {
        const app = APPROVAL_STATUSES[val] || APPROVAL_STATUSES.APPROVED;
        return <span className={`badge ${app.badgeClass}`}>{app.label}</span>;
      }
    },
    { header: 'Owner', field: 'owner' },
    { header: 'Updated', field: 'updatedAt', render: (val) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{val}</span> },
    {
      header: 'Actions',
      field: 'id',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {!isTrashView ? (
            <>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={(e) => { e.stopPropagation(); onPreview(row); }}
                title="Preview"
              >
                <Eye size={14} />
              </button>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={(e) => { e.stopPropagation(); onDownload(row); }}
                title="Download"
              >
                <Download size={14} />
              </button>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={(e) => { e.stopPropagation(); onOpenVersions(row); }}
                title="Version History"
              >
                <GitBranch size={14} />
              </button>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={(e) => { e.stopPropagation(); onSoftDelete(row.id); }}
                title="Move to Trash"
                style={{ color: 'var(--status-red)' }}
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => { e.stopPropagation(); onRestore(row.id); }}
              style={{ gap: '4px', fontSize: '11px' }}
            >
              <RotateCcw size={13} /> Restore
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={documents}
      onRowClick={onRowClick}
      searchPlaceholder="Search document library by title, category, owner..."
    />
  );
};
