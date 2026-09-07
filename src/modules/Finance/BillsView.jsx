import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, Receipt, Building2 } from 'lucide-react';
import { addFinanceBill } from '../../services/financeStorageService';

export const BillsView = ({ bills, vendors, onRefresh }) => {
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [newBillForm, setNewBillForm] = useState({
    vendorId: vendors[0]?.id || 'vend-201',
    vendorName: vendors[0]?.name || 'Mishra Dhatu Nigam Ltd (MIDHANI)',
    billNumber: 'BILL-MID-2026-90',
    billDate: '2026-09-01',
    dueDate: '2026-10-01',
    grandTotal: 12500000.00
  });

  const columns = [
    { header: 'Bill #', field: 'billNumber', width: '150px', render: (val) => <span className="font-mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Vendor Name', field: 'vendorName', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Bill Date', field: 'billDate', render: (val) => formatFinanceDate(val) },
    { header: 'Due Date', field: 'dueDate', render: (val) => formatFinanceDate(val) },
    { header: 'Grand Total', field: 'grandTotal', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val, row.currency)}</span> },
    { header: 'Outstanding', field: 'outstandingAmount', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700, color: 'var(--status-amber-text)' }}>{formatFinanceCurrency(val, row.currency)}</span> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> }
  ];

  const handleCreateBill = (e) => {
    e.preventDefault();
    const v = vendors.find(v => v.id === newBillForm.vendorId);
    addFinanceBill({
      ...newBillForm,
      vendorName: v ? v.name : newBillForm.vendorName,
      subtotal: Number(newBillForm.grandTotal) / 1.18,
      taxTotal: Number(newBillForm.grandTotal) - (Number(newBillForm.grandTotal) / 1.18)
    });
    setIsBillModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Accounts Payable & Vendor Bills ({bills.length})</h2>
          <div className="page-subtitle">Track raw material procurement bills, vendor payment schedules, and AP aging</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsBillModalOpen(true)}>
            <Plus size={16} /> Log Vendor Bill
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bills}
        searchPlaceholder="Search bills by number, vendor..."
      />

      {isBillModalOpen && (
        <Modal
          isOpen={isBillModalOpen}
          onClose={() => setIsBillModalOpen(false)}
          title="Log Vendor Procurement Bill"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateBill}>
            <div className="form-group">
              <label className="form-label form-label-required">Vendor</label>
              <select className="select-field" value={newBillForm.vendorId} onChange={e => setNewBillForm({ ...newBillForm, vendorId: e.target.value })}>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.vendorCode})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Bill / Invoice # from Vendor</label>
              <input type="text" className="input-field" required value={newBillForm.billNumber} onChange={e => setNewBillForm({ ...newBillForm, billNumber: e.target.value })} placeholder="BILL-2026-XXXX" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Bill Date</label>
                <input type="date" className="input-field" value={newBillForm.billDate} onChange={e => setNewBillForm({ ...newBillForm, billDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="input-field" value={newBillForm.dueDate} onChange={e => setNewBillForm({ ...newBillForm, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bill Total Amount (₹)</label>
              <input type="number" className="input-field" value={newBillForm.grandTotal} onChange={e => setNewBillForm({ ...newBillForm, grandTotal: Number(e.target.value) })} />
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsBillModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Vendor Bill</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
