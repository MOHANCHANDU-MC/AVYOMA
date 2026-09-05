import React, { useState } from 'react';
import { Modal } from './Modal';
import { addLead, addAccount, addContact, addOpportunity, addTask, addActivity } from '../services/storageService';

export const GlobalCreateModal = ({ isOpen, onClose, onRefresh }) => {
  const [createType, setCreateType] = useState('lead');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', company: '', email: '', phone: '', industry: 'Defence', requirement: '', estimatedValue: 2500000,
    companyName: '', city: '', customerType: 'Prospect',
    name: '', designation: '',
    opportunityName: '', opportunityValue: 5000000, salesStage: 'QUALIFICATION',
    title: '', dueDate: '2026-09-15', priority: 'High',
    type: 'Call', subject: '', notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (createType === 'lead') {
      const parts = formData.fullName.split(' ');
      addLead({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        fullName: formData.fullName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        requirement: formData.requirement,
        estimatedValue: Number(formData.estimatedValue)
      });
    } else if (createType === 'account') {
      addAccount({
        companyName: formData.companyName,
        industry: formData.industry,
        city: formData.city,
        customerType: formData.customerType
      });
    } else if (createType === 'opportunity') {
      addOpportunity({
        opportunityName: formData.opportunityName,
        account: formData.company,
        opportunityValue: Number(formData.opportunityValue),
        salesStage: formData.salesStage
      });
    } else if (createType === 'task') {
      addTask({
        title: formData.title,
        dueDate: formData.dueDate,
        priority: formData.priority
      });
    } else if (createType === 'activity') {
      addActivity({
        type: formData.type,
        subject: formData.subject,
        notes: formData.notes
      });
    }

    if (onRefresh) onRefresh();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New CRM Record" maxWidth="560px">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'lead', label: 'Lead' },
          { id: 'account', label: 'Account' },
          { id: 'opportunity', label: 'Opportunity' },
          { id: 'task', label: 'Task' },
          { id: 'activity', label: 'Log Activity' }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setCreateType(type.id)}
            className={`btn btn-sm ${createType === type.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {createType === 'lead' && (
          <>
            <div className="form-group">
              <label className="form-label form-label-required">Lead Full Name</label>
              <input type="text" className="input-field" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="e.g. Vikram Aditya" />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Company Name</label>
              <input type="text" className="input-field" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Godrej Aerospace" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="input-field" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" className="input-field" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98000 00000" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <select className="select-field" name="industry" value={formData.industry} onChange={handleChange}>
                <option value="Defence">Defence</option>
                <option value="Aerospace">Aerospace</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Industrial">Industrial</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Deal Value (₹)</label>
              <input type="number" className="input-field" name="estimatedValue" value={formData.estimatedValue} onChange={handleChange} />
            </div>
          </>
        )}

        {createType === 'account' && (
          <>
            <div className="form-group">
              <label className="form-label form-label-required">Company Name</label>
              <input type="text" className="input-field" name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="e.g. Bharat Dynamics Ltd" />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="select-field" name="industry" value={formData.industry} onChange={handleChange}>
                <option value="Defence">Defence</option>
                <option value="Aerospace">Aerospace</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input type="text" className="input-field" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Hyderabad" />
            </div>
          </>
        )}

        {createType === 'opportunity' && (
          <>
            <div className="form-group">
              <label className="form-label form-label-required">Opportunity Name</label>
              <input type="text" className="input-field" name="opportunityName" required value={formData.opportunityName} onChange={handleChange} placeholder="e.g. Fighter Jet Avionics Frame" />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Target Company / Account</label>
              <input type="text" className="input-field" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. HAL Aerospace" />
            </div>
            <div className="form-group">
              <label className="form-label">Opportunity Value (₹)</label>
              <input type="number" className="input-field" name="opportunityValue" value={formData.opportunityValue} onChange={handleChange} />
            </div>
          </>
        )}

        {createType === 'task' && (
          <>
            <div className="form-group">
              <label className="form-label form-label-required">Task Title</label>
              <input type="text" className="input-field" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Send technical RFP specification to BEL" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="input-field" name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="select-field" name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </>
        )}

        {createType === 'activity' && (
          <>
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <select className="select-field" name="type" value={formData.type} onChange={handleChange}>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Demo">Demo</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Technical Discussion">Technical Discussion</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Subject / Title</label>
              <input type="text" className="input-field" name="subject" required value={formData.subject} onChange={handleChange} placeholder="e.g. Technical review meeting with HAL R&D team" />
            </div>
            <div className="form-group">
              <label className="form-label">Activity Notes</label>
              <textarea className="textarea-field" name="notes" value={formData.notes} onChange={handleChange} placeholder="Summarize key points discussed..." />
            </div>
          </>
        )}

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save {createType}</button>
        </div>
      </form>
    </Modal>
  );
};
