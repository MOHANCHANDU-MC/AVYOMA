import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Drawer, Modal } from '../../components/Modal';
import { Building2, User, TrendingUp, FileText, FolderOpen, Clock, Plus, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { addAccount } from '../../services/storageService';

export const AccountsView = ({ accounts, contacts, opportunities, proposals, onRefresh }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newAccForm, setNewAccForm] = useState({
    companyName: '', legalName: '', industry: 'Defence', sector: 'Systems Integration',
    companyType: 'OEM', city: 'Bengaluru', website: '', taxId: '', annualRevenue: 500000000
  });

  const columns = [
    { header: 'Account ID', field: 'id', width: '120px', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    {
      header: 'Company Name', field: 'companyName', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.legalName}</div>
        </div>
      )
    },
    { header: 'Industry', field: 'industry' },
    { header: 'Company Type', field: 'companyType', render: (val) => <span className="badge badge-purple">{val}</span> },
    { header: 'Location', field: 'city' },
    { header: 'Revenue', field: 'annualRevenue', render: (val) => <span className="num-tabular" style={{ fontWeight: 600 }}>{formatCurrency(val, 'INR', true)}</span> },
    { header: 'Owner', field: 'accountOwner' },
    { header: 'Status', field: 'accountStatus', render: (val) => <StatusBadge status={val} /> }
  ];

  const handleCreateAccount = (e) => {
    e.preventDefault();
    addAccount({
      ...newAccForm,
      annualRevenue: Number(newAccForm.annualRevenue)
    });
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  // Associated Data for Selected Account
  const accContacts = selectedAccount ? contacts.filter(c => c.accountId === selectedAccount.id) : [];
  const accOpps = selectedAccount ? opportunities.filter(o => o.accountId === selectedAccount.id || o.account === selectedAccount.companyName) : [];
  const accProps = selectedAccount ? proposals.filter(p => p.customer === selectedAccount.companyName) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Accounts & Companies ({accounts.length})</h2>
          <div className="page-subtitle">B2B enterprise directory for Defence OEMs, Aerospace contractors, and Suppliers</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Account
          </button>
        </div>
      </div>

      {/* Accounts Directory Table */}
      <DataTable
        columns={columns}
        data={accounts}
        onRowClick={(row) => { setSelectedAccount(row); setActiveTab('overview'); }}
        searchPlaceholder="Search companies by name, tax ID, city..."
      />

      {/* Account Profile Drawer / Detail Modal */}
      {selectedAccount && (
        <Drawer
          isOpen={Boolean(selectedAccount)}
          onClose={() => setSelectedAccount(null)}
          title={`Account: ${selectedAccount.companyName}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header Summary Card */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>{selectedAccount.companyName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedAccount.legalName}</div>
                </div>
                <StatusBadge status={selectedAccount.accountStatus} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {selectedAccount.city}, {selectedAccount.country}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={14} /> {selectedAccount.website || 'N/A'}</span>
              </div>
            </div>

            {/* Account Detail Tabs */}
            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', overflowX: 'auto' }}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'contacts', label: `Contacts (${accContacts.length})` },
                { id: 'opportunities', label: `Opportunities (${accOpps.length})` },
                { id: 'proposals', label: `Proposals (${accProps.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>INDUSTRY & SECTOR</div>
                    <div style={{ fontWeight: 600 }}>{selectedAccount.industry} • {selectedAccount.sector}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>COMPANY TYPE</div>
                    <div style={{ fontWeight: 600 }}>{selectedAccount.companyType}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>GST / TAX ID</div>
                    <div className="font-mono">{selectedAccount.taxId || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ANNUAL REVENUE</div>
                    <div style={{ fontWeight: 700 }} className="num-tabular">{formatCurrency(selectedAccount.annualRevenue, 'INR', true)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ACCOUNT OWNER</div>
                    <div style={{ fontWeight: 600 }}>{selectedAccount.accountOwner}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CREATED DATE</div>
                    <div>{formatDate(selectedAccount.createdDate)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Contacts */}
            {activeTab === 'contacts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accContacts.map(c => (
                  <div key={c.id} style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.designation} • {c.department}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary-blue)', marginTop: '4px' }}>{c.email} • {c.phone}</div>
                  </div>
                ))}
                {accContacts.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No contacts linked.</div>}
              </div>
            )}

            {/* Tab 3: Opportunities */}
            {activeTab === 'opportunities' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accOpps.map(o => (
                  <div key={o.id} style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{o.opportunityName}</span>
                      <span style={{ fontWeight: 700 }} className="num-tabular">{formatCurrency(o.opportunityValue)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Stage: {o.salesStage} • Prob: {o.probability}%</div>
                  </div>
                ))}
                {accOpps.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No active opportunities.</div>}
              </div>
            )}

            {/* Tab 4: Proposals */}
            {activeTab === 'proposals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accProps.map(p => (
                  <div key={p.id} style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="font-mono" style={{ fontWeight: 600, fontSize: '13px' }}>{p.proposalNumber}</span>
                      <span style={{ fontWeight: 700 }} className="num-tabular">{formatCurrency(p.grandTotal)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Status: {p.status} • Valid until: {formatDate(p.validUntil)}</div>
                  </div>
                ))}
                {accProps.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No proposals submitted yet.</div>}
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Account Profile"
          maxWidth="540px"
        >
          <form onSubmit={handleCreateAccount}>
            <div className="form-group">
              <label className="form-label form-label-required">Company Name</label>
              <input type="text" className="input-field" required value={newAccForm.companyName} onChange={e => setNewAccForm({ ...newAccForm, companyName: e.target.value })} placeholder="e.g. Dynamatic Technologies Ltd" />
            </div>
            <div className="form-group">
              <label className="form-label">Legal Name</label>
              <input type="text" className="input-field" value={newAccForm.legalName} onChange={e => setNewAccForm({ ...newAccForm, legalName: e.target.value })} placeholder="Legal registered company entity" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select className="select-field" value={newAccForm.industry} onChange={e => setNewAccForm({ ...newAccForm, industry: e.target.value })}>
                  <option value="Defence">Defence</option>
                  <option value="Aerospace">Aerospace</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Company Type</label>
                <select className="select-field" value={newAccForm.companyType} onChange={e => setNewAccForm({ ...newAccForm, companyType: e.target.value })}>
                  <option value="OEM">OEM</option>
                  <option value="Defence Organization">Defence Organization</option>
                  <option value="Customer">Customer</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input type="text" className="input-field" value={newAccForm.city} onChange={e => setNewAccForm({ ...newAccForm, city: e.target.value })} placeholder="e.g. Bengaluru" />
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Account</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
