import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, ACCOUNT_TYPE_CONFIG } from '../../utils/financeFormatters';
import { Modal } from '../../components/Modal';
import { Plus, FolderTree, CheckCircle, Lock } from 'lucide-react';
import { addFinanceAccount } from '../../services/financeStorageService';

export const ChartOfAccountsView = ({ accounts, onRefresh }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newAccForm, setNewAccForm] = useState({
    accountCode: '', accountName: '', accountType: 'ASSET', category: 'CASH', description: ''
  });

  const filteredAccounts = accounts.filter(acc => {
    if (activeCategory === 'ALL') return true;
    return acc.accountType === activeCategory;
  });

  const columns = [
    { header: 'Account Code', field: 'accountCode', width: '130px', render: (val) => <span className="font-mono" style={{ fontWeight: 700 }}>{val}</span> },
    {
      header: 'Account Name', field: 'accountName', render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.isSystemAccount && <Lock size={12} style={{ color: 'var(--text-muted)' }} title="System Account" />}
          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span>
        </div>
      )
    },
    {
      header: 'Type', field: 'accountType', render: (val) => {
        const conf = ACCOUNT_TYPE_CONFIG[val] || { label: val, color: 'badge-gray' };
        return <span className={`badge ${conf.color}`}>{conf.label}</span>;
      }
    },
    { header: 'Category', field: 'category', render: (val) => <span className="badge badge-purple">{val}</span> },
    { header: 'Current Balance', field: 'currentBalance', render: (val) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val)}</span> },
    { header: 'Status', field: 'isActive', render: (val) => <span className={`badge ${val ? 'badge-green' : 'badge-gray'}`}>{val ? 'Active' : 'Inactive'}</span> }
  ];

  const handleCreateAccount = (e) => {
    e.preventDefault();
    addFinanceAccount(newAccForm);
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Chart of Accounts (COA) ({accounts.length})</h2>
          <div className="page-subtitle">Hierarchical general ledger account structure across Assets, Liabilities, Equity, Income, and Expenses</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Account
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {[
          { id: 'ALL', label: 'All Accounts' },
          { id: 'ASSET', label: 'Assets (1000s)' },
          { id: 'LIABILITY', label: 'Liabilities (2000s)' },
          { id: 'EQUITY', label: 'Equity (3000s)' },
          { id: 'INCOME', label: 'Income (4000s)' },
          { id: 'EXPENSE', label: 'Expenses (5000s)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`btn btn-sm ${activeCategory === tab.id ? 'btn-primary' : 'btn-ghost'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accounts Directory Table */}
      <DataTable
        columns={columns}
        data={filteredAccounts}
        searchPlaceholder="Search accounts by code, name, category..."
      />

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Chart of Accounts Entry"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateAccount}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Code</label>
                <input type="text" className="input-field" required value={newAccForm.accountCode} onChange={e => setNewAccForm({ ...newAccForm, accountCode: e.target.value })} placeholder="e.g. 5050" />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Account Name</label>
                <input type="text" className="input-field" required value={newAccForm.accountName} onChange={e => setNewAccForm({ ...newAccForm, accountName: e.target.value })} placeholder="e.g. Software & Subscriptions" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select className="select-field" value={newAccForm.accountType} onChange={e => setNewAccForm({ ...newAccForm, accountType: e.target.value })}>
                  <option value="ASSET">Asset (1000)</option>
                  <option value="LIABILITY">Liability (2000)</option>
                  <option value="EQUITY">Equity (3000)</option>
                  <option value="INCOME">Income (4000)</option>
                  <option value="EXPENSE">Expense (5000)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="select-field" value={newAccForm.category} onChange={e => setNewAccForm({ ...newAccForm, category: e.target.value })}>
                  <option value="CASH">Cash / Bank</option>
                  <option value="AR">Accounts Receivable</option>
                  <option value="AP">Accounts Payable</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="PROCUREMENT">Procurement</option>
                  <option value="SALARIES">Salaries</option>
                  <option value="SERVICES">Services & Testing</option>
                  <option value="RENT">Rent & Overhead</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="textarea-field" value={newAccForm.description} onChange={e => setNewAccForm({ ...newAccForm, description: e.target.value })} placeholder="Account usage notes..." />
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Account</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
