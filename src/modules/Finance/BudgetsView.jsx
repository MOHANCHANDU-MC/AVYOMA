import React, { useState } from 'react';
import { formatFinanceCurrency } from '../../utils/financeFormatters';
import { Plus, BarChart2, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export const BudgetsView = ({ budgets, costCenters }) => {
  const [activeTab, setActiveTab] = useState('budgets');

  const projectProfitabilityData = [
    { project: 'UAV Composite Canopy (HAL)', revenue: 64805600, expenses: 38500000, margin: '40.6%' },
    { project: 'Naval Radar Synthesizer (BEL)', revenue: 124000000, expenses: 72000000, margin: '41.9%' },
    { project: 'Submarine Valve Machining (L&T)', revenue: 38000000, expenses: 22000000, margin: '42.1%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Budgets, Cost Centers & Project Finance</h2>
          <div className="page-subtitle">Track department budgets vs actual spend, cost center allocations, and project profitability</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button className={`btn btn-sm ${activeTab === 'budgets' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('budgets')}>
          Budget vs Actual Variance
        </button>
        <button className={`btn btn-sm ${activeTab === 'costCenters' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('costCenters')}>
          Cost Centers ({costCenters.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'projectFinance' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('projectFinance')}>
          Project Profitability Analytics
        </button>
      </div>

      {/* View 1: Budget vs Actual */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {budgets.map(b => {
            const variance = Number(b.totalBudget) - Number(b.actualAmount);
            const pctUsed = Math.min(100, Math.round((Number(b.actualAmount) / Number(b.totalBudget)) * 100));

            return (
              <div key={b.id} className="prec-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>{b.budgetName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.department} • Fiscal Year: {b.fiscalYear}</div>
                  </div>
                  <span className="badge badge-blue">{pctUsed}% Utilized</span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', backgroundColor: '#F1F5F9', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${pctUsed}%`, backgroundColor: pctUsed > 90 ? 'var(--status-red)' : 'var(--primary-blue)', height: '100%' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ALLOCATED BUDGET</div>
                    <div style={{ fontWeight: 700 }} className="num-tabular">{formatFinanceCurrency(b.totalBudget)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ACTUAL SPEND</div>
                    <div style={{ fontWeight: 700 }} className="num-tabular">{formatFinanceCurrency(b.actualAmount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>VARIANCE SURPLUS</div>
                    <div style={{ fontWeight: 700, color: variance >= 0 ? 'var(--status-green-text)' : 'var(--status-red-text)' }} className="num-tabular">{formatFinanceCurrency(variance)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Cost Centers */}
      {activeTab === 'costCenters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {costCenters.map(cc => (
            <div key={cc.id} className="prec-card">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-blue)', fontFamily: 'var(--font-mono)' }}>{cc.code}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '4px' }}>{cc.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{cc.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Project Profitability */}
      {activeTab === 'projectFinance' && (
        <div className="prec-card">
          <div className="card-header">
            <div className="card-title">Defence Project Profitability Matrix</div>
          </div>
          <table className="prec-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th style={{ textAlign: 'right' }}>Revenue (₹)</th>
                <th style={{ textAlign: 'right' }}>Total Costs (₹)</th>
                <th style={{ textAlign: 'right' }}>Net Profit (₹)</th>
                <th style={{ textAlign: 'center' }}>Margin %</th>
              </tr>
            </thead>
            <tbody>
              {projectProfitabilityData.map(p => (
                <tr key={p.project}>
                  <td style={{ fontWeight: 600 }}>{p.project}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(p.revenue, 'INR', true)}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{formatFinanceCurrency(p.expenses, 'INR', true)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-green-text)' }} className="num-tabular">{formatFinanceCurrency(p.revenue - p.expenses, 'INR', true)}</td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge-green">{p.margin}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
