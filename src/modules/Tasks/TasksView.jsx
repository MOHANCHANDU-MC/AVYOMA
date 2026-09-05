import React, { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../../components/Modal';
import { Plus, CheckSquare, Clock, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { addTask, updateTaskStatus } from '../../services/storageService';

export const TasksView = ({ tasks, onRefresh }) => {
  const [viewMode, setViewMode] = useState('LIST'); // LIST or OVERDUE
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '', description: '', assignedTo: 'Kavya R.', relatedAccount: 'Hindustan Aeronautics Ltd (HAL)',
    dueDate: '2026-09-15', priority: 'High'
  });

  const todayStr = new Date().toISOString().substring(0, 10);

  const filteredTasks = tasks.filter(task => {
    if (viewMode === 'OVERDUE') return task.dueDate < todayStr && task.status !== 'Completed';
    return true;
  });

  const columns = [
    { header: 'Task ID', field: 'id', width: '100px', render: (val) => <span className="font-mono">{val}</span> },
    {
      header: 'Task Title', field: 'title', render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: row.dueDate < todayStr && row.status !== 'Completed' ? 'var(--status-red)' : 'var(--text-dark)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.relatedAccount || 'Internal Task'}</div>
        </div>
      )
    },
    { header: 'Assigned To', field: 'assignedTo' },
    {
      header: 'Due Date', field: 'dueDate', render: (val, row) => {
        const isOverdue = val < todayStr && row.status !== 'Completed';
        return (
          <span style={{ color: isOverdue ? 'var(--status-red)' : 'var(--text-dark)', fontWeight: isOverdue ? 700 : 400 }}>
            {formatDate(val)} {isOverdue && '(Overdue)'}
          </span>
        );
      }
    },
    { header: 'Priority', field: 'priority', render: (val) => <PriorityBadge priority={val} /> },
    { header: 'Status', field: 'status', render: (val) => <StatusBadge status={val} /> },
    {
      header: 'Actions', field: 'id', sortable: false, render: (_, row) => (
        <button
          className={`btn btn-sm ${row.status === 'Completed' ? 'btn-ghost' : 'btn-secondary'}`}
          onClick={() => {
            updateTaskStatus(row.id, row.status === 'Completed' ? 'To Do' : 'Completed');
            if (onRefresh) onRefresh();
          }}
        >
          {row.status === 'Completed' ? 'Reopen' : 'Complete'}
        </button>
      )
    }
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    addTask(newTaskForm);
    setIsAddModalOpen(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Task Management ({filteredTasks.length})</h2>
          <div className="page-subtitle">Track operational follow-ups, document uploads, and technical deliverables</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          className={`btn btn-sm ${viewMode === 'LIST' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setViewMode('LIST')}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'OVERDUE' ? 'btn-danger' : 'btn-ghost'}`}
          onClick={() => setViewMode('OVERDUE')}
        >
          ⚠️ Overdue Tasks ({tasks.filter(t => t.dueDate < todayStr && t.status !== 'Completed').length})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        searchPlaceholder="Search tasks by title, assigned person, account..."
      />

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Action Task"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label className="form-label form-label-required">Task Title</label>
              <input type="text" className="input-field" required value={newTaskForm.title} onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })} placeholder="e.g. Upload MIL-SPEC test certificate to HAL proposal" />
            </div>
            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea className="textarea-field" value={newTaskForm.description} onChange={e => setNewTaskForm({ ...newTaskForm, description: e.target.value })} placeholder="Describe details of the task..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="input-field" value={newTaskForm.dueDate} onChange={e => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="select-field" value={newTaskForm.priority} onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
