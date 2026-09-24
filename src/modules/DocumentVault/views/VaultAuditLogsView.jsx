import React from 'react';
import { DataTable } from '../../../components/DataTable';
import { Shield, Download } from 'lucide-react';

export const VaultAuditLogsView = ({ auditLogs }) => {
  const columns = [
    { header: 'Log ID', field: 'id', width: '110px', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    {
      header: 'Action',
      field: 'action',
      render: (val) => <span className="badge badge-blue font-mono" style={{ fontSize: '10px' }}>{val}</span>
    },
    { header: 'Document Title', field: 'documentTitle', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'User Identity', field: 'user', render: (val, row) => <span>{val} ({row.userRole})</span> },
    { header: 'Audit Details & IP', field: 'details', render: (val) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{val}</span> },
    { header: 'Timestamp', field: 'timestamp', render: (val) => <span style={{ fontSize: '12px' }} className="num-tabular">{val}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>Security & Compliance Audit Logs ({auditLogs.length})</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Complete immutable audit history for AS9100D, ISO 27001, and defence security audits</div>
        </div>
        <button className="btn btn-secondary" onClick={() => {
          const csv = 'Log ID,Action,Document,User,Details,Timestamp\n' + auditLogs.map(l => `${l.id},${l.action},"${l.documentTitle}","${l.user}",${l.details},${l.timestamp}`).join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Avyoma_Vault_Audit_Report.csv';
          a.click();
        }}>
          <Download size={15} /> Export Audit Trail CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        searchPlaceholder="Search audit logs by user, document, action, IP..."
      />

    </div>
  );
};
