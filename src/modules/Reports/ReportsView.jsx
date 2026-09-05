import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { BarChart2, TrendingUp, Award, DollarSign, Users, PieChart as PieIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ReportsView = ({ opportunities, leads }) => {
  const [dateFilter, setDateFilter] = useState('THIS_YEAR');

  const ownerPerformanceData = [
    { name: 'Kavya R.', won: 1.14, pipeline: 2.10, conversion: '34%' },
    { name: 'Rajesh Sharma', won: 0.95, pipeline: 1.85, conversion: '29%' },
    { name: 'Vikram V.', won: 0.42, pipeline: 0.87, conversion: '25%' },
    { name: 'Ananya Nair', won: 1.14, pipeline: 0.00, conversion: '40%' }
  ];

  const stageDistribution = [
    { stage: 'New', count: 4, value: 1.5 },
    { stage: 'Qualification', count: 6, value: 2.1 },
    { stage: 'Discovery', count: 5, value: 4.2 },
    { stage: 'Tech Eval', count: 7, value: 3.8 },
    { stage: 'Proposal', count: 5, value: 6.5 },
    { stage: 'Negotiation', count: 3, value: 12.4 },
    { stage: 'Contract', count: 2, value: 2.1 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Executive Reports & Analytics</h2>
          <div className="page-subtitle">Data-driven performance metrics across sales teams, pipeline conversion, and sector breakdown</div>
        </div>
        <div className="page-actions">
          <select className="select-field" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: '160px' }}>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_QUARTER">This Quarter</option>
            <option value="THIS_YEAR">This Year (FY2026)</option>
          </select>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="prec-card">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue Won</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-green-text)', margin: '4px 0' }} className="num-tabular">₹1.14 Cr</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>FY2026 Target: ₹5.00 Cr</div>
        </div>

        <div className="prec-card">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Deal Win Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-blue)', margin: '4px 0' }} className="num-tabular">30.6%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Benchmarked for Defence SaaS</div>
        </div>

        <div className="prec-card">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Average Deal Size</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }} className="num-tabular">₹48.2 L</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Based on open opportunities</div>
        </div>

        <div className="prec-card">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Sales Velocity</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-purple-text)', margin: '4px 0' }} className="num-tabular">42 Days</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Average lead to contract cycle</div>
        </div>
      </div>

      {/* Owner Leaderboard Bar Chart */}
      <div className="prec-card">
        <div className="card-header">
          <div className="card-title">Sales Performance by Account Executive (in ₹ Cr)</div>
        </div>
        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ownerPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip formatter={(v) => [`₹${v} Cr`, 'Value']} />
              <Bar dataKey="pipeline" fill="#2563EB" name="Active Pipeline" radius={[4, 4, 0, 0]} />
              <Bar dataKey="won" fill="#10B981" name="Revenue Won" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stage Distribution Table */}
      <div className="prec-card">
        <div className="card-header">
          <div className="card-title">Pipeline Breakdown by Stage</div>
        </div>
        <table className="prec-table">
          <thead>
            <tr>
              <th>Sales Stage</th>
              <th style={{ textAlign: 'center' }}>Active Deals</th>
              <th style={{ textAlign: 'right' }}>Stage Value (₹ Cr)</th>
            </tr>
          </thead>
          <tbody>
            {stageDistribution.map(st => (
              <tr key={st.stage}>
                <td style={{ fontWeight: 600 }}>{st.stage}</td>
                <td style={{ textAlign: 'center' }}>{st.count}</td>
                <td style={{ textAlign: 'right' }} className="num-tabular">₹{st.value.toFixed(2)} Cr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
