import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../../components/Modal';
import { Plus, Printer, FileText, CheckCircle, Calculator, Trash2 } from 'lucide-react';
import { addProposal, getProducts } from '../../services/storageService';

export const ProposalsView = ({ proposals, opportunities, products, onRefresh }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Proposal Builder State
  const [customer, setCustomer] = useState('Hindustan Aeronautics Ltd (HAL)');
  const [validUntil, setValidUntil] = useState('2026-10-25');
  const [paymentTerms, setPaymentTerms] = useState('30% Advance with PO, 60% upon FAT, 10% after delivery');
  const [items, setItems] = useState([
    { id: 1, name: 'Carbon Fiber Reinforced Canopy Tooling Mold', code: 'AERO-TL-09', qty: 2, unitPrice: 4500000, discount: 0, taxPercent: 18 }
  ]);

  // Recalculate Totals
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const discountTotal = items.reduce((acc, item) => acc + (item.qty * item.unitPrice * (item.discount / 100)), 0);
  const taxTotal = items.reduce((acc, item) => {
    const net = (item.qty * item.unitPrice) - (item.qty * item.unitPrice * (item.discount / 100));
    return acc + (net * (item.taxPercent / 100));
  }, 0);
  const grandTotal = subtotal - discountTotal + taxTotal;

  const columns = [
    { header: 'Proposal #', field: 'proposalNumber', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'Customer', field: 'customer', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'Proposal Date', field: 'proposalDate', render: (val) => formatDate(val) },
    { header: 'Valid Until', field: 'validUntil', render: (val) => formatDate(val) },
    { header: 'Grand Total', field: 'grandTotal', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{formatCurrency(val, row.currency)}</span> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> },
    {
      header: 'Actions', field: 'id', sortable: false, render: (_, row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { setSelectedProposal(row); setIsPrintModalOpen(true); }}
        >
          <Printer size={14} /> Print / View
        </button>
      )
    }
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: 'Low Noise C-Band Frequency Synthesizer Module', code: 'DEF-RAD-99', qty: 1, unitPrice: 1850000, discount: 0, taxPercent: 18 }
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSaveProposal = (e) => {
    e.preventDefault();
    addProposal({
      customer,
      validUntil,
      paymentTerms,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      currency: 'INR'
    });
    setIsBuilderOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Proposals & Commercial Quotations ({proposals.length})</h2>
          <div className="page-subtitle">Generate official B2B quotations with line items, tax calculations, and payment SLA terms</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsBuilderOpen(true)}>
            <Plus size={16} /> New Proposal
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={proposals}
        searchPlaceholder="Search proposals by number, customer..."
      />

      {/* Proposal Builder Modal */}
      {isBuilderOpen && (
        <Modal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          title="Create Commercial Quotation / Proposal"
          maxWidth="720px"
        >
          <form onSubmit={handleSaveProposal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Customer / Company</label>
                <input type="text" className="input-field" required value={customer} onChange={e => setCustomer(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Valid Until</label>
                <input type="date" className="input-field" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Quotation Line Items</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>+ Add Item</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, index) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '8px', alignItems: 'center', padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
                    <input
                      type="text" className="input-field" placeholder="Item Name"
                      value={item.name}
                      onChange={e => {
                        const newArr = [...items];
                        newArr[index].name = e.target.value;
                        setItems(newArr);
                      }}
                    />
                    <input
                      type="number" className="input-field" placeholder="Qty"
                      value={item.qty}
                      onChange={e => {
                        const newArr = [...items];
                        newArr[index].qty = Number(e.target.value);
                        setItems(newArr);
                      }}
                    />
                    <input
                      type="number" className="input-field" placeholder="Unit Price (₹)"
                      value={item.unitPrice}
                      onChange={e => {
                        const newArr = [...items];
                        newArr[index].unitPrice = Number(e.target.value);
                        setItems(newArr);
                      }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }} className="num-tabular">
                      {formatCurrency(item.qty * item.unitPrice)}
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 size={14} style={{ color: 'var(--status-red)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Summary Box */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }} className="num-tabular">{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>GST / Tax (18%):</span>
                <span style={{ fontWeight: 600 }} className="num-tabular">{formatCurrency(taxTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--primary-blue)', paddingTop: '8px', borderTop: '1px solid #BFDBFE' }}>
                <span>Grand Total:</span>
                <span className="num-tabular">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsBuilderOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Generate Proposal</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Print / View Proposal Modal */}
      {isPrintModalOpen && selectedProposal && (
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title={`Quotation: ${selectedProposal.proposalNumber}`}
          maxWidth="680px"
        >
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-blue)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-blue)' }}>AVYOMA SYSTEMS</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Precision Defence & Aerospace Engineering</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '15px' }} className="font-mono">{selectedProposal.proposalNumber}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Date: {formatDate(selectedProposal.proposalDate)}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>PREPARED FOR:</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-dark)' }}>{selectedProposal.customer}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Attn: {selectedProposal.contact || 'Procurement Officer'}</div>
            </div>

            {/* Line Items Table */}
            <table className="prec-table" style={{ marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(selectedProposal.items || []).map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }} className="num-tabular">{formatCurrency(item.unitPrice)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }} className="num-tabular">{formatCurrency(item.total || item.qty * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', fontSize: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary-blue)' }}>
                  Grand Total: {formatCurrency(selectedProposal.grandTotal)}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <strong>Payment Terms:</strong> {selectedProposal.paymentTerms || 'Standard 30 days.'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print Proposal
            </button>
            <button className="btn btn-primary" onClick={() => setIsPrintModalOpen(false)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
