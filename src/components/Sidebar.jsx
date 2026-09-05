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
  Activity
} from 'lucide-react';
import { getCurrentUser } from '../services/storageService';

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const currentUser = getCurrentUser();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
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
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
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
      backgroundColor: 'var(--navy-sidebar)',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.2s ease',
      zIndex: 100,
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{
        height: 'var(--topbar-height)',
        padding: collapsed ? '0 16px' : '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid #1E293B'
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '16px'
            }}>
              A
            </div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '15px', letterSpacing: '0.05em' }}>
                AVYOMA
              </div>
              <div style={{ color: '#64748B', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                PRECISION CRM
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '16px'
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
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
                color: '#475569',
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
                    gap: '12px',
                    padding: collapsed ? '10px 0' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                    color: isActive ? '#60A5FA' : '#94A3B8',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--navy-hover)';
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
                  <Icon size={18} style={{ color: isActive ? '#3B82F6' : undefined }} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#050A14'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '13px'
        }}>
          {currentUser.avatar}
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#F8FAFC', fontSize: '13px', fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {currentUser.name}
            </div>
            <div style={{ color: '#64748B', fontSize: '11px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {currentUser.role}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
