import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { logVaultAudit } from '../services/documentVaultService';
import { Lock, UserCheck, Share2, Copy, Check, ShieldAlert, Key } from 'lucide-react';

export const AccessControlModal = ({ document: doc, isOpen, onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('VIEW');
  const [expiresInDays, setExpiresInDays] = useState('30');
  const [copiedLink, setCopiedLink] = useState(false);
  const [grants, setGrants] = useState([
    { id: '1', name: 'Air Cmdr. Rajesh Sharma (Retd)', role: 'VP Defence Systems', level: 'MANAGE' },
    { id: '2', name: 'Aerospace R&D Team', role: 'Department', level: 'DOWNLOAD' },
    { id: '3', name: 'Quality Audit Team', role: 'Department', level: 'VIEW' }
  ]);

  if (!isOpen || !doc) return null;

  const handleAddGrant = (e) => {
    e.preventDefault();
    if (!recipient.trim()) return;
    setGrants([...grants, { id: String(Date.now()), name: recipient, role: 'User / Group', level: permissionLevel }]);
    logVaultAudit('SHARE_DOCUMENT', doc.id, doc.title, `Granted ${permissionLevel} access to ${recipient}`);
    setRecipient('');
  };

  const shareableUrl = `https://vault.avyoma.in/share/doc-${doc.id.toLowerCase()}?token=${Math.random().toString(36).substring(2, 12)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Access Permissions & Sharing — ${doc.title}`} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Security Alert Header */}
        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(254, 243, 199, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--status-amber-text)' }} />
          <div style={{ fontSize: '12px', color: 'var(--status-amber-text)' }}>
            <strong>Confidentiality Level: {doc.confidentiality}</strong>. Only authorized organization members with explicit grants may access this file.
          </div>
        </div>

        {/* Add Share Grant Form */}
        <form onSubmit={handleAddGrant} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">User or Department</label>
            <input
              type="text" className="input-field"
              placeholder="e.g. Avionics R&D Team or user@avyoma.in"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ width: '130px', marginBottom: 0 }}>
            <label className="form-label">Permission</label>
            <select className="select-field" value={permissionLevel} onChange={e => setPermissionLevel(e.target.value)}>
              <option value="VIEW">View Only</option>
              <option value="DOWNLOAD">Download</option>
              <option value="EDIT">Edit Metadata</option>
              <option value="MANAGE">Full Control</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>Grant</button>
        </form>

        {/* Existing Grants List */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Active Access Permissions ({grants.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {grants.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(248, 250, 252, 0.8)', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={16} style={{ color: 'var(--primary-blue)' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{g.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{g.role}</div>
                  </div>
                </div>
                <span className="badge badge-blue">{g.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secure Link Sharing */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Encrypted Shareable Token Link
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" className="input-field font-mono" readOnly value={shareableUrl} style={{ fontSize: '11.5px', background: 'rgba(241, 245, 249, 0.8)' }} />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(shareableUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
