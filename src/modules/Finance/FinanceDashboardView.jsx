import React, { useState } from 'react';
import { KPICard } from '../../components/KPICard';
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/financeFormatters';
import { StatusBadge } from '../../components/StatusBadge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  AlertCircle,
  BarChart3,
  PieChart as PieIcon,
  CreditCard,
  Receipt,
  CheckSquare,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const FinanceDashboardView = ({ invoices, bills, expenses, bankAccounts, journals, onNavigate }) => {
  const [dateFilter, setDateFilter] = useState('THIS_FY');

  // Executive Metric Calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0) + 42000000;
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0) + 68000000 + 45000000;
  const netProfit = totalRevenue - totalExpenses;

  const cashBalance = bankAccounts.reduce((sum, b) => sum + Number(b.currentBalance || 0), 0);
  const accountsReceivable = invoices.reduce((sum, inv) => sum + Number(inv.outstandingAmount || 0), 0);
  const accountsPayable = bills.reduce((sum, bill) => sum + Number(bill.outstandingAmount || 0), 0);

  const overdueInvoicesCount = invoices.filter(inv => inv.status === 'OVERDUE').length;
  const outstandingBillsCount = bills.filter(bill => bill.outstandingAmount > 0).length;

  const taxLiabilities = 5850000 + 5850000 + 11200000; // CGST + SGST + IGST Output

  // Chart Data Sets
  const cashFlowTrendData = [
    { month: 'Apr 2026', inflows: 42.5, outflows: 28.0, netCash: 14.5 },
    { month: 'May 2026', inflows: 65.0, outflows: 45.2, netCash: 19.8 },
    { month: 'Jun 2026', inflows: 88.0, outflows: 52.0, netCash: 36.0 },
    { month: 'Jul 2026', inflows: 112.5, outflows: 78.4, netCash: 34.1 },
    { month: 'Aug 2026', inflows: 145.0, outflows: 95.0, netCash: 50.0 },
    { month: 'Sep 2026', inflows: 185.0, outflows: 113.0, netCash: 72.0 }
  ];

  const categoryExpensesData = [
    { name: 'Procurement & Billets', value: 45, color: '#2563EB' },
    { name: 'Personnel Salaries', value: 30, color: '#10B981' },
    { name: 'Plant Lease & Utilities', value: 15, color: '#F59E0B' },
    { name: 'Testing & Compliance', value: 10, color: '#8B5CF6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Date Range Filter Bar */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Executive Finance Overview</h2>
          <div className="page-subtitle">Real-time multi-tenant financial health, cashflow velocity, and general ledger status</div>
        </div>
        <div className="page-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              className="select-field"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="THIS_QUARTER">This Quarter</option>
              <option value="THIS_FY">This FY (2026-2027)</option>
              <option value="PREV_FY">Previous FY (2025-2026)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 8 Executive KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <KPICard title="Total Revenue" value={formatFinanceCurrency(totalRevenue, 'INR', true)} subtitle="Billed sales & R&D revenue" trend="+18.4%" icon={TrendingUp} color="green" />
        <KPICard title="Total Expenses" value={formatFinanceCurrency(totalExpenses, 'INR', true)} subtitle="Procurement & overheads" trend="-4.2%" icon={TrendingDown} color="amber" />
        <KPICard title="Net Operating Profit" value={formatFinanceCurrency(netProfit, 'INR', true)} subtitle="EBITDA margin 50.2%" trend="+22.1%" icon={DollarSign} color="green" />
        <KPICard title="Liquid Cash Balance" value={formatFinanceCurrency(cashBalance, 'INR', true)} subtitle="SBI & HDFC Commercial" icon={CreditCard} color="blue" />
        <KPICard title="Accounts Receivable (AR)" value={formatFinanceCurrency(accountsReceivable, 'INR', true)} subtitle="Outstanding customer invoices" icon={Receipt} color="blue" />
        <KPICard title="Accounts Payable (AP)" value={formatFinanceCurrency(accountsPayable, 'INR', true)} subtitle="Pending vendor bills" icon={Receipt} color="amber" />
        <KPICard title="Tax Liabilities (GST)" value={formatFinanceCurrency(taxLiabilities, 'INR', true)} subtitle="Output GST Output Tax" icon={ShieldAlert} color="amber" />
        <KPICard title="Overdue Invoices" value={overdueInvoicesCount} subtitle="Requires AR follow-up" icon={AlertCircle} color="amber" />
      </div>

      {/* Main Financial Trend Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Cashflow & Net Liquidity Area Chart */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Cash Flow & Liquidity Velocity</div>
              <div className="card-subtitle">Monthly Inflows vs Outflows (in ₹ Lakhs)</div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <span style={{ color: '#10B981', fontWeight: 600 }}>● Inflows</span>
              <span style={{ color: '#EF4444', fontWeight: 600 }}>● Outflows</span>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● Net Surplus</span>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip formatter={(v) => [`₹${v} Lakhs`, '']} />
                <Area type="monotone" dataKey="inflows" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
                <Area type="monotone" dataKey="outflows" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
                <Area type="monotone" dataKey="netCash" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Expense Distribution</div>
              <div className="card-subtitle">By Cost Category</div>
            </div>
          </div>
          <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryExpensesData} innerRadius={50} outerRadius={70} dataKey="value">
                  {categoryExpensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {categoryExpensesData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{c.name.split(' ')[0]}:</span>
                <span style={{ fontWeight: 600 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AR / AP Quick Summary & Recent Posted Journal Vouchers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Outstanding Receivables */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Accounts Receivable (Invoices)</div>
              <div className="card-subtitle">Customer outstanding balances</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('invoices')}>View Invoices</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {invoices.map(inv => (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{inv.customerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{inv.invoiceNumber} • Due: {formatFinanceDate(inv.dueDate)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-blue)' }} className="num-tabular">{formatFinanceCurrency(inv.outstandingAmount, inv.currency, true)}</div>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Payables */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Accounts Payable (Vendor Bills)</div>
              <div className="card-subtitle">Pending supplier disbursements</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('bills')}>View Bills</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bills.map(bill => (
              <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{bill.vendorName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{bill.billNumber} • Due: {formatFinanceDate(bill.dueDate)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-amber-text)' }} className="num-tabular">{formatFinanceCurrency(bill.outstandingAmount, bill.currency, true)}</div>
                  <StatusBadge status={bill.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
