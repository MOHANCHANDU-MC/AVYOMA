import React from 'react';
import { getLeadScoreCategory } from '../utils/formatters';

// Status Badge
export const StatusBadge = ({ status, type = 'default' }) => {
  let badgeClass = 'badge-gray';

  const s = (status || '').toLowerCase();

  if (s === 'qualified' || s === 'completed' || s === 'won' || s === 'active' || s === 'accepted') {
    badgeClass = 'badge-green';
  } else if (s === 'engaged' || s === 'contacted' || s === 'in progress' || s === 'negotiation' || s === 'sent' || s === 'viewed') {
    badgeClass = 'badge-blue';
  } else if (s === 'nurturing' || s === 'scheduled' || s === 'proposal' || s === 'internal review' || s === 'in review') {
    badgeClass = 'badge-amber';
  } else if (s === 'unqualified' || s === 'lost' || s === 'cancelled' || s === 'rejected' || s === 'overdue' || s === 'critical') {
    badgeClass = 'badge-red';
  } else if (s === 'converted' || s === 'contract / po' || s === 'contract') {
    badgeClass = 'badge-purple';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot"></span>
      {status || 'Draft'}
    </span>
  );
};

// Priority Badge
export const PriorityBadge = ({ priority }) => {
  let badgeClass = 'badge-gray';
  const p = (priority || '').toLowerCase();

  if (p === 'critical') badgeClass = 'badge-red';
  else if (p === 'high') badgeClass = 'badge-amber';
  else if (p === 'medium') badgeClass = 'badge-blue';
  else if (p === 'low') badgeClass = 'badge-gray';

  return (
    <span className={`badge ${badgeClass}`}>
      {priority || 'Medium'}
    </span>
  );
};

// Score Badge
export const ScoreBadge = ({ score }) => {
  const numScore = Number(score || 0);
  const { label, badgeClass } = getLeadScoreCategory(numScore);

  return (
    <span className={`score-badge ${badgeClass}`}>
      <span>{numScore}</span>
      <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.85 }}>/ 100 • {label}</span>
    </span>
  );
};

// Stage Badge
export const StageBadge = ({ stage }) => {
  let badgeClass = 'badge-blue';
  const st = (stage || '').toUpperCase();

  if (st === 'WON') badgeClass = 'badge-green';
  else if (st === 'LOST') badgeClass = 'badge-red';
  else if (st === 'PROPOSAL' || st === 'NEGOTIATION') badgeClass = 'badge-amber';
  else if (st === 'CONTRACT' || st === 'CONTRACT / PO') badgeClass = 'badge-purple';
  else if (st === 'TECHNICAL EVALUATION') badgeClass = 'badge-purple';

  return (
    <span className={`badge ${badgeClass}`}>
      {stage}
    </span>
  );
};
