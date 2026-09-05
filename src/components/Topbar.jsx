import React from 'react';
import { Search, Bell, Plus, RefreshCw, User, ShieldCheck } from 'lucide-react';
import { resetDatabase, getNotifications } from '../services/storageService';

export const Topbar = ({
  activeTab,
  onOpenSearch,
  onOpenCreateModal,
  onToggleNotifications,
  unreadNotificationsCount
}) => {
  const titles = {
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
    reports: 'Reports & Analytics',
    documents: 'Document Repository',
    audit: 'System Audit Logs',
    settings: 'Settings & Security'
  };

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 90
    }}>
      {/* Breadcrumb & Title */}
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Avyoma Systems / {activeTab}
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>
          {titles[activeTab] || 'Avyoma CRM'}
        </h1>
      </div>

      {/* Center Search Bar Trigger */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }}>
        <button
          onClick={onOpenSearch}
          className="input-field"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px 14px',
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} />
            <span style={{ fontSize: '13px' }}>Search leads, accounts, opportunities...</span>
          </div>
          <kbd style={{
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#E2E8F0',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}>
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Reset Seed Database (Dev mode) */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm('Reset local CRM database to initial seed state?')) {
              resetDatabase();
            }
          }}
          title="Reset database to seed data"
          style={{ color: 'var(--text-secondary)' }}
        >
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onToggleNotifications}
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-red)'
            }} />
          )}
        </button>

        {/* Global Persistent "+ Create" Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenCreateModal}
          style={{ gap: '6px' }}
        >
          <Plus size={16} />
          <span>Create</span>
        </button>
      </div>
    </header>
  );
};
