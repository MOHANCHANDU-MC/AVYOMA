import React from 'react';
import { UploadModal } from '../components/UploadModal';
import { Upload, FileText, CheckCircle2, Shield } from 'lucide-react';

export const UploadCentreView = ({ onUploadSuccess }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-surface-l1" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={28} />
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-dark)' }}>Batch Document Upload & Classification Centre</h3>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '4px auto 0 auto' }}>
            Upload technical drawings, contracts, test reports, and military specifications with full AS9100D metadata indexing and SHA-256 integrity verification.
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('batch-upload-trigger').click()} style={{ gap: '8px' }}>
          <Upload size={18} /> Launch Upload Centre
        </button>
        <input id="batch-upload-trigger" type="file" style={{ display: 'none' }} onChange={() => {}} />
      </div>

      <UploadModal isOpen={true} onClose={() => {}} onUploadSuccess={onUploadSuccess} />
    </div>
  );
};
