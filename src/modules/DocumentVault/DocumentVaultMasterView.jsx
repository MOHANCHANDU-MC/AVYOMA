import React, { useState, useEffect } from 'react';
import { VaultHeader } from './components/VaultHeader';
import { VaultDashboardView } from './views/VaultDashboardView';
import { AllDocumentsView } from './views/AllDocumentsView';
import { FolderExplorerView } from './views/FolderExplorerView';
import { UploadCentreView } from './views/UploadCentreView';
import { ApprovalCentreView } from './views/ApprovalCentreView';
import { ExpiringDocumentsView } from './views/ExpiringDocumentsView';
import { ArchivedTrashView } from './views/ArchivedTrashView';
import { CategoriesView } from './views/CategoriesView';
import { VaultAuditLogsView } from './views/VaultAuditLogsView';

// Modals
import { UploadModal } from './components/UploadModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { ApprovalWorkflowModal } from './components/ApprovalWorkflowModal';
import { AccessControlModal } from './components/AccessControlModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';

// Service
import {
  initializeVaultStorage,
  getVaultDashboardStats,
  getVaultDocuments,
  getVaultFolders,
  getVaultApprovals,
  getVaultAuditLogs,
  uploadVaultDocument,
  createVaultFolder,
  toggleStarDocument,
  softDeleteDocument,
  restoreDocument,
  logVaultAudit
} from './services/documentVaultService';

export const DocumentVaultMasterView = () => {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolderId, setActiveFolderId] = useState(null);

  // Core State
  const [stats, setStats] = useState({ totalDocuments: 0, totalStorageFormatted: '0 MB', documentsShared: 0, pendingApprovals: 0, expiringSoonCount: 0, recentlyUpdatedCount: 0 });
  const [documents, setDocuments] = useState([]);
  const [deletedDocs, setDeletedDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals & Active Selections
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const refreshVaultData = () => {
    initializeVaultStorage();
    setStats(getVaultDashboardStats());
    setDocuments(getVaultDocuments({ searchQuery, folderId: activeFolderId }));
    setDeletedDocs(getVaultDocuments({ includeDeleted: true }));
    setFolders(getVaultFolders());
    setApprovals(getVaultApprovals());
    setAuditLogs(getVaultAuditLogs());
  };

  useEffect(() => {
    refreshVaultData();
  }, [searchQuery, activeFolderId]);

  // Actions
  const handleUploadSuccess = (uploadData, fileObj) => {
    uploadVaultDocument(uploadData, fileObj);
    refreshVaultData();
  };

  const handleCreateFolder = (parentId = null) => {
    const name = window.prompt('Enter new folder name:');
    if (name && name.trim()) {
      createVaultFolder({ name: name.trim(), parentId });
      refreshVaultData();
    }
  };

  const handleToggleStar = (docId) => {
    toggleStarDocument(docId);
    refreshVaultData();
  };

  const handleSoftDelete = (docId) => {
    if (window.confirm('Move document to Trash & Recovery Vault?')) {
      softDeleteDocument(docId);
      refreshVaultData();
    }
  };

  const handleRestore = (docId) => {
    restoreDocument(docId);
    refreshVaultData();
  };

  const handleDownload = (doc) => {
    logVaultAudit('DOWNLOAD_DOCUMENT', doc.id, doc.title, `Downloaded file "${doc.fileName}" (${doc.fileSize})`);
    
    // Simulate Download
    const blob = new Blob([doc.contentPreviewText || 'CONFIDENTIAL DOCUMENT CONTENT'], { type: doc.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    a.click();
    refreshVaultData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Shared Header Navigation */}
      <VaultHeader
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCreateFolder={() => handleCreateFolder(activeFolderId)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Dynamic Sub-Views */}
      {activeSubTab === 'dashboard' && (
        <VaultDashboardView
          stats={stats}
          documents={documents}
          approvals={approvals}
          onNavigateSubTab={(tab) => setActiveSubTab(tab)}
          onSelectDocument={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onDownload={handleDownload}
          onToggleStar={handleToggleStar}
          onOpenVersions={(doc) => { setSelectedDoc(doc); setIsVersionsOpen(true); }}
          onOpenApprovals={(app) => { setSelectedApproval(app); setIsApprovalsOpen(true); }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenCreateFolder={() => handleCreateFolder(null)}
        />
      )}

      {activeSubTab === 'all-documents' && (
        <AllDocumentsView
          documents={documents}
          onSelectDocument={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onDownload={handleDownload}
          onToggleStar={handleToggleStar}
          onOpenVersions={(doc) => { setSelectedDoc(doc); setIsVersionsOpen(true); }}
          onOpenApprovals={(app) => { setSelectedApproval(app); setIsApprovalsOpen(true); }}
          onSoftDelete={handleSoftDelete}
          onRestore={handleRestore}
        />
      )}

      {activeSubTab === 'folder-explorer' && (
        <FolderExplorerView
          folders={folders}
          documents={documents}
          activeFolderId={activeFolderId}
          onSelectFolder={(fId) => setActiveFolderId(fId)}
          onCreateFolder={(pId) => handleCreateFolder(pId)}
          onSelectDocument={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onDownload={handleDownload}
          onToggleStar={handleToggleStar}
          onOpenVersions={(doc) => { setSelectedDoc(doc); setIsVersionsOpen(true); }}
          onOpenApprovals={(app) => { setSelectedApproval(app); setIsApprovalsOpen(true); }}
          onSoftDelete={handleSoftDelete}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      )}

      {activeSubTab === 'upload-centre' && (
        <UploadCentreView onUploadSuccess={handleUploadSuccess} />
      )}

      {activeSubTab === 'approvals' && (
        <ApprovalCentreView
          approvals={approvals}
          onOpenApprovals={(app) => { setSelectedApproval(app); setIsApprovalsOpen(true); }}
        />
      )}

      {activeSubTab === 'expiring' && (
        <ExpiringDocumentsView
          documents={documents}
          onSelectDocument={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onDownload={handleDownload}
          onToggleStar={handleToggleStar}
          onOpenVersions={(doc) => { setSelectedDoc(doc); setIsVersionsOpen(true); }}
          onOpenApprovals={(app) => { setSelectedApproval(app); setIsApprovalsOpen(true); }}
          onSoftDelete={handleSoftDelete}
        />
      )}

      {activeSubTab === 'trash' && (
        <ArchivedTrashView
          deletedDocuments={deletedDocs}
          onRestore={handleRestore}
          onSelectDocument={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
        />
      )}

      {activeSubTab === 'categories' && (
        <CategoriesView documents={documents} />
      )}

      {activeSubTab === 'audit-logs' && (
        <VaultAuditLogsView auditLogs={auditLogs} />
      )}

      {/* Global Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentFolder={folders.find(f => f.id === activeFolderId)}
      />

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDoc}
        onDownload={handleDownload}
        onOpenVersions={(doc) => setIsVersionsOpen(true)}
      />

      <VersionHistoryModal
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        document={selectedDoc}
        onRefresh={refreshVaultData}
      />

      <ApprovalWorkflowModal
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
        approval={selectedApproval}
        onRefresh={refreshVaultData}
      />

      <AccessControlModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        document={selectedDoc}
      />

      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditLogs={auditLogs}
      />

    </div>
  );
};
