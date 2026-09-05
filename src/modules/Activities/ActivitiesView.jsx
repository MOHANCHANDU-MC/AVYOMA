import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../../components/Modal';
import { Plus, Phone, Calendar, Video, FileText, MapPin, CheckCircle, Clock } from 'lucide-react';
import { addActivity } from '../../services/storageService';

export const ActivitiesView = ({ activities, onRefresh }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActForm, setNewActForm] = useState({
    type: 'Meeting', subject: '', relatedAccount: 'Bharat Electronics Ltd (BEL)',
    assignedUser: 'Kavya R.', time: '10:30 AM', notes: '', outcome: ''
  });

  const columns = [
    { header: 'ID', field: 'id', width: '90px', render: (val) => <span className="font-mono">{val}</span> },
    {
      header: 'Type', field: 'type', render: (val) => (
        <span className="badge badge-blue">
          {val}
        </span>
      )
    },
    {
      header: 'Subject', field: 'subject', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.relatedAccount || 'General'}</div>
        </div>
      )
    },
    { header: 'Date', field: 'date', render: (val) => formatDate(val) },
    { header: 'Time', field: 'time' },
    { header: 'Assigned User', field: 'assignedUser' },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> },
    { header: 'Outcome', field: 'outcome', render: (val) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{val || 'Pending'}</span> }
  ];

  const handleCreateActivity = (e) => {
    e.preventDefault();
    addActivity(newActForm);
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Activities & Communications ({activities.length})</h2>
          <div className="page-subtitle">Track calls, technical discussions, client site visits, and meeting outcomes</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Log Activity
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={activities}
        searchPlaceholder="Search activities by subject, type, account..."
      />

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Log Sales / Engineering Activity"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateActivity}>
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <select className="select-field" value={newActForm.type} onChange={e => setNewActForm({ ...newActForm, type: e.target.value })}>
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Technical Discussion">Technical Discussion</option>
                <option value="Demo">Demo</option>
                <option value="Proposal Submission">Proposal Submission</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Subject</label>
              <input type="text" className="input-field" required value={newActForm.subject} onChange={e => setNewActForm({ ...newActForm, subject: e.target.value })} placeholder="e.g. Review of Radar Frequency Noise Spec" />
            </div>
            <div className="form-group">
              <label className="form-label">Related Company / Account</label>
              <input type="text" className="input-field" value={newActForm.relatedAccount} onChange={e => setNewActForm({ ...newActForm, relatedAccount: e.target.value })} placeholder="Bharat Electronics Ltd" />
            </div>
            <div className="form-group">
              <label className="form-label">Discussion Notes</label>
              <textarea className="textarea-field" value={newActForm.notes} onChange={e => setNewActForm({ ...newActForm, notes: e.target.value })} placeholder="Enter key discussion highlights..." />
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Log Activity</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
