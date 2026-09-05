import React from 'react';
import { DataTable } from '../../components/DataTable';
import { Shield, Activity, Lock } from 'lucide-react';

export const AuditLogsView = ({ auditLogs }) => {
  const columns = [
    { header: 'Log ID', field: 'id', width: '100px', render: (val) => <span className="font-mono">{val}</span> },
    { header: 'User / Actor', field: 'user', render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</span> },
    { header: 'Action', field: 'action', render: (val) => <span className="badge badge-purple">{val}</span> },
    { header: 'Audit Details', field: 'details', render: (val) => <span style={{ fontSize: '13px' }}>{val}</span> },
    { header: 'Timestamp', field: 'timestamp', render: (val) => <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{val}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Immutable Audit Trail ({auditLogs.length})</h2>
          <div className="page-subtitle">Compliance audit log tracking all opportunity stage changes, proposal generations, and user access</div>
        </div>
        <div className="page-actions">
          <span className="badge badge-green">
            <Lock size={12} /> Compliance Enforced
          </span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        searchPlaceholder="Search audit logs by user, action, details..."
      />
    </div>
  );
};
