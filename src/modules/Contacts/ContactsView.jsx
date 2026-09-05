import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Plus, Mail, Phone, Building2, UserCheck, Shield } from 'lucide-react';
import { addContact } from '../../services/storageService';

export const ContactsView = ({ contacts, accounts, onRefresh }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    firstName: '', lastName: '', designation: '', department: '', email: '', phone: '',
    companyName: '', role: 'Decision Maker'
  });

  const columns = [
    { header: 'Contact ID', field: 'id', width: '100px', render: (val) => <span className="font-mono">{val}</span> },
    {
      header: 'Full Name', field: 'name', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.designation}</div>
        </div>
      )
    },
    { header: 'Department', field: 'department' },
    { header: 'Company', field: 'companyName', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    {
      header: 'Role', field: 'role', render: (val) => (
        <span className={`badge ${val === 'Decision Maker' ? 'badge-green' : val === 'Technical' ? 'badge-purple' : 'badge-blue'}`}>
          {val}
        </span>
      )
    },
    { header: 'Email', field: 'email', render: (val) => <span style={{ color: 'var(--primary-blue)' }}>{val}</span> },
    { header: 'Phone', field: 'phone' }
  ];

  const handleCreateContact = (e) => {
    e.preventDefault();
    addContact({
      ...newContactForm,
      name: `${newContactForm.firstName} ${newContactForm.lastName}`.trim()
    });
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Contacts Directory ({contacts.length})</h2>
          <div className="page-subtitle">Key stakeholders, Decision Makers, Technical Leads, and Procurement Contacts</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Contact
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        searchPlaceholder="Search contacts by name, email, company..."
      />

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Contact"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateContact}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">First Name</label>
                <input type="text" className="input-field" required value={newContactForm.firstName} onChange={e => setNewContactForm({ ...newContactForm, firstName: e.target.value })} placeholder="Dr. Arisudan" />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Last Name</label>
                <input type="text" className="input-field" required value={newContactForm.lastName} onChange={e => setNewContactForm({ ...newContactForm, lastName: e.target.value })} placeholder="Mehta" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input type="text" className="input-field" value={newContactForm.designation} onChange={e => setNewContactForm({ ...newContactForm, designation: e.target.value })} placeholder="Chief Scientist - Radar Electronics" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="input-field" value={newContactForm.companyName} onChange={e => setNewContactForm({ ...newContactForm, companyName: e.target.value })} placeholder="Bharat Electronics Ltd" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="input-field" value={newContactForm.email} onChange={e => setNewContactForm({ ...newContactForm, email: e.target.value })} placeholder="a.mehta@bel.co.in" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Role</label>
                <select className="select-field" value={newContactForm.role} onChange={e => setNewContactForm({ ...newContactForm, role: e.target.value })}>
                  <option value="Decision Maker">Decision Maker</option>
                  <option value="Technical">Technical</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Contact</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
