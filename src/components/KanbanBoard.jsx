import React, { useState } from 'react';
import { formatCurrency, formatDate, STAGE_CONFIG } from '../utils/formatters';
import { PriorityBadge, StageBadge } from './StatusBadge';
import { ConfirmDialog, Modal } from './Modal';
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, Building2, Calendar, User } from 'lucide-react';

export const KanbanBoard = ({ opportunities, onStageChange, onSelectOpportunity }) => {
  const [draggedOppId, setDraggedOppId] = useState(null);
  const [targetStage, setTargetStage] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [lostReason, setLostReason] = useState('');

  const stages = [
    'NEW',
    'QUALIFICATION',
    'DISCOVERY',
    'TECHNICAL EVALUATION',
    'PROPOSAL',
    'NEGOTIATION',
    'CONTRACT',
    'WON'
  ];

  const handleDragStart = (e, oppId) => {
    setDraggedOppId(oppId);
    e.dataTransfer.setData('text/plain', oppId);
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    setTargetStage(stage);
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();
    const oppId = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (!oppId) return;

    const opp = opportunities.find(o => o.id === oppId);
    if (!opp || opp.salesStage === newStage) return;

    if (newStage === 'WON' || newStage === 'LOST') {
      setPendingMove({ opp, newStage });
    } else {
      onStageChange(opp.id, newStage);
    }
    setDraggedOppId(null);
    setTargetStage(null);
  };

  const confirmMove = (reason = '') => {
    if (pendingMove) {
      onStageChange(pendingMove.opp.id, pendingMove.newStage, reason);
      setPendingMove(null);
      setLostReason('');
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        alignItems: 'flex-start',
        minHeight: '650px'
      }}>
        {stages.map((stageKey) => {
          const config = STAGE_CONFIG[stageKey] || { label: stageKey, probability: 0 };
          const columnOpps = opportunities.filter(o => (o.salesStage || '').toUpperCase() === stageKey);
          const totalVal = columnOpps.reduce((acc, o) => acc + Number(o.opportunityValue || 0), 0);

          return (
            <div
              key={stageKey}
              onDragOver={(e) => handleDragOver(e, stageKey)}
              onDrop={(e) => handleDrop(e, stageKey)}
              style={{
                flex: '0 0 280px',
                backgroundColor: targetStage === stageKey ? '#EFF6FF' : '#F1F5F9',
                borderRadius: 'var(--radius-lg)',
                padding: '12px',
                border: targetStage === stageKey ? '2px dashed var(--primary-blue)' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Stage Header */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {config.label}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }} className="num-tabular">
                    {config.probability}%
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>{columnOpps.length} deals</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }} className="num-tabular">
                    {formatCurrency(totalVal, 'INR', true)}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '400px' }}>
                {columnOpps.map((opp) => (
                  <div
                    key={opp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp.id)}
                    onClick={() => onSelectOpportunity && onSelectOpportunity(opp)}
                    className="prec-card prec-card-hover"
                    style={{
                      padding: '12px 14px',
                      cursor: 'grab',
                      backgroundColor: '#FFFFFF',
                      borderLeft: `4px solid ${stageKey === 'WON' ? 'var(--status-green)' : stageKey === 'PROPOSAL' ? 'var(--status-amber)' : 'var(--primary-blue)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {opp.id}
                      </span>
                      <PriorityBadge priority={opp.priority} />
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginBottom: '4px', lineHeight: 1.3 }}>
                      {opp.opportunityName}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <Building2 size={13} />
                      <span>{opp.account}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }} className="num-tabular">
                          {formatCurrency(opp.opportunityValue, opp.currency, true)}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Weighted: {formatCurrency(opp.weightedValue, opp.currency, true)}
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} />
                          <span>{opp.owner ? opp.owner.split(' ')[0] : 'Unassigned'}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {formatDate(opp.expectedCloseDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {columnOpps.length === 0 && (
                  <div style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-muted)',
                    fontSize: '12px'
                  }}>
                    Drag deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Won / Lost Confirmation Modal */}
      {pendingMove && (
        <Modal
          isOpen={Boolean(pendingMove)}
          onClose={() => setPendingMove(null)}
          title={pendingMove.newStage === 'WON' ? 'Mark Opportunity as WON 🎉' : 'Mark Opportunity as LOST'}
          maxWidth="460px"
        >
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-dark)', marginBottom: '12px' }}>
              Are you sure you want to move <strong>"{pendingMove.opp.opportunityName}"</strong> ({formatCurrency(pendingMove.opp.opportunityValue)}) to stage <strong>{pendingMove.newStage}</strong>?
            </p>

            {pendingMove.newStage === 'LOST' && (
              <div className="form-group">
                <label className="form-label form-label-required">Reason for Loss</label>
                <select className="select-field" value={lostReason} onChange={(e) => setLostReason(e.target.value)}>
                  <option value="">Select Lost Reason...</option>
                  <option value="Price Too High">Price / Budget Constraints</option>
                  <option value="Competitor Won">Competitor Selected (Astra Microwave / Maini)</option>
                  <option value="Technical Non-Compliance">Technical Non-Compliance</option>
                  <option value="Tender Cancelled">Government Tender Cancelled / Delayed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setPendingMove(null)}>Cancel</button>
            <button
              className={`btn ${pendingMove.newStage === 'WON' ? 'btn-primary' : 'btn-danger'}`}
              disabled={pendingMove.newStage === 'LOST' && !lostReason}
              onClick={() => confirmMove(lostReason)}
            >
              Confirm Stage Change
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
