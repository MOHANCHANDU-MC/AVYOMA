import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Trash2,
  FolderTree,
  Shield,
  Plus,
  Search,
  Sparkles
} from 'lucide-react';

export const VaultHeader = ({ activeSubTab, setActiveSubTab, onOpenUpload, onOpenCreateFolder, searchQuery, setSearchQuery }) => {
  const navTabs = [
    { id: 'dashboard', label: 'Vault Overview', icon: LayoutDashboard },
    { id: 'all-documents', label: 'All Documents', icon: FileText },
    { id: 'folder-explorer', label: 'Folder Explorer', icon: FolderOpen },
    { id: 'upload-centre', label: 'Upload Centre', icon: Upload },
    { id: 'approvals', label: 'Approval Centre', icon: CheckCircle2 },
    { id: 'expiring', label: 'Expiring & Review', icon: Clock },
    { id: 'categories', label: 'Taxonomy & Categories', icon: FolderTree },
    { id: 'trash', label: 'Trash & Recovery', icon: Trash2 },
    { id: 'audit-logs', label: 'Audit Logs', icon: Shield }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Bar */}
      <div className="page-header" style={{ marginBottom: '0' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--primary-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} /> AVYOMA ENTERPRISE / DOCUMENT VAULT
          </div>
          <h2 className="page-title">Enterprise Document Vault</h2>
          <div className="page-subtitle">Centralized secure document management system for defence, aerospace & engineering records</div>
        </div>

        <div className="page-actions">
          {/* Quick Search */}
          <div className="input-search-wrapper" style={{ width: '260px' }}>
            <Search size={15} className="input-search-icon" />
            <input
              type="text"
              className="input-field input-search"
              placeholder="Search vault docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '13px', padding: '6px 12px 6px 36px' }}
            />
          </div>

          <button className="btn btn-secondary" onClick={onOpenCreateFolder}>
            <Plus size={15} /> Create Folder
          </button>
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <Upload size={15} /> Upload Document
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '8px',
        alignItems: 'center'
      }}>
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                gap: '6px',
                fontWeight: isActive ? 600 : 500,
                fontSize: '12.5px',
                padding: '6px 12px'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
