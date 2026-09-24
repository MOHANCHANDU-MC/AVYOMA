import React from 'react';
import { Drawer } from '../../../components/Modal';
import { Shield, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

export const AuditLogDrawer = ({ auditLogs, isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Security & Compliance Audit Trail">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 246, 255, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} style={{ color: 'var(--primary-blue)' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Immutable Audit Logs</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>All access attempts, previews, downloads, uploads, and approval sign-offs are logged for AS9100/ISO audit compliance.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          {auditLogs.map(log => (
            <div
              key={log.id}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(248, 250, 252, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-blue font-mono" style={{ fontSize: '10px' }}>{log.action}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="num-tabular">{log.timestamp}</span>
              </div>

              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginTop: '2px' }}>
                {log.documentTitle}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {log.details}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px solid rgba(226, 232, 240, 0.6)', marginTop: '4px' }}>
                <span>User: <strong>{log.user}</strong> ({log.userRole})</span>
                <span className="font-mono">{log.id}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Drawer>
  );
};
