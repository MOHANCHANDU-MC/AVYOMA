import React from 'react';
import { KanbanBoard } from '../../components/KanbanBoard';
import { updateOpportunityStage } from '../../services/storageService';

export const PipelineView = ({ opportunities, onRefresh, onSelectOpportunity }) => {
  const handleStageChange = (oppId, newStage, reason = '') => {
    updateOpportunityStage(oppId, newStage, reason);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Sales Pipeline Kanban Board</h2>
          <div className="page-subtitle">Drag and drop opportunities between stages to update deal probabilities and sales forecast</div>
        </div>
      </div>

      <KanbanBoard
        opportunities={opportunities}
        onStageChange={handleStageChange}
        onSelectOpportunity={onSelectOpportunity}
      />
    </div>
  );
};
