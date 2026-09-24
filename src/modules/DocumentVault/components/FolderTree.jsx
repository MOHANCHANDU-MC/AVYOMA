import React from 'react';
import { Folder, FolderOpen, ChevronRight, Plus, HardDrive } from 'lucide-react';

export const FolderTree = ({ folders, activeFolderId, onSelectFolder, onCreateSubFolder }) => {
  return (
    <div className="glass-surface-l1" style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HardDrive size={14} /> Vault Directories
        </div>
        <button className="btn btn-ghost btn-sm btn-icon" title="New Folder" onClick={() => onCreateSubFolder && onCreateSubFolder(null)}>
          <Plus size={15} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '580px' }}>
        {/* All Root Item */}
        <button
          onClick={() => onSelectFolder(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeFolderId === null ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
            color: activeFolderId === null ? 'var(--primary-blue)' : 'var(--text-dark)',
            fontWeight: activeFolderId === null ? 600 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <FolderOpen size={16} style={{ color: activeFolderId === null ? 'var(--primary-blue)' : '#64748B' }} />
          <span>All Vault Files</span>
        </button>

        {/* Root Folders */}
        {folders.filter(f => f.parentId === null).map(folder => {
          const isActive = activeFolderId === folder.id;
          const subFolders = folders.filter(f => f.parentId === folder.id);

          return (
            <div key={folder.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                onClick={() => onSelectFolder(folder.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  color: isActive ? 'var(--primary-blue)' : 'var(--text-dark)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <Folder size={16} style={{ color: folder.color || '#2563EB', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                </div>
                {subFolders.length > 0 && <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />}
              </button>

              {/* Sub Folders Indented */}
              {subFolders.length > 0 && (
                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {subFolders.map(sub => {
                    const isSubActive = activeFolderId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSelectFolder(sub.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-md)',
                          border: 'none',
                          background: isSubActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                          color: isSubActive ? 'var(--primary-blue)' : 'var(--text-secondary)',
                          fontWeight: isSubActive ? 600 : 400,
                          fontSize: '12px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Folder size={14} style={{ color: '#64748B', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
