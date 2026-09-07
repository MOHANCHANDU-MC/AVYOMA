import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate, calculateAgingBucket } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, Receipt, DollarSign, Calendar, Printer, CheckCircle } from 'lucide-react';
import { addFinanceInvoice, recordInvoicePayment } from '../../services/financeStorageService';

export const InvoicesView = ({ invoices, customers, bankAccounts, onRefresh }) => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');

  const [newInvForm, setNewInvForm] = useState({
    customerId: customers[0]?.id || 'cust-101',
    customerName: customers[0]?.name || 'Hindustan Aeronautics Ltd (HAL)',
    dueDate: '2026-10-30',
    notes: 'UAV Composite Canopy Project Invoice',
    subtotal: 10000000.00,
    taxTotal: 1800000.00
  });

  const columns = [
    { header: 'Invoice #', field: 'invoiceNumber', width: '140px', render: (val) => <span className="font-mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Customer', field: 'customerName', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Invoice Date', field: 'invoiceDate', render: (val) => formatFinanceDate(val) },
    { header: 'Due Date', field: 'dueDate', render: (val) => formatFinanceDate(val) },
    { header: 'Total Value', field: 'grandTotal', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val, row.currency)}</span> },
    { header: 'Outstanding', field: 'outstandingAmount', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{formatFinanceCurrency(val, row.currency)}</span> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> },
    {
      header: 'Actions', field: 'id', sortable: false, render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.outstandingAmount > 0 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setSelectedInvoice(row); setPaymentAmount(row.outstandingAmount); setIsPaymentModalOpen(true); }}
            >
              Record Payment
            </button>
          )}
        </div>
      )
    }
  ];

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === newInvForm.customerId);
    addFinanceInvoice({
      ...newInvForm,
      customerName: cust ? cust.name : newInvForm.customerName,
      invoiceDate: new Date().toISOString().substring(0, 10)
    });
    setIsInvoiceModalOpen(false);
    if (onRefresh) onRefresh();
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (selectedInvoice && paymentAmount) {
      recordInvoicePayment(selectedInvoice.id, Number(paymentAmount), bankAccountId);
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Accounts Receivable & Invoices ({invoices.length})</h2>
          <div className="page-subtitle">Generate customer invoices, track AR aging buckets, and log incoming payments</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsInvoiceModalOpen(true)}>
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices by number, customer, status..."
      />

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Receipt for ${selectedInvoice.invoiceNumber}`}
          maxWidth="480px"
        >
          <form onSubmit={handleRecordPayment}>
            <div className="form-group">
              <label className="form-label">Outstanding Amount</label>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-blue)' }} className="num-tabular">
                {formatFinanceCurrency(selectedInvoice.outstandingAmount)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Payment Amount Received (₹)</label>
              <input
                type="number" className="input-field" required
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deposit to Bank Account</label>
              <select className="select-field" value={bankAccountId} onChange={e => setBankAccountId(e.target.value)}>
                {bankAccounts.map(b => (
                  <option key={b.id} value={b.id}>{b.accountName} ({formatFinanceCurrency(b.currentBalance, b.currency, true)})</option>
                ))}
              </select>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Confirm Payment Log</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Invoice Modal */}
      {isInvoiceModalOpen && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title="Create New Customer Invoice"
          maxWidth="540px"
        >
          <form onSubmit={handleCreateInvoice}>
            <div className="form-group">
              <label className="form-label form-label-required">Customer</label>
              <select className="select-field" value={newInvForm.customerId} onChange={e => setNewInvForm({ ...newInvForm, customerId: e.target.value })}>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.customerCode})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="input-field" value={newInvForm.dueDate} onChange={e => setNewInvForm({ ...newInvForm, dueDate: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Subtotal (₹)</label>
                <input type="number" className="input-field" value={newInvForm.subtotal} onChange={e => setNewInvForm({ ...newInvForm, subtotal: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tax GST 18% (₹)</label>
                <input type="number" className="input-field" value={newInvForm.taxTotal} onChange={e => setNewInvForm({ ...newInvForm, taxTotal: Number(e.target.value) })} />
              </div>
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Generate Invoice</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
