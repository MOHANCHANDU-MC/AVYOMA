import React from 'react';

export const KPICard = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
  const getBadgeStyle = () => {
    switch (color) {
      case 'green':
        return { bg: 'rgba(236, 253, 245, 0.8)', text: 'var(--status-green-text)', border: 'rgba(16, 185, 129, 0.25)' };
      case 'amber':
        return { bg: 'rgba(254, 243, 199, 0.8)', text: 'var(--status-amber-text)', border: 'rgba(245, 158, 11, 0.25)' };
      case 'red':
        return { bg: 'rgba(254, 226, 226, 0.8)', text: 'var(--status-red-text)', border: 'rgba(239, 68, 68, 0.25)' };
      case 'purple':
        return { bg: 'rgba(243, 232, 255, 0.8)', text: 'var(--status-purple-text)', border: 'rgba(139, 92, 246, 0.25)' };
      default:
        return { bg: 'rgba(239, 246, 255, 0.85)', text: 'var(--primary-blue)', border: 'rgba(37, 99, 235, 0.25)' };
    }
  };

  const badgeStyle = getBadgeStyle();
  const isPositiveTrend = trend && (trend.startsWith('+') || trend.includes('up'));

  return (
    <div className="glass-surface-l1 prec-card-hover" style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.text,
            border: `1px solid ${badgeStyle.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
          }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{
        fontSize: '26px',
        fontWeight: 700,
        color: 'var(--text-dark)',
        letterSpacing: '-0.03em',
        marginBottom: '6px',
        lineHeight: 1.1
      }} className="num-tabular">
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: isPositiveTrend ? 'var(--status-green-bg)' : 'var(--status-red-bg)',
              color: isPositiveTrend ? 'var(--status-green-text)' : 'var(--status-red-text)',
              border: `1px solid ${isPositiveTrend ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};
