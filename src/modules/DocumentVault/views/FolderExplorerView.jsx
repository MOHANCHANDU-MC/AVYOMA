import React, { useState } from 'react';
import { FolderTree } from '../components/FolderTree';
import { DocumentTable } from '../components/DocumentTable';
import { FolderOpen, ChevronRight, Plus, Upload } from 'lucide-react';

export const FolderExplorerView = ({
  folders,
  documents,
  activeFolderId,
  onSelectFolder,
  onCreateFolder,
  onSelectDocument,
  onPreview,
  onDownload,
  onToggleStar,
  onOpenVersions,
  onOpenApprovals,
  onSoftDelete,
  onOpenUpload
}) => {
  const currentFolder = folders.find(f => f.id === activeFolderId) || null;
  const folderDocs = documents.filter(d => activeFolderId === null || d.folderId === activeFolderId);

  // Build Breadcrumbs
  const getBreadcrumbs = () => {
    if (!currentFolder) return [{ name: 'All Vault Files', id: null }];
    const crumbs = [{ name: currentFolder.name, id: currentFolder.id }];
    let curr = currentFolder;
    while (curr && curr.parentId) {
      curr = folders.find(f => f.id === curr.parentId);
      if (curr) crumbs.unshift({ name: curr.name, id: curr.id });
    }
    crumbs.unshift({ name: 'All Vault Files', id: null });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      {/* Folder Tree Sidebar */}
      <FolderTree
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={onSelectFolder}
        onCreateSubFolder={(parentId) => onCreateFolder(parentId)}
      />

      {/* Main Folder Explorer Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Breadcrumb Navigation Bar */}
        <div className="glass-surface-l1" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id || 'root'}>
                {idx > 0 && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                <button
                  onClick={() => onSelectFolder(crumb.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: idx === breadcrumbs.length - 1 ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontWeight: idx === breadcrumbs.length - 1 ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onCreateFolder(activeFolderId)}>
              <Plus size={14} /> New Subfolder
            </button>
            <button className="btn btn-primary btn-sm" onClick={onOpenUpload}>
              <Upload size={14} /> Upload Here
            </button>
          </div>
        </div>

        {/* Directory Document Table */}
        <DocumentTable
          documents={folderDocs}
          onRowClick={onSelectDocument}
          onPreview={onPreview}
          onDownload={onDownload}
          onToggleStar={onToggleStar}
          onOpenVersions={onOpenVersions}
          onOpenApprovals={onOpenApprovals}
          onSoftDelete={onSoftDelete}
        />
      </div>
    </div>
  );
};
