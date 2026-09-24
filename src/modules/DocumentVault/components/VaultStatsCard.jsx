import React from 'react';
import {
  FileText,
  HardDrive,
  Share2,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';

export const VaultStatsCard = ({ stats, onSelectMetricFilter }) => {
  const cards = [
    { id: 'all', title: 'Total Documents', value: stats.totalDocuments, subtitle: 'Across all departments', icon: FileText, color: 'blue' },
    { id: 'storage', title: 'Total Storage Used', value: stats.totalStorageFormatted, subtitle: 'Encrypted object storage', icon: HardDrive, color: 'purple' },
    { id: 'shared', title: 'Documents Shared', value: stats.documentsShared, subtitle: 'Public & cross-team shared', icon: Share2, color: 'blue' },
    { id: 'approvals', title: 'Pending Approvals', value: stats.pendingApprovals, subtitle: 'Awaiting manager sign-off', icon: CheckCircle2, color: 'amber' },
    { id: 'expiring', title: 'Expiring Soon', value: stats.expiringSoonCount, subtitle: 'Review required < 60 days', icon: Clock, color: 'red' },
    { id: 'recent', title: 'Recently Updated', value: stats.recentlyUpdatedCount, subtitle: 'Updated in September 2026', icon: RefreshCw, color: 'green' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectMetricFilter && onSelectMetricFilter(card.id)}
            className="glass-surface-l1 prec-card-hover"
            style={{
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.title}
              </span>
              <div style={{
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 246, 255, 0.85)',
                color: 'var(--primary-blue)',
                border: '1px solid rgba(37, 99, 235, 0.2)'
              }}>
                <Icon size={15} />
              </div>
            </div>

            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em', lineHeight: 1.1 }} className="num-tabular">
              {card.value}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
