import React, { useState } from 'react';
import { formatFinanceCurrency } from '../../utils/financeFormatters';
import { Printer, Download, BarChart3, FileSpreadsheet } from 'lucide-react';

export const FinancialReportsView = ({ accounts, invoices, bills, expenses }) => {
  const [activeReport, setActiveReport] = useState('P_L');

  // Profit & Loss Data Calculation
  const salesRevenue = accounts.filter(a => a.accountType === 'INCOME').reduce((s, a) => s + Number(a.currentBalance || 0), 0);
  const totalOperatingCosts = accounts.filter(a => a.accountType === 'EXPENSE').reduce((s, a) => s + Number(a.currentBalance || 0), 0);
  const netProfit = salesRevenue - totalOperatingCosts;

  // Balance Sheet Data Calculation
  const totalAssets = accounts.filter(a => a.accountType === 'ASSET').reduce((s, a) => s + Number(a.currentBalance || 0), 0);
  const totalLiabilities = accounts.filter(a => a.accountType === 'LIABILITY').reduce((s, a) => s + Number(a.currentBalance || 0), 0);
  const totalEquity = accounts.filter(a => a.accountType === 'EQUITY').reduce((s, a) => s + Number(a.currentBalance || 0), 0) + netProfit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Financial Statements & Audited Reports</h2>
          <div className="page-subtitle">Generate Profit & Loss, Balance Sheet, Trial Balance, and Cash Flow statements</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {[
          { id: 'P_L', label: 'Profit & Loss (P&L)' },
          { id: 'BALANCE_SHEET', label: 'Balance Sheet' },
          { id: 'TRIAL_BALANCE', label: 'Trial Balance' },
          { id: 'CASH_FLOW', label: 'Cash Flow Statement' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`btn btn-sm ${activeReport === tab.id ? 'btn-primary' : 'btn-ghost'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report View: P&L */}
      {activeReport === 'P_L' && (
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Profit & Loss Statement (Income Statement)</div>
              <div className="card-subtitle">For Fiscal Year 2026-2027 (in ₹ INR)</div>
            </div>
          </div>

          <table className="prec-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 700 }}>
                <td>REVENUE FROM OPERATIONS</td>
                <td></td>
              </tr>
              {accounts.filter(a => a.accountType === 'INCOME').map(a => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: '24px' }}>{a.accountCode} - {a.accountName}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(a.currentBalance)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, borderTop: '1px solid var(--border-color)' }}>
                <td style={{ paddingLeft: '24px', color: 'var(--primary-blue)' }}>TOTAL GROSS REVENUE (A)</td>
                <td style={{ textAlign: 'right', color: 'var(--primary-blue)' }} className="num-tabular">{formatFinanceCurrency(salesRevenue)}</td>
              </tr>

              <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 700 }}>
                <td style={{ paddingTop: '16px' }}>OPERATING EXPENSES</td>
                <td></td>
              </tr>
              {accounts.filter(a => a.accountType === 'EXPENSE').map(a => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: '24px' }}>{a.accountCode} - {a.accountName}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(a.currentBalance)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, borderTop: '1px solid var(--border-color)' }}>
                <td style={{ paddingLeft: '24px', color: 'var(--status-amber-text)' }}>TOTAL OPERATING EXPENSES (B)</td>
                <td style={{ textAlign: 'right', color: 'var(--status-amber-text)' }} className="num-tabular">{formatFinanceCurrency(totalOperatingCosts)}</td>
              </tr>

              <tr style={{ backgroundColor: '#ECFDF5', fontWeight: 800, fontSize: '15px' }}>
                <td style={{ color: 'var(--status-green-text)' }}>NET OPERATING PROFIT (EBITDA) (A - B)</td>
                <td style={{ textAlign: 'right', color: 'var(--status-green-text)' }} className="num-tabular">{formatFinanceCurrency(netProfit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Report View: Balance Sheet */}
      {activeReport === 'BALANCE_SHEET' && (
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Balance Sheet Statement</div>
              <div className="card-subtitle">As of 30 September 2026 (Assets = Liabilities + Equity)</div>
            </div>
          </div>

          <table className="prec-table">
            <thead>
              <tr>
                <th>Assets & Liabilities Particulars</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 700 }}>
                <td>ASSETS</td>
                <td></td>
              </tr>
              {accounts.filter(a => a.accountType === 'ASSET').map(a => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: '24px' }}>{a.accountCode} - {a.accountName}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(a.currentBalance)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>
                <td style={{ paddingLeft: '24px' }}>TOTAL ASSETS (A)</td>
                <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(totalAssets)}</td>
              </tr>

              <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 700 }}>
                <td style={{ paddingTop: '16px' }}>LIABILITIES & EQUITY</td>
                <td></td>
              </tr>
              {accounts.filter(a => a.accountType === 'LIABILITY').map(a => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: '24px' }}>{a.accountCode} - {a.accountName}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(a.currentBalance)}</td>
                </tr>
              ))}
              {accounts.filter(a => a.accountType === 'EQUITY').map(a => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: '24px' }}>{a.accountCode} - {a.accountName}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(a.currentBalance)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>
                <td style={{ paddingLeft: '24px' }}>TOTAL LIABILITIES & EQUITY (B)</td>
                <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(totalLiabilities + totalEquity)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
