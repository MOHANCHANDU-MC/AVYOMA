import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { CreditCard, CheckCircle, Upload, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export const BankingView = ({ bankAccounts, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState('accounts');
  const [statementTxns, setStatementTxns] = useState([
    { id: 'bt-1', date: '2026-09-01', description: 'NEFT CR-HAL ADVANCE PAY', amount: 20000000.00, type: 'DEPOSIT', matched: true, matchedRecord: 'INV-2026-00001 (HAL)' },
    { id: 'bt-2', date: '2026-09-02', description: 'RTGS DR-MIDHANI TITANIUM BILLET', amount: -5000000.00, type: 'WITHDRAWAL', matched: true, matchedRecord: 'BILL-MID-2026-88' },
    { id: 'bt-3', date: '2026-09-04', description: 'NEFT DR-TUV SUD TESTING', amount: -450000.00, type: 'WITHDRAWAL', matched: false, matchedRecord: 'Unmatched Bank Charge' }
  ]);

  const handleMatchTxn = (id) => {
    setStatementTxns(prev => prev.map(t => t.id === id ? { ...t, matched: true, matchedRecord: 'Manually Reconciled' } : t));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Banking & Bank Reconciliation</h2>
          <div className="page-subtitle">Manage commercial operating accounts, escrow contracts, and statement reconciliation</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => setActiveSubTab('reconciliation')}>
            <RefreshCw size={16} /> Reconciliation Tool
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          className={`btn btn-sm ${activeSubTab === 'accounts' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveSubTab('accounts')}
        >
          Bank Accounts ({bankAccounts.length})
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'reconciliation' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveSubTab('reconciliation')}
        >
          Statement Reconciliation
        </button>
      </div>

      {/* View 1: Bank Accounts Cards */}
      {activeSubTab === 'accounts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {bankAccounts.map(acc => (
            <div key={acc.id} className="prec-card prec-card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)' }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>{acc.accountName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{acc.bankName} • {acc.accountNumber}</div>
                  </div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>CURRENT LIQUID BALANCE</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-blue)', margin: '4px 0' }} className="num-tabular">
                  {formatFinanceCurrency(acc.currentBalance, acc.currency)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IFSC/SWIFT: {acc.ifscOrSwift}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Bank Statement Reconciliation */}
      {activeSubTab === 'reconciliation' && (
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Bank Statement Auto-Matching Engine</div>
              <div className="card-subtitle">Match imported bank feeds against general ledger journal entries</div>
            </div>
            <button className="btn btn-secondary btn-sm">
              <Upload size={14} /> Import Statement (CSV/OFX)
            </button>
          </div>

          <table className="prec-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bank Description</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                <th>Reconciliation Match Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {statementTxns.map(t => (
                <tr key={t.id}>
                  <td>{formatFinanceDate(t.date)}</td>
                  <td style={{ fontWeight: 600 }}>{t.description}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: t.amount > 0 ? 'var(--status-green-text)' : 'var(--text-dark)' }} className="num-tabular">
                    {formatFinanceCurrency(t.amount)}
                  </td>
                  <td>
                    {t.matched ? (
                      <span className="badge badge-green">
                        <CheckCircle size={12} /> Matched: {t.matchedRecord}
                      </span>
                    ) : (
                      <span className="badge badge-amber">Unmatched Entry</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {!t.matched && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleMatchTxn(t.id)}>
                        Match Entry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
