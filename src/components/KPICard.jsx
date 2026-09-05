import React from 'react';

export const KPICard = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
  return (
    <div className="prec-card prec-card-hover" style={{ flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color === 'blue' ? 'var(--primary-blue-light)' : color === 'green' ? 'var(--status-green-bg)' : color === 'amber' ? 'var(--status-amber-bg)' : 'var(--status-gray-bg)',
            color: color === 'blue' ? 'var(--primary-blue)' : color === 'green' ? 'var(--status-green-text)' : color === 'amber' ? 'var(--status-amber-text)' : 'var(--text-dark)'
          }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-dark)', letterSpacing: '-0.02em', marginBottom: '4px' }} className="num-tabular">
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend && (
            <span style={{ color: trend.startsWith('+') ? 'var(--status-green-text)' : 'var(--status-red-text)', fontWeight: 600 }}>
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};
