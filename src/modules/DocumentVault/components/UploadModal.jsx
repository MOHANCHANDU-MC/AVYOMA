import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { VAULT_CATEGORIES, CONFIDENTIALITY_LEVELS } from '../data/vaultConstants';
import { Upload, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const UploadModal = ({ isOpen, onClose, onUploadSuccess, currentFolder }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryCode: 'DEFENCE_AERO',
    confidentiality: 'RESTRICTED',
    department: 'Aerospace Systems',
    project: 'HAL Tactical UAV (Proj-704)',
    contractNumber: '',
    partNumber: '',
    drawingNumber: '',
    revisionNumber: 'Rev 1.0',
    applicableStandard: 'MIL-STD-810H / AS9100D',
    expiryDate: '2029-09-24',
    requireApproval: true,
    assignedApprover: 'Air Cmdr. Rajesh Sharma (Retd)',
    tags: 'Defence, Spec, Aerospace'
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!form.title) {
        setForm(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!form.title) {
        setForm(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryObj = VAULT_CATEGORIES.find(c => c.code === form.categoryCode) || VAULT_CATEGORIES[0];
    
    onUploadSuccess({
      ...form,
      category: categoryObj.name,
      fileName: selectedFile ? selectedFile.name : `${form.title || 'Document'}.pdf`,
      fileSizeBytes: selectedFile ? selectedFile.size : 2500000,
      folderId: currentFolder ? currentFolder.id : null,
      folderPath: currentFolder ? currentFolder.path : '/'
    }, selectedFile);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document Centre — Defence & Engineering Vault" maxWidth="640px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Drag & Drop File Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          style={{
            border: `2px dashed ${dragOver ? 'var(--primary-blue)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            textAlign: 'center',
            background: dragOver ? 'rgba(239, 246, 255, 0.8)' : 'rgba(248, 250, 252, 0.65)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.15s ease',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('vault-file-input').click()}
        >
          <input
            id="vault-file-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)' }}>
              <Upload size={24} />
            </div>
            {selectedFile ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-dark)' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to process</div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)' }}>Drag & drop document files here or click to browse</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Supports PDF, DOCX, XLSX, PNG, CAD DXF/STEP up to 500 MB</div>
              </div>
            )}
          </div>
        </div>

        {/* Structured Metadata Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label form-label-required">Document Title</label>
            <input
              type="text" className="input-field" required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. HAL Tactical UAV Composite Airframe Specification"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="select-field"
              value={form.categoryCode}
              onChange={e => setForm({ ...form, categoryCode: e.target.value })}
            >
              {VAULT_CATEGORIES.map(c => (
                <option key={c.id} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Confidentiality Classification</label>
            <select
              className="select-field"
              value={form.confidentiality}
              onChange={e => setForm({ ...form, confidentiality: e.target.value })}
            >
              <option value="PUBLIC">Public</option>
              <option value="INTERNAL">Internal Use Only</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="RESTRICTED">Restricted (Defence / Proprietary)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text" className="input-field"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project / Contract</label>
            <input
              type="text" className="input-field"
              value={form.project}
              onChange={e => setForm({ ...form, project: e.target.value })}
            />
          </div>

          {/* Industry Attributes */}
          <div className="form-group">
            <label className="form-label">Contract #</label>
            <input
              type="text" className="input-field"
              value={form.contractNumber}
              onChange={e => setForm({ ...form, contractNumber: e.target.value })}
              placeholder="e.g. AVY/HAL/UAV/2026/099"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Part # / Drawing #</label>
            <input
              type="text" className="input-field"
              value={form.partNumber}
              onChange={e => setForm({ ...form, partNumber: e.target.value })}
              placeholder="e.g. AV-UAV-CS-8041"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description & Summary</label>
            <textarea
              className="textarea-field"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Enter technical summary, key specs, or compliance details..."
            />
          </div>
        </div>

        {/* Workflow & Approval Toggle */}
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 246, 255, 0.7)', border: '1px solid rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Submit for Managerial Review & Approval</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Routes document to designated approver before official sign-off</div>
          </div>
          <input
            type="checkbox"
            checked={form.requireApproval}
            onChange={e => setForm({ ...form, requireApproval: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-blue)' }}
          />
        </div>

        <div className="modal-footer" style={{ margin: '12px -24px -24px -24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Complete Upload & Index</button>
        </div>
      </form>
    </Modal>
  );
};
