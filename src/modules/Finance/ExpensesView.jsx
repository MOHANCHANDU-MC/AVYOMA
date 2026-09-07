import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { addFinanceExpense, updateExpenseStatus } from '../../services/financeStorageService';

export const ExpensesView = ({ expenses, onRefresh }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpForm, setNewExpForm] = useState({
    category: 'Procurement', amount: 350000.00, paymentMethod: 'Bank Transfer',
    vendorName: 'MTAR Technologies', department: 'R&D Engineering', costCenter: 'R&D Aerospace',
    description: 'Custom CNC tooling cutters for rocket motor nozzle machining'
  });

  const columns = [
    { header: 'Expense #', field: 'expenseNumber', width: '130px', render: (val) => <span className="font-mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Category', field: 'category', render: (val) => <span className="badge badge-purple">{val}</span> },
    {
      header: 'Description', field: 'description', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.vendorName || row.department} • Cost Center: {row.costCenter}</div>
        </div>
      )
    },
    { header: 'Date', field: 'expenseDate', render: (val) => formatFinanceDate(val) },
    { header: 'Amount', field: 'amount', render: (val) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val)}</span> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> },
    {
      header: 'Approval', field: 'id', sortable: false, render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {row.status === 'SUBMITTED' && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => { updateExpenseStatus(row.id, 'APPROVED'); if (onRefresh) onRefresh(); }}>Approve</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { updateExpenseStatus(row.id, 'REJECTED'); if (onRefresh) onRefresh(); }}>Reject</button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <button className="btn btn-primary btn-sm" onClick={() => { updateExpenseStatus(row.id, 'PAID'); if (onRefresh) onRefresh(); }}>Mark Paid</button>
          )}
        </div>
      )
    }
  ];

  const handleCreateExpense = (e) => {
    e.preventDefault();
    addFinanceExpense({
      ...newExpForm,
      amount: Number(newExpForm.amount)
    });
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Expense Management ({expenses.length})</h2>
          <div className="page-subtitle">Track operational expenses, department claims, receipt attachments, and approval status</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Submit Expense
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchPlaceholder="Search expenses by category, description, vendor..."
      />

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Submit Operational Expense Claim"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateExpense}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Expense Category</label>
                <select className="select-field" value={newExpForm.category} onChange={e => setNewExpForm({ ...newExpForm, category: e.target.value })}>
                  <option value="Procurement">Procurement</option>
                  <option value="Salaries">Salaries & Personnel</option>
                  <option value="Services">Testing & Services</option>
                  <option value="Rent">Rent & Utilities</option>
                  <option value="Travel">Travel & Site Audit</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Amount (₹)</label>
                <input type="number" className="input-field" required value={newExpForm.amount} onChange={e => setNewExpForm({ ...newExpForm, amount: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Expense Description</label>
              <input type="text" className="input-field" required value={newExpForm.description} onChange={e => setNewExpForm({ ...newExpForm, description: e.target.value })} placeholder="e.g. Ultrasonic NDT testing fees" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Vendor / Payee</label>
                <input type="text" className="input-field" value={newExpForm.vendorName} onChange={e => setNewExpForm({ ...newExpForm, vendorName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Cost Center</label>
                <select className="select-field" value={newExpForm.costCenter} onChange={e => setNewExpForm({ ...newExpForm, costCenter: e.target.value })}>
                  <option value="R&D Aerospace">R&D Aerospace</option>
                  <option value="Defence Weapons">Defence Weapons</option>
                  <option value="Precision Machining">Precision Machining</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Expense</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
