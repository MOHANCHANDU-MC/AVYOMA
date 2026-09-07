import React, { useState } from 'react';
import { formatDate } from '../../utils/financeFormatters';
import { Plus, Shield, Lock, CheckCircle2 } from 'lucide-react';

export const TaxesView = ({ taxes, periods }) => {
  const [activeTab, setActiveTab] = useState('taxes');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Tax Configuration & Financial Periods</h2>
          <div className="page-subtitle">Configure GST/VAT rates, HSN/SAC classification codes, and financial year posting locks</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button className={`btn btn-sm ${activeTab === 'taxes' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('taxes')}>
          Tax Rates & GST Codes ({taxes.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'periods' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('periods')}>
          Financial Years & Period Locks ({periods.length})
        </button>
      </div>

      {/* View 1: Tax Rates */}
      {activeTab === 'taxes' && (
        <div className="prec-card">
          <div className="card-header">
            <div className="card-title">Configurable Tax Master (GST / VAT)</div>
            <button className="btn btn-primary btn-sm">+ Add Tax Code</button>
          </div>

          <table className="prec-table">
            <thead>
              <tr>
                <th>Tax Code</th>
                <th>Tax Name</th>
                <th>Rate %</th>
                <th>Tax Type</th>
                <th>HSN / SAC Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map(t => (
                <tr key={t.id}>
                  <td className="font-mono" style={{ fontWeight: 700 }}>{t.taxCode}</td>
                  <td style={{ fontWeight: 600 }}>{t.taxName}</td>
                  <td className="num-tabular" style={{ fontWeight: 700 }}>{t.rate}%</td>
                  <td><span className="badge badge-purple">{t.taxType}</span></td>
                  <td className="font-mono">{t.hsnSacCode || 'N/A'}</td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Financial Periods */}
      {activeTab === 'periods' && (
        <div className="prec-card">
          <div className="card-header">
            <div className="card-title">Financial Period Status & Posting Locks</div>
          </div>

          <table className="prec-table">
            <thead>
              <tr>
                <th>Financial Year / Period</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Period Status</th>
                <th>Posting Controls</th>
              </tr>
            </thead>
            <tbody>
              {periods.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700 }}>{p.periodName}</td>
                  <td>{formatDate(p.startDate)}</td>
                  <td>{formatDate(p.endDate)}</td>
                  <td>
                    <span className={`badge ${p.status === 'OPEN' ? 'badge-green' : 'badge-amber'}`}>
                      {p.status === 'OPEN' ? 'Open for Postings' : 'Closed / Locked'}
                    </span>
                  </td>
                  <td>
                    {p.status === 'OPEN' ? (
                      <span style={{ fontSize: '12px', color: 'var(--status-green-text)' }}>● Postings Allowed</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--status-red-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Postings Blocked
                      </span>
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
