import React from 'react';
import { Search, Bell, Plus, RefreshCw } from 'lucide-react';
import { resetDatabase } from '../services/storageService';

export const Topbar = ({
  activeTab,
  onOpenSearch,
  onOpenCreateModal,
  onToggleNotifications,
  unreadNotificationsCount
}) => {
  const titles = {
    // CRM Views
    dashboard: 'Executive CRM Dashboard',
    leads: 'Lead Management',
    accounts: 'Account Directory',
    contacts: 'Contact Directory',
    opportunities: 'Opportunity Tracker',
    pipeline: 'Sales Pipeline Kanban',
    activities: 'Activities & Communications',
    tasks: 'Task Management',
    proposals: 'Proposals & Quotations',
    products: 'Products & Services Catalogue',
    reports: 'Sales Reports & Analytics',
    documents: 'Document Repository',
    audit: 'System Audit Logs',
    settings: 'Settings & Security',

    // Finance Views
    'finance-dashboard': 'Executive Finance Overview',
    'finance-accounts': 'Chart of Accounts (COA)',
    'finance-journals': 'General Ledger Journal Vouchers',
    'finance-invoices': 'Invoices & Accounts Receivable (AR)',
    'finance-bills': 'Bills & Accounts Payable (AP)',
    'finance-expenses': 'Expense Tracking & Approvals',
    'finance-income': 'Direct Income Ledger',
    'finance-banking': 'Banking Operations & Reconciliation',
    'finance-budgets': 'Budgets & Cost Centers',
    'finance-taxes': 'Taxes & GST Management',
    'finance-reports': 'Financial Statements (P&L & BS)',
    'finance-import': 'Data Import Center'
  };

  const formattedTabName = activeTab.startsWith('finance-')
    ? activeTab.replace('finance-', 'Finance / ')
    : `CRM / ${activeTab}`;

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--glass-topbar-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-topbar-border)',
      padding: '0 var(--space-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 90,
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Breadcrumb & Title */}
      <div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
          marginBottom: '1px'
        }}>
          AVYOMA ENTERPRISE / {formattedTabName}
        </div>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-dark)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          {titles[activeTab] || 'Avyoma Enterprise'}
        </h1>
      </div>

      {/* Center Search Bar Trigger */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 var(--space-lg)' }}>
        <button
          onClick={onOpenSearch}
          className="input-field"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '7px 14px',
            background: 'rgba(248, 250, 252, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-blue-border)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.75)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.02)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Search leads, accounts, invoices...</span>
          </div>
          <kbd style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(226, 232, 240, 0.8)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em',
            border: '1px solid rgba(203, 213, 225, 0.6)'
          }}>
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Reset Seed Database */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => {
            if (window.confirm('Reset local CRM database to initial seed state?')) {
              resetDatabase();
              window.location.reload();
            }
          }}
          title="Reset database to seed data"
          style={{ color: 'var(--text-secondary)' }}
        >
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={onToggleNotifications}
          style={{ position: 'relative', color: 'var(--text-secondary)' }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-red)',
              boxShadow: '0 0 0 2px #FFFFFF, 0 0 6px rgba(239, 68, 68, 0.6)'
            }} />
          )}
        </button>

        {/* Global Persistent "+ Create" Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenCreateModal}
          style={{
            gap: '6px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          <Plus size={16} />
          <span>Create</span>
        </button>
      </div>
    </header>
  );
};
