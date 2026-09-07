import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/financeFormatters';
import { Plus, DollarSign } from 'lucide-react';

export const IncomeView = () => {
  const [incomeList, setIncomeList] = useState([
    { id: 'inc-01', source: 'Technology Development Fund (TDF) Grant', category: 'Government Grant', amount: 15000000.00, date: '2026-08-15', paymentMethod: 'Direct Bank Transfer', description: 'Defence R&D grant disbursement for tactical drone avionics' },
    { id: 'inc-02', source: 'Scrap Metal & Titanium Recycling', category: 'Other Income', amount: 850000.00, date: '2026-09-01', paymentMethod: 'Cheque', description: 'Sale of titanium 5-axis machining swarf and turnings' }
  ]);

  const columns = [
    { header: 'ID', field: 'id', width: '90px', render: (val) => <span className="font-mono">{val}</span> },
    { header: 'Income Source', field: 'source', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Category', field: 'category', render: (val) => <span className="badge badge-green">{val}</span> },
    { header: 'Date', field: 'date', render: (val) => formatFinanceDate(val) },
    { header: 'Payment Method', field: 'paymentMethod' },
    { header: 'Amount', field: 'amount', render: (val) => <span className="num-tabular" style={{ fontWeight: 700, color: 'var(--status-green-text)' }}>{formatFinanceCurrency(val)}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Direct Income Management ({incomeList.length})</h2>
          <div className="page-subtitle">Record government R&D grants, scrap recycling revenue, and non-invoice income</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Plus size={16} /> Record Income
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={incomeList}
        searchPlaceholder="Search income records by source, category..."
      />
    </div>
  );
};
