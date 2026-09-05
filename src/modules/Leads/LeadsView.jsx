import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, PriorityBadge, ScoreBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Drawer, Modal } from '../../components/Modal';
import { convertLead, addLead, updateLead, deleteLead } from '../../services/storageService';
import { Plus, Download, Filter, Eye, ArrowRight, Building2, User, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const LeadsView = ({ leads, onRefresh }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSavedView, setActiveSavedView] = useState('ALL');

  // Form data for adding new lead
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '', company: '', jobTitle: '', email: '', phone: '', location: '',
    industry: 'Defence', sector: 'Military Systems', requirement: '', estimatedValue: 3500000,
    leadOwner: 'Kavya R.', priority: 'High', leadSource: 'Government Tender'
  });

  // Filter Data by Saved Views
  const filteredLeads = leads.filter(lead => {
    if (activeSavedView === 'HOT') return Number(lead.leadScore || 0) >= 61;
    if (activeSavedView === 'DEFENCE') return (lead.industry || '').toLowerCase() === 'defence';
    if (activeSavedView === 'QUALIFIED') return lead.leadStatus === 'Qualified';
    return true;
  });

  const columns = [
    { header: 'Lead ID', field: 'id', width: '120px', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    {
      header: 'Full Name', field: 'fullName', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.jobTitle}</div>
        </div>
      )
    },
    { header: 'Company', field: 'company', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { header: 'Industry', field: 'industry' },
    { header: 'Est. Value', field: 'estimatedValue', render: (val) => <span className="num-tabular" style={{ fontWeight: 600 }}>{formatCurrency(val)}</span> },
    { header: 'Lead Score', field: 'leadScore', render: (val) => <ScoreBadge score={val} /> },
    { header: 'Status', field: 'leadStatus', render: (val) => <StatusBadge status={val} /> },
    { header: 'Priority', field: 'priority', render: (val) => <PriorityBadge priority={val} /> },
    { header: 'Next Follow-up', field: 'nextFollowup', render: (val) => formatDate(val) },
    {
      header: 'Actions', field: 'id', sortable: false, render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => { e.stopPropagation(); setSelectedLead(row); }}
            title="Quick View"
          >
            <Eye size={14} />
          </button>
          {row.leadStatus !== 'Converted' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => { e.stopPropagation(); setSelectedLead(row); setIsConvertModalOpen(true); }}
              style={{ padding: '4px 8px', fontSize: '11px' }}
            >
              Convert
            </button>
          )}
        </div>
      )
    }
  ];

  const handleCreateLead = (e) => {
    e.preventDefault();
    const parts = newLeadForm.fullName.split(' ');
    addLead({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      ...newLeadForm,
      estimatedValue: Number(newLeadForm.estimatedValue)
    });
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  const handleExecuteConversion = () => {
    if (!selectedLead) return;
    convertLead(selectedLead.id);
    setIsConvertModalOpen(false);
    setSelectedLead(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Controls */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Lead Management ({filteredLeads.length})</h2>
          <div className="page-subtitle">Track, score, qualify, and convert defence & engineering leads</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => {
            const csv = 'Lead ID,Full Name,Company,Industry,Value,Score,Status\n' + leads.map(l => `${l.id},"${l.fullName}","${l.company}",${l.industry},${l.estimatedValue},${l.leadScore},${l.leadStatus}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Avyoma_Leads_Export.csv';
            a.click();
          }}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Saved Views Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {[
          { id: 'ALL', label: 'All Leads' },
          { id: 'HOT', label: '🔥 Hot & Very Hot Leads' },
          { id: 'DEFENCE', label: 'Defence Sector' },
          { id: 'QUALIFIED', label: 'Qualified Only' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSavedView(tab.id)}
            className={`btn btn-sm ${activeSavedView === tab.id ? 'btn-primary' : 'btn-ghost'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <DataTable
        columns={columns}
        data={filteredLeads}
        onRowClick={(row) => setSelectedLead(row)}
        searchPlaceholder="Search leads by name, company, industry..."
      />

      {/* Quick View Drawer */}
      {selectedLead && (
        <Drawer
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          title={`Lead Profile: ${selectedLead.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>{selectedLead.fullName}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedLead.jobTitle} at <strong>{selectedLead.company}</strong></div>
                </div>
                <ScoreBadge score={selectedLead.leadScore} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                <StatusBadge status={selectedLead.leadStatus} />
                <PriorityBadge priority={selectedLead.priority} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-blue)' }}>{selectedLead.industry}</span>
              </div>
            </div>

            {/* Basic Info & Requirement */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Business Requirement
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: 1.5, padding: '12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {selectedLead.requirement || 'No detailed requirement provided.'}
              </p>
            </div>

            {/* Key Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>ESTIMATED DEAL VALUE</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }} className="num-tabular">{formatCurrency(selectedLead.estimatedValue)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>LEAD OWNER</div>
                <div style={{ fontWeight: 600 }}>{selectedLead.leadOwner}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>EMAIL</div>
                <div>{selectedLead.email || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>PHONE</div>
                <div>{selectedLead.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {selectedLead.leadStatus !== 'Converted' && (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setIsConvertModalOpen(true)}
                >
                  Convert Lead to Account & Opportunity
                </button>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* Convert Lead Wizard Modal */}
      {isConvertModalOpen && selectedLead && (
        <Modal
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          title={`Convert Lead: ${selectedLead.company}`}
          maxWidth="540px"
        >
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-dark)', marginBottom: '16px' }}>
              Converting this lead will automatically generate the following linked records:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={20} style={{ color: 'var(--primary-blue)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>Account (Company)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedLead.company}</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} style={{ color: 'var(--status-amber-text)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>Primary Contact</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedLead.fullName} ({selectedLead.jobTitle})</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={20} style={{ color: 'var(--status-green)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>Opportunity (Pipeline)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedLead.company} - Requirement ({formatCurrency(selectedLead.estimatedValue)})</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setIsConvertModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleExecuteConversion}>
                Confirm Conversion
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Lead Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Lead"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateLead}>
            <div className="form-group">
              <label className="form-label form-label-required">Full Name</label>
              <input
                type="text" className="input-field" required
                value={newLeadForm.fullName}
                onChange={e => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                placeholder="e.g. Air Cmdr. R. K. Sharma"
              />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Company</label>
              <input
                type="text" className="input-field" required
                value={newLeadForm.company}
                onChange={e => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                placeholder="e.g. Bharat Electronics Ltd"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text" className="input-field"
                  value={newLeadForm.jobTitle}
                  onChange={e => setNewLeadForm({ ...newLeadForm, jobTitle: e.target.value })}
                  placeholder="Director Radar Avionics"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select
                  className="select-field"
                  value={newLeadForm.industry}
                  onChange={e => setNewLeadForm({ ...newLeadForm, industry: e.target.value })}
                >
                  <option value="Defence">Defence</option>
                  <option value="Aerospace">Aerospace</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Requirement Details</label>
              <textarea
                className="textarea-field"
                value={newLeadForm.requirement}
                onChange={e => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                placeholder="Describe technical specification or B2B requirement..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Deal Value (₹)</label>
              <input
                type="number" className="input-field"
                value={newLeadForm.estimatedValue}
                onChange={e => setNewLeadForm({ ...newLeadForm, estimatedValue: e.target.value })}
              />
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Lead</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
