import React from 'react';
import { VAULT_CATEGORIES } from '../data/vaultConstants';
import { FolderTree, Plus, CheckCircle2 } from 'lucide-react';

export const CategoriesView = ({ documents }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>Taxonomy & Category Management</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Configurable document classification categories for aerospace & enterprise documents</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {VAULT_CATEGORIES.map(cat => {
          const docCount = documents.filter(d => d.categoryCode === cat.code).length;
          return (
            <div key={cat.id} className="glass-surface-l1 prec-card-hover" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary-blue)', background: 'rgba(239, 246, 255, 0.9)', padding: '2px 6px', borderRadius: '4px' }}>
                    {cat.code}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)' }} className="num-tabular">
                    {docCount} docs
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-dark)', marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.description}</div>
              </div>

              <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--status-green-text)', fontWeight: 600 }}>
                <span>✓ Active Category</span>
                <span style={{ color: 'var(--text-muted)' }}>ID: {cat.id}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
