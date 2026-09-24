import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { getDocumentVersions, uploadNewDocumentVersion } from '../services/documentVaultService';
import { GitBranch, Upload, Clock, User, CheckCircle2, FileText } from 'lucide-react';

export const VersionHistoryModal = ({ document: doc, isOpen, onClose, onRefresh }) => {
  const [versions, setVersions] = useState([]);
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState(null);
  const [changeSummary, setChangeSummary] = useState('');

  useEffect(() => {
    if (doc) {
      setVersions(getDocumentVersions(doc.id));
    }
  }, [doc, isOpen]);

  const handleUploadNewVersion = (e) => {
    e.preventDefault();
    if (!doc) return;

    uploadNewDocumentVersion(doc.id, { changeSummary }, newVersionFile);
    setIsUploadingVersion(false);
    setChangeSummary('');
    setNewVersionFile(null);
    setVersions(getDocumentVersions(doc.id));
    if (onRefresh) onRefresh();
  };

  if (!isOpen || !doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Version History — ${doc.title}`} maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Current Active Version: v{doc.version}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Immutable history log preserving all previous file revisions</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsUploadingVersion(!isUploadingVersion)}>
            <Upload size={14} /> Upload New Version
          </button>
        </div>

        {/* Upload Form (If Toggled) */}
        {isUploadingVersion && (
          <form onSubmit={handleUploadNewVersion} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 246, 255, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--primary-blue-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-blue)' }}>Upload Revision File (Will become v{(parseFloat(doc.version || '1.0') + 0.1).toFixed(1)})</div>
            <input
              type="file"
              onChange={(e) => setNewVersionFile(e.target.files[0])}
              className="input-field"
              style={{ fontSize: '12px' }}
            />
            <textarea
              className="textarea-field"
              value={changeSummary}
              onChange={(e) => setChangeSummary(e.target.value)}
              placeholder="Describe delta changes, engineering revisions, or compliance updates..."
              style={{ minHeight: '60px', fontSize: '12.5px' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsUploadingVersion(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save & Register Version</button>
            </div>
          </form>
        )}

        {/* Version History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
          {versions.map((ver, idx) => (
            <div
              key={ver.id}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: idx === 0 ? 'rgba(236, 253, 245, 0.75)' : 'rgba(248, 250, 252, 0.75)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${idx === 0 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GitBranch size={16} style={{ color: idx === 0 ? 'var(--status-green)' : 'var(--primary-blue)' }} />
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark)' }}>Version {ver.versionNumber}</span>
                  {idx === 0 && <span className="badge badge-green">Active Release</span>}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="num-tabular">{ver.uploadedAt}</span>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                "{ver.changeSummary || 'No revision notes provided.'}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
                <span>Uploaded by: <strong>{ver.uploadedBy}</strong> ({ver.fileSize})</span>
                <span className="font-mono">SHA: {ver.checksumSHA256?.substring(0, 14)}...</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Modal>
  );
};
