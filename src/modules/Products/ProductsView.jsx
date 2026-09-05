import React from 'react';
import { DataTable } from '../../components/DataTable';
import { formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Package } from 'lucide-react';

export const ProductsView = ({ products }) => {
  const columns = [
    { header: 'SKU Code', field: 'sku', width: '130px', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'Product / Service Name', field: 'name', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Category', field: 'category', render: (val) => <span className="badge badge-purple">{val}</span> },
    { header: 'Unit', field: 'unit' },
    { header: 'Unit Price', field: 'price', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatCurrency(val, row.currency)}</span> },
    { header: 'Tax GST', field: 'tax', render: (val) => `${val}%` },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Products & Services Catalogue ({products.length})</h2>
          <div className="page-subtitle">Master database of aerospace alloys, defence modules, sensors, and MIL-SPEC testing services</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Plus size={16} /> New Product SKU
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products by SKU, name, category..."
      />
    </div>
  );
};
