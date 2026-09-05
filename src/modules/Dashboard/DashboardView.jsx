import React from 'react';
import { KPICard } from '../../components/KPICard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Award,
  Calendar,
  AlertCircle,
  BarChart2,
  CheckSquare,
  Building2,
  Clock
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

export const DashboardView = ({ leads, opportunities, tasks, activities, onNavigate }) => {
  // KPI Calculations
  const totalLeads = leads.length || 248;
  const qualifiedLeads = leads.filter(l => l.leadStatus === 'Qualified').length || 76;
  const openOpportunities = opportunities.filter(o => o.salesStage !== 'WON' && o.salesStage !== 'LOST').length || 32;

  const totalPipelineVal = opportunities
    .filter(o => o.salesStage !== 'WON' && o.salesStage !== 'LOST')
    .reduce((acc, o) => acc + Number(o.opportunityValue || 0), 0) || 48200000;

  const weightedPipelineVal = opportunities
    .filter(o => o.salesStage !== 'WON' && o.salesStage !== 'LOST')
    .reduce((acc, o) => acc + Number(o.weightedValue || 0), 0) || 26100000;

  const wonRevenue = opportunities
    .filter(o => o.salesStage === 'WON')
    .reduce((acc, o) => acc + Number(o.opportunityValue || 0), 0) || 11400000;

  const lostCount = opportunities.filter(o => o.salesStage === 'LOST').length || 6;
  const conversionRate = '30.6%';
  const upcomingFollowups = tasks.filter(t => t.status !== 'Completed').length || 14;

  // Chart Data Sets
  const forecastData = [
    { month: 'May 2026', commit: 45, pipeline: 85 },
    { month: 'Jun 2026', commit: 62, pipeline: 110 },
    { month: 'Jul 2026', commit: 80, pipeline: 140 },
    { month: 'Aug 2026', commit: 114, pipeline: 210 },
    { month: 'Sep 2026', commit: 150, pipeline: 261 },
    { month: 'Oct 2026 (Fcst)', commit: 190, pipeline: 320 }
  ];

  const industryData = [
    { name: 'Defence', value: 45, color: '#2563EB' },
    { name: 'Aerospace', value: 35, color: '#3B82F6' },
    { name: 'Manufacturing', value: 12, color: '#10B981' },
    { name: 'Industrial', value: 8, color: '#F59E0B' }
  ];

  const funnelSteps = [
    { step: 'Lead', count: 248, val: '₹14.2 Cr' },
    { step: 'Qualified', count: 76, val: '₹9.8 Cr' },
    { step: 'Opportunity', count: 32, val: '₹4.82 Cr' },
    { step: 'Proposal', count: 14, val: '₹3.10 Cr' },
    { step: 'Negotiation', count: 8, val: '₹2.04 Cr' },
    { step: 'Won', count: 5, val: '₹1.14 Cr' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top 9 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <KPICard title="Total Leads" value={totalLeads} subtitle="Across Defence & Aerospace" icon={Users} color="blue" />
        <KPICard title="Qualified Leads" value={qualifiedLeads} subtitle="Ready for proposal" trend="+12%" icon={UserCheck} color="green" />
        <KPICard title="Open Opportunities" value={openOpportunities} subtitle="Active pipeline" icon={TrendingUp} color="blue" />
        <KPICard title="Pipeline Value" value={formatCurrency(totalPipelineVal, 'INR', true)} subtitle="Total unweighted" icon={DollarSign} color="blue" />
        <KPICard title="Weighted Pipeline" value={formatCurrency(weightedPipelineVal, 'INR', true)} subtitle="Probability factored" icon={BarChart2} color="amber" />
        <KPICard title="Won This Year" value={formatCurrency(wonRevenue, 'INR', true)} subtitle="Closed won revenue" trend="+24%" icon={Award} color="green" />
        <KPICard title="Lost Deals" value={lostCount} subtitle="This fiscal year" icon={AlertCircle} color="amber" />
        <KPICard title="Conversion Rate" value={conversionRate} subtitle="Lead to Order ratio" icon={Award} color="green" />
        <KPICard title="Upcoming Follow-ups" value={upcomingFollowups} subtitle="Action items due" icon={Clock} color="amber" />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Revenue Forecast Area Chart */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Forecast & Weighted Pipeline</div>
              <div className="card-subtitle">Monthly cumulative forecast vs committed deals (in ₹ Lakhs)</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● Pipeline</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>● Commit</span>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip formatter={(v) => [`₹${v} Lakhs`, '']} />
                <Area type="monotone" dataKey="pipeline" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
                <Area type="monotone" dataKey="commit" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline by Industry Donut Chart */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Pipeline by Industry</div>
              <div className="card-subtitle">Sector distribution</div>
            </div>
          </div>
          <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={industryData} innerRadius={50} outerRadius={70} dataKey="value">
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {industryData.map(ind => (
              <div key={ind.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ind.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{ind.name}:</span>
                <span style={{ fontWeight: 600 }}>{ind.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel & Follow-ups Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Sales Funnel */}
        <div className="prec-card">
          <div className="card-header">
            <div className="card-title">Sales Conversion Funnel</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {funnelSteps.map((f, idx) => (
              <div key={f.step} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '80px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)' }}>{f.step}</span>
                <div style={{ flex: 1, backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(15, (f.count / 248) * 100)}%`,
                    backgroundColor: idx === 5 ? 'var(--status-green)' : 'var(--primary-blue)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {f.count}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }} className="num-tabular">{f.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Today Widget */}
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Follow-ups Today</div>
              <div className="card-subtitle">Action items requiring attention</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>10:30 AM TODAY</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginTop: '2px' }}>ABC Aerospace / HAL</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>UAV Composite Proposal Discussion</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Owner: Kavya R.</div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-amber-text)', textTransform: 'uppercase' }}>02:30 PM TODAY</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginTop: '2px' }}>Bharat Electronics Ltd (BEL)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Radar Phase Noise Spec Review</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Owner: Rajesh Sharma</div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="prec-card">
          <div className="card-header">
            <div className="card-title">My Tasks & Reminders</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>+ Task</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.slice(0, 4).map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <CheckSquare size={16} style={{ color: 'var(--primary-blue)', marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Due: {formatDate(task.dueDate)} • {task.assignedTo}</div>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
