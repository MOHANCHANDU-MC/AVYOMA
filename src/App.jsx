import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { GlobalCreateModal } from './components/GlobalCreateModal';
import { NotificationDrawer } from './components/NotificationDrawer';

// Module Views
import { DashboardView } from './modules/Dashboard/DashboardView';
import { LeadsView } from './modules/Leads/LeadsView';
import { AccountsView } from './modules/Accounts/AccountsView';
import { ContactsView } from './modules/Contacts/ContactsView';
import { OpportunitiesView } from './modules/Opportunities/OpportunitiesView';
import { PipelineView } from './modules/Pipeline/PipelineView';
import { ActivitiesView } from './modules/Activities/ActivitiesView';
import { TasksView } from './modules/Tasks/TasksView';
import { ProposalsView } from './modules/Proposals/ProposalsView';
import { ProductsView } from './modules/Products/ProductsView';
import { ReportsView } from './modules/Reports/ReportsView';
import { DocumentsView } from './modules/Documents/DocumentsView';
import { AuditLogsView } from './modules/AuditLogs/AuditLogsView';
import { SettingsView } from './modules/Settings/SettingsView';

// Storage Service
import {
  initializeStorage,
  getLeads,
  getAccounts,
  getContacts,
  getOpportunities,
  getProposals,
  getActivities,
  getTasks,
  getProducts,
  getDocuments,
  getAuditLogs,
  getNotifications
} from './services/storageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // CRM Data State
  const [data, setData] = useState({
    leads: [],
    accounts: [],
    contacts: [],
    opportunities: [],
    proposals: [],
    activities: [],
    tasks: [],
    products: [],
    documents: [],
    auditLogs: [],
    notifications: []
  });

  const refreshData = () => {
    initializeStorage();
    setData({
      leads: getLeads(),
      accounts: getAccounts(),
      contacts: getContacts(),
      opportunities: getOpportunities(),
      proposals: getProposals(),
      activities: getActivities(),
      tasks: getTasks(),
      products: getProducts(),
      documents: getDocuments(),
      auditLogs: getAuditLogs(),
      notifications: getNotifications()
    });
  };

  useEffect(() => {
    refreshData();

    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpenSearch);
    return () => window.removeEventListener('open-search-modal', handleOpenSearch);
  }, []);

  const unreadNotificationsCount = data.notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Viewport */}
      <main className="app-main">
        {/* Topbar Navigation */}
        <Topbar
          activeTab={activeTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onToggleNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Scrollable View Area */}
        <div className="content-scrollable">
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={data.leads}
              opportunities={data.opportunities}
              tasks={data.tasks}
              activities={data.activities}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView leads={data.leads} onRefresh={refreshData} />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={data.accounts}
              contacts={data.contacts}
              opportunities={data.opportunities}
              proposals={data.proposals}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsView contacts={data.contacts} accounts={data.accounts} onRefresh={refreshData} />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesView
              opportunities={data.opportunities}
              onRefresh={refreshData}
              onNavigateToKanban={() => setActiveTab('pipeline')}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineView opportunities={data.opportunities} onRefresh={refreshData} />
          )}

          {activeTab === 'activities' && (
            <ActivitiesView activities={data.activities} onRefresh={refreshData} />
          )}

          {activeTab === 'tasks' && (
            <TasksView tasks={data.tasks} onRefresh={refreshData} />
          )}

          {activeTab === 'proposals' && (
            <ProposalsView
              proposals={data.proposals}
              opportunities={data.opportunities}
              products={data.products}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView products={data.products} />
          )}

          {activeTab === 'reports' && (
            <ReportsView opportunities={data.opportunities} leads={data.leads} />
          )}

          {activeTab === 'documents' && (
            <DocumentsView documents={data.documents} />
          )}

          {activeTab === 'audit' && (
            <AuditLogsView auditLogs={data.auditLogs} />
          )}

          {activeTab === 'settings' && (
            <SettingsView onRefresh={refreshData} />
          )}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <GlobalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRefresh={refreshData}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onRefresh={refreshData}
      />
    </div>
  );
}
