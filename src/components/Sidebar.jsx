import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Kanban,
  CalendarCheck,
  CheckSquare,
  FileText,
  Package,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  DollarSign,
  Receipt,
  CreditCard,
  PieChart,
  RefreshCw,
  FolderTree,
  FileSpreadsheet,
  BookOpen,
  LogOut
} from 'lucide-react';
import { getCurrentUser } from '../services/storageService';

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout }) => {
  const currentUser = getCurrentUser();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive CRM', icon: LayoutDashboard },
        { id: 'finance-dashboard', label: 'Finance Overview', icon: DollarSign }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTING',
      items: [
        { id: 'finance-accounts', label: 'Chart of Accounts', icon: FolderTree },
        { id: 'finance-journals', label: 'General Ledger Vouchers', icon: BookOpen },
        { id: 'finance-invoices', label: 'Invoices & Receivables', icon: Receipt },
        { id: 'finance-bills', label: 'Bills & Payables', icon: FileText },
        { id: 'finance-expenses', label: 'Expenses & Approvals', icon: CreditCard },
        { id: 'finance-income', label: 'Direct Income', icon: TrendingUp },
        { id: 'finance-banking', label: 'Banking & Reconciliation', icon: RefreshCw },
        { id: 'finance-budgets', label: 'Budgets & Cost Centers', icon: PieChart },
        { id: 'finance-taxes', label: 'Taxes & Financial Years', icon: Shield },
        { id: 'finance-reports', label: 'Financial Statements', icon: BarChart3 },
        { id: 'finance-import', label: 'Data Import Center', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'SALES',
      items: [
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'accounts', label: 'Accounts', icon: Building2 },
        { id: 'contacts', label: 'Contacts', icon: UserCheck },
        { id: 'opportunities', label: 'Opportunities', icon: TrendingUp },
        { id: 'pipeline', label: 'Pipeline Kanban', icon: Kanban }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'activities', label: 'Activities', icon: CalendarCheck },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'proposals', label: 'Proposals / Quotes', icon: FileText },
        { id: 'products', label: 'Products & Catalogue', icon: Package }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'reports', label: 'Sales Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'documents', label: 'Documents Repository', icon: FolderOpen },
        { id: 'audit', label: 'Audit Logs', icon: Activity },
        { id: 'settings', label: 'Settings & RBAC', icon: Settings }
      ]
    }
  ];

  return (
    <aside style={{
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      background: 'var(--glass-sidebar-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--glass-sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100,
      userSelect: 'none',
      boxShadow: '4px 0 24px rgba(8, 15, 28, 0.15)'
    }}>
      {/* Brand Header */}
      <div style={{
        height: 'var(--topbar-height)',
        padding: collapsed ? '0 16px' : '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--glass-sidebar-border)'
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '17px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}>
              A
            </div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '15px', letterSpacing: '0.04em' }}>
                AVYOMA
              </div>
              <div style={{ color: '#64748B', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                ENTERPRISE ERP
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '17px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}>
            A
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#F8FAFC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
        {navSections.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            {!collapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#64748B',
                padding: '4px 12px 8px 12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: collapsed ? '10px 0' : '9px 12px',
                    borderRadius: collapsed ? 'var(--radius-md)' : '0 var(--radius-md) var(--radius-md) 0',
                    border: 'none',
                    borderLeft: !collapsed && isActive ? '3px solid var(--primary-blue)' : '3px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.06) 100%)'
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease',
                    marginBottom: '2px',
                    textAlign: 'left',
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#F8FAFC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? 'var(--primary-blue)' : '#64748B',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(37, 99, 235, 0.5))' : 'none'
                    }}
                  />
                  {!collapsed && (
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Context Footer */}
      <div style={{
        padding: collapsed ? '12px 8px' : '12px 16px',
        borderTop: '1px solid var(--glass-sidebar-border)',
        background: 'rgba(8, 15, 28, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #162032 0%, #0B1220 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}>
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'EA'}
            </div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-green)',
              position: 'absolute',
              bottom: '0',
              right: '0',
              border: '2px solid #080F1C',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)'
            }} />
          </div>

          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.name || 'Enterprise Admin'}
              </div>
              <div style={{
                color: '#64748B',
                fontSize: '10px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.role || 'Administrator'}
              </div>
            </div>
          )}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};

