import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate, validateJournalBalance } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, BookOpen, CheckCircle, AlertTriangle, Trash2, ArrowRightLeft } from 'lucide-react';
import { addFinanceJournal } from '../../services/financeStorageService';

export const JournalEntriesView = ({ journals, accounts, onRefresh }) => {
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().substring(0, 10));
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');

  const [lines, setLines] = useState([
    { id: 1, accountId: 'acc-1020', debit: 5000000.00, credit: 0.00 },
    { id: 2, accountId: 'acc-1200', debit: 0.00, credit: 5000000.00 }
  ]);

  const validation = validateJournalBalance(lines);

  const columns = [
    { header: 'Journal #', field: 'journalNumber', width: '130px', render: (val) => <span className="font-mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Date', field: 'entryDate', render: (val) => formatFinanceDate(val) },
    { header: 'Description', field: 'description', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Reference', field: 'reference', render: (val) => <span className="font-mono" style={{ fontSize: '11px' }}>{val || '—'}</span> },
    { header: 'Total Debits', field: 'totalDebit', render: (val) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val)}</span> },
    { header: 'Total Credits', field: 'totalCredit', render: (val) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatFinanceCurrency(val)}</span> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> }
  ];

  const handleAddLine = () => {
    setLines([
      ...lines,
      { id: Date.now(), accountId: accounts[0]?.id || 'acc-1010', debit: 0.00, credit: 0.00 }
    ]);
  };

  const handleRemoveLine = (id) => {
    setLines(lines.filter(l => l.id !== id));
  };

  const handlePostJournal = (e) => {
    e.preventDefault();
    try {
      addFinanceJournal({
        entryDate,
        reference,
        description,
        lines: lines.map(l => {
          const acc = accounts.find(a => a.id === l.accountId);
          return {
            ...l,
            accountName: acc ? `${acc.accountCode} - ${acc.accountName}` : 'General Account'
          };
        })
      });
      setIsVoucherOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">General Ledger & Journal Entries ({journals.length})</h2>
          <div className="page-subtitle">Double-entry accounting journal vouchers with real-time debit and credit balance enforcement</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsVoucherOpen(true)}>
            <Plus size={16} /> New Journal Voucher
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={journals}
        searchPlaceholder="Search journal vouchers by number, reference, description..."
      />

      {/* Double-Entry Journal Builder Modal */}
      {isVoucherOpen && (
        <Modal
          isOpen={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
          title="Post Double-Entry Journal Voucher"
          maxWidth="760px"
        >
          <form onSubmit={handlePostJournal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Posting Date</label>
                <input type="date" className="input-field" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Reference #</label>
                <input type="text" className="input-field" value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. REF-HAL-01" />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Voucher Description</label>
                <input type="text" className="input-field" required value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Advance payment received for UAV project" />
              </div>
            </div>

            {/* Line Items Entry */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Debits & Credits Lines</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddLine}>+ Add Line</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lines.map((line, index) => (
                  <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.5fr 40px', gap: '8px', alignItems: 'center', padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
                    <select
                      className="select-field"
                      value={line.accountId}
                      onChange={e => {
                        const newLines = [...lines];
                        newLines[index].accountId = e.target.value;
                        setLines(newLines);
                      }}
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          [{acc.accountCode}] {acc.accountName} ({acc.accountType})
                        </option>
                      ))}
                    </select>

                    <div>
                      <input
                        type="number" className="input-field" placeholder="Debit (₹)"
                        value={line.debit}
                        onChange={e => {
                          const newLines = [...lines];
                          newLines[index].debit = Number(e.target.value);
                          if (Number(e.target.value) > 0) newLines[index].credit = 0;
                          setLines(newLines);
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="number" className="input-field" placeholder="Credit (₹)"
                        value={line.credit}
                        onChange={e => {
                          const newLines = [...lines];
                          newLines[index].credit = Number(e.target.value);
                          if (Number(e.target.value) > 0) newLines[index].debit = 0;
                          setLines(newLines);
                        }}
                      />
                    </div>

                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveLine(line.id)}>
                      <Trash2 size={14} style={{ color: 'var(--status-red)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Balance Status Bar */}
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: validation.isBalanced ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
              backgroundColor: validation.isBalanced ? '#ECFDF5' : '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {validation.isBalanced ? (
                  <CheckCircle size={18} style={{ color: 'var(--status-green)' }} />
                ) : (
                  <AlertTriangle size={18} style={{ color: 'var(--status-red)' }} />
                )}
                <span style={{ fontWeight: 600, fontSize: '13px', color: validation.isBalanced ? 'var(--status-green-text)' : 'var(--status-red-text)' }}>
                  {validation.isBalanced ? 'Journal Entry BALANCED' : `UNBALANCED ENTRY (Difference: ${formatFinanceCurrency(validation.difference)})`}
                </span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', gap: '16px' }} className="num-tabular">
                <span>Debits: <strong>{formatFinanceCurrency(validation.totalDebits)}</strong></span>
                <span>Credits: <strong>{formatFinanceCurrency(validation.totalCredits)}</strong></span>
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsVoucherOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!validation.isBalanced}>
                Post Journal Voucher
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
