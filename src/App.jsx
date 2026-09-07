import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { GlobalCreateModal } from './components/GlobalCreateModal';
import { NotificationDrawer } from './components/NotificationDrawer';

// CRM Module Views
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

// Finance Module Views
import { FinanceDashboardView } from './modules/Finance/FinanceDashboardView';
import { ChartOfAccountsView } from './modules/Finance/ChartOfAccountsView';
import { JournalEntriesView } from './modules/Finance/JournalEntriesView';
import { InvoicesView } from './modules/Finance/InvoicesView';
import { BillsView } from './modules/Finance/BillsView';
import { ExpensesView } from './modules/Finance/ExpensesView';
import { IncomeView } from './modules/Finance/IncomeView';
import { BankingView } from './modules/Finance/BankingView';
import { BudgetsView } from './modules/Finance/BudgetsView';
import { TaxesView } from './modules/Finance/TaxesView';
import { FinancialReportsView } from './modules/Finance/FinancialReportsView';
import { DataImportView } from './modules/Finance/DataImportView';

// Services
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

import {
  initializeFinanceStorage,
  getFinanceAccounts,
  getFinanceJournals,
  getFinanceInvoices,
  getFinanceBills,
  getFinanceExpenses,
  getFinanceBankAccounts,
  getFinanceTaxes,
  getFinancePeriods,
  getFinanceBudgets,
  getFinanceCostCenters,
  getFinanceAuditLogs
} from './services/financeStorageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('finance-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Combined Data State
  const [data, setData] = useState({
    leads: [], accounts: [], contacts: [], opportunities: [], proposals: [], activities: [], tasks: [], products: [], documents: [], auditLogs: [], notifications: [],
    // Finance State
    finAccounts: [], finJournals: [], finInvoices: [], finBills: [], finExpenses: [], finBankAccounts: [], finTaxes: [], finPeriods: [], finBudgets: [], finCostCenters: [], finAuditLogs: []
  });

  const refreshData = () => {
    initializeStorage();
    initializeFinanceStorage();
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
      notifications: getNotifications(),
      // Finance
      finAccounts: getFinanceAccounts(),
      finJournals: getFinanceJournals(),
      finInvoices: getFinanceInvoices(),
      finBills: getFinanceBills(),
      finExpenses: getFinanceExpenses(),
      finBankAccounts: getFinanceBankAccounts(),
      finTaxes: getFinanceTaxes(),
      finPeriods: getFinancePeriods(),
      finBudgets: getFinanceBudgets(),
      finCostCenters: getFinanceCostCenters(),
      finAuditLogs: getFinanceAuditLogs()
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
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main className="app-main">
        <Topbar
          activeTab={activeTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onToggleNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        <div className="content-scrollable">
          {/* CRM Views */}
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={data.leads}
              opportunities={data.opportunities}
              tasks={data.tasks}
              activities={data.activities}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'leads' && <LeadsView leads={data.leads} onRefresh={refreshData} />}
          {activeTab === 'accounts' && <AccountsView accounts={data.accounts} contacts={data.contacts} opportunities={data.opportunities} proposals={data.proposals} onRefresh={refreshData} />}
          {activeTab === 'contacts' && <ContactsView contacts={data.contacts} accounts={data.accounts} onRefresh={refreshData} />}
          {activeTab === 'opportunities' && <OpportunitiesView opportunities={data.opportunities} onRefresh={refreshData} onNavigateToKanban={() => setActiveTab('pipeline')} />}
          {activeTab === 'pipeline' && <PipelineView opportunities={data.opportunities} onRefresh={refreshData} />}
          {activeTab === 'activities' && <ActivitiesView activities={data.activities} onRefresh={refreshData} />}
          {activeTab === 'tasks' && <TasksView tasks={data.tasks} onRefresh={refreshData} />}
          {activeTab === 'proposals' && <ProposalsView proposals={data.proposals} opportunities={data.opportunities} products={data.products} onRefresh={refreshData} />}
          {activeTab === 'products' && <ProductsView products={data.products} />}
          {activeTab === 'reports' && <ReportsView opportunities={data.opportunities} leads={data.leads} />}
          {activeTab === 'documents' && <DocumentsView documents={data.documents} />}
          {activeTab === 'audit' && <AuditLogsView auditLogs={data.auditLogs} />}
          {activeTab === 'settings' && <SettingsView onRefresh={refreshData} />}

          {/* Finance Views */}
          {activeTab === 'finance-dashboard' && (
            <FinanceDashboardView
              invoices={data.finInvoices}
              bills={data.finBills}
              expenses={data.finExpenses}
              bankAccounts={data.finBankAccounts}
              journals={data.finJournals}
              onNavigate={(tab) => setActiveTab(`finance-${tab}`)}
            />
          )}
          {activeTab === 'finance-accounts' && <ChartOfAccountsView accounts={data.finAccounts} onRefresh={refreshData} />}
          {activeTab === 'finance-journals' && <JournalEntriesView journals={data.finJournals} accounts={data.finAccounts} onRefresh={refreshData} />}
          {activeTab === 'finance-invoices' && <InvoicesView invoices={data.finInvoices} customers={data.accounts} bankAccounts={data.finBankAccounts} onRefresh={refreshData} />}
          {activeTab === 'finance-bills' && <BillsView bills={data.finBills} vendors={data.accounts} onRefresh={refreshData} />}
          {activeTab === 'finance-expenses' && <ExpensesView expenses={data.finExpenses} onRefresh={refreshData} />}
          {activeTab === 'finance-income' && <IncomeView />}
          {activeTab === 'finance-banking' && <BankingView bankAccounts={data.finBankAccounts} onRefresh={refreshData} />}
          {activeTab === 'finance-budgets' && <BudgetsView budgets={data.finBudgets} costCenters={data.finCostCenters} />}
          {activeTab === 'finance-taxes' && <TaxesView taxes={data.finTaxes} periods={data.finPeriods} />}
          {activeTab === 'finance-reports' && <FinancialReportsView accounts={data.finAccounts} invoices={data.finInvoices} bills={data.finBills} expenses={data.finExpenses} />}
          {activeTab === 'finance-import' && <DataImportView onRefresh={refreshData} />}
        </div>
      </main>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={(tab) => setActiveTab(tab)} />
      <GlobalCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onRefresh={refreshData} />
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onRefresh={refreshData} />
    </div>
  );
}
