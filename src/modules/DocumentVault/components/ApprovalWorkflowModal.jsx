import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { executeApprovalDecision } from '../services/documentVaultService';
import { CheckCircle2, AlertTriangle, XCircle, MessageSquare, Clock, ShieldCheck } from 'lucide-react';

export const ApprovalWorkflowModal = ({ approval, isOpen, onClose, onRefresh }) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !approval) return null;

  const handleDecision = (decision) => {
    executeApprovalDecision(approval.id, decision, commentText);
    setCommentText('');
    onClose();
    if (onRefresh) onRefresh();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Document Approval Review — ${approval.id}`} maxWidth="580px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Document Info Header */}
        <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 246, 255, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>APPROVAL REQUEST DETAILS</div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-dark)', marginTop: '2px' }}>{approval.documentTitle}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Requested by: <strong>{approval.requestedBy}</strong> • Deadline: {approval.deadlineAt || 'No deadline'}
          </div>
        </div>

        {/* Comment Trail */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Review Comments Log ({approval.comments?.length || 0})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {approval.comments?.map(cmt => (
              <div key={cmt.id} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(248, 250, 252, 0.8)', border: '1px solid var(--border-color)', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{cmt.author}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cmt.timestamp}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>"{cmt.text}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Approver Action Input */}
        <div className="form-group">
          <label className="form-label">Reviewer Comments / Decision Notes</label>
          <textarea
            className="textarea-field"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add compliance notes, engineering review comments, or change requirements..."
          />
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleDecision('CHANGES_REQUESTED')}
            style={{ gap: '4px', color: 'var(--status-amber-text)' }}
          >
            <AlertTriangle size={14} /> Request Changes
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDecision('REJECTED')}
            style={{ gap: '4px' }}
          >
            <XCircle size={14} /> Reject
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleDecision('APPROVED')}
            style={{ gap: '4px', backgroundColor: 'var(--status-green)', borderColor: 'var(--status-green)' }}
          >
            <CheckCircle2 size={14} /> Approve Document
          </button>
        </div>

      </div>
    </Modal>
  );
};
