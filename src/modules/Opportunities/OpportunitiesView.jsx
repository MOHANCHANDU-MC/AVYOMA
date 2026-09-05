import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StageBadge, PriorityBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate, STAGE_CONFIG } from '../../utils/formatters';
import { Drawer, Modal } from '../../components/Modal';
import { Plus, TrendingUp, DollarSign, Calendar, Shield, Building2, User } from 'lucide-react';
import { addOpportunity, updateOpportunityStage } from '../../services/storageService';

export const OpportunitiesView = ({ opportunities, onRefresh, onNavigateToKanban }) => {
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newOppForm, setNewOppForm] = useState({
    opportunityName: '', account: 'Hindustan Aeronautics Ltd (HAL)', owner: 'Kavya R.',
    industry: 'Aerospace', description: '', opportunityValue: 5000000, salesStage: 'QUALIFICATION',
    priority: 'High', expectedCloseDate: '2026-11-30', tenderNo: 'HAL/TND/2026/01'
  });

  const columns = [
    { header: 'ID', field: 'id', width: '110px', render: (val) => <span className="font-mono" style={{ fontWeight: 600 }}>{val}</span> },
    {
      header: 'Opportunity Name', field: 'opportunityName', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.account}</div>
        </div>
      )
    },
    { header: 'Industry', field: 'industry' },
    { header: 'Deal Value', field: 'opportunityValue', render: (val, row) => <span className="num-tabular" style={{ fontWeight: 700 }}>{formatCurrency(val, row.currency)}</span> },
    { header: 'Prob.', field: 'probability', render: (val) => <span className="num-tabular" style={{ fontWeight: 600 }}>{val}%</span> },
    { header: 'Weighted Value', field: 'weightedValue', render: (val, row) => <span className="num-tabular" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(val, row.currency, true)}</span> },
    { header: 'Stage', field: 'salesStage', render: (val) => <StageBadge stage={val} /> },
    { header: 'Priority', field: 'priority', render: (val) => <PriorityBadge priority={val} /> },
    { header: 'Expected Close', field: 'expectedCloseDate', render: (val) => formatDate(val) },
    { header: 'Owner', field: 'owner' }
  ];

  const handleCreateOpp = (e) => {
    e.preventDefault();
    addOpportunity({
      ...newOppForm,
      opportunityValue: Number(newOppForm.opportunityValue)
    });
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Opportunities Tracker ({opportunities.length})</h2>
          <div className="page-subtitle">Track deal values, weighted forecast, sales stages, and expected close dates</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={onNavigateToKanban}>
            View Kanban Board
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Opportunity
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={opportunities}
        onRowClick={(row) => setSelectedOpp(row)}
        searchPlaceholder="Search opportunities by name, account, stage..."
      />

      {/* Opportunity Detail Drawer */}
      {selectedOpp && (
        <Drawer
          isOpen={Boolean(selectedOpp)}
          onClose={() => setSelectedOpp(null)}
          title={`Opportunity: ${selectedOpp.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>{selectedOpp.opportunityName}</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{selectedOpp.account}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>DEAL VALUE</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-blue)' }} className="num-tabular">{formatCurrency(selectedOpp.opportunityValue)}</div>
                </div>
                <StageBadge stage={selectedOpp.salesStage} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>PROBABILITY</div>
                <div style={{ fontWeight: 700 }} className="num-tabular">{selectedOpp.probability}%</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>WEIGHTED FORECAST</div>
                <div style={{ fontWeight: 700 }} className="num-tabular">{formatCurrency(selectedOpp.weightedValue)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>EXPECTED CLOSE</div>
                <div>{formatDate(selectedOpp.expectedCloseDate)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>OWNER</div>
                <div>{selectedOpp.owner}</div>
              </div>
            </div>

            {selectedOpp.tenderNo && (
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>DEFENCE TENDER METADATA</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }} className="font-mono">Tender #: {selectedOpp.tenderNo}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Security Classification: {selectedOpp.securityLevel || 'Confidential'}</div>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Add Opportunity Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Opportunity"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateOpp}>
            <div className="form-group">
              <label className="form-label form-label-required">Opportunity Name</label>
              <input type="text" className="input-field" required value={newOppForm.opportunityName} onChange={e => setNewOppForm({ ...newOppForm, opportunityName: e.target.value })} placeholder="e.g. UAV Canopy Structural Assembly" />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Account (Company)</label>
              <input type="text" className="input-field" required value={newOppForm.account} onChange={e => setNewOppForm({ ...newOppForm, account: e.target.value })} placeholder="Hindustan Aeronautics Ltd (HAL)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Opportunity Value (₹)</label>
                <input type="number" className="input-field" value={newOppForm.opportunityValue} onChange={e => setNewOppForm({ ...newOppForm, opportunityValue: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Pipeline Stage</label>
                <select className="select-field" value={newOppForm.salesStage} onChange={e => setNewOppForm({ ...newOppForm, salesStage: e.target.value })}>
                  {Object.keys(STAGE_CONFIG).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Opportunity</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
