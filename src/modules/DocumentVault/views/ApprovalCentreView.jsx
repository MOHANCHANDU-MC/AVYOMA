import React, { useState } from 'react';
import { APPROVAL_STATUSES } from '../data/vaultConstants';
import { CheckCircle2, Clock, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';

export const ApprovalCentreView = ({ approvals, onOpenApprovals }) => {
  const [activeStage, setActiveStage] = useState('ALL');

  const filteredApprovals = approvals.filter(app => {
    if (activeStage !== 'ALL' && app.stage !== activeStage) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Stage Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>Approval Workflow Centre ({filteredApprovals.length})</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review pending documents, evaluate specifications, and sign off on compliance releases</div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].map(stageKey => (
            <button
              key={stageKey}
              onClick={() => setActiveStage(stageKey)}
              className={`btn btn-sm ${activeStage === stageKey ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11.5px', padding: '5px 10px' }}
            >
              {stageKey.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredApprovals.map(app => (
          <div
            key={app.id}
            onClick={() => onOpenApprovals(app)}
            className="glass-surface-l1 prec-card-hover"
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 246, 255, 0.85)', color: 'var(--primary-blue)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-dark)' }}>{app.documentTitle}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Requested by: <strong>{app.requestedBy}</strong> • Assigned Approver: <strong>{app.assignedApprover}</strong> ({app.approverRole})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-purple">{app.stage}</span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Deadline: {app.deadlineAt}</div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
                Review <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="glass-surface-l1" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No approval workflow tasks matching stage filter "{activeStage}".
          </div>
        )}
      </div>

    </div>
  );
};
