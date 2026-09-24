import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { CONFIDENTIALITY_LEVELS } from '../data/vaultConstants';
import {
  Download,
  Eye,
  ShieldAlert,
  FileText,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitBranch,
  Calendar,
  User,
  CheckCircle2
} from 'lucide-react';

export const DocumentPreviewModal = ({ document: doc, isOpen, onClose, onDownload, onOpenVersions }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState('preview');

  if (!isOpen || !doc) return null;

  const conf = CONFIDENTIALITY_LEVELS[doc.confidentiality] || CONFIDENTIALITY_LEVELS.INTERNAL;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Document Viewer — ${doc.title}`} maxWidth="840px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: conf.badgeBg,
              color: conf.text
            }}>
              {conf.label}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)' }}>
              v{doc.version} • {doc.fileSize}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(226, 232, 240, 0.6)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
              <button
                className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('preview')}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                Document Preview
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'metadata' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('metadata')}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                Metadata & Specs
              </button>
            </div>

            {/* Zoom controls */}
            {activeTab === 'preview' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setZoomLevel(z => Math.max(50, z - 25))}>
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '11px', fontWeight: 600, width: '40px', textAlign: 'center' }} className="num-tabular">
                  {zoomLevel}%
                </span>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setZoomLevel(z => Math.min(200, z + 25))}>
                  <ZoomIn size={14} />
                </button>
              </div>
            )}

            <button className="btn btn-primary btn-sm" onClick={() => onDownload(doc)} style={{ gap: '4px' }}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Document Render Window */}
        {activeTab === 'preview' && (
          <div style={{
            minHeight: '400px',
            maxHeight: '520px',
            overflowY: 'auto',
            background: 'rgba(11, 18, 32, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '24px',
            color: '#F8FAFC',
            boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Watermark Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={14} />
                <span>RESTRICTED WATERMARK: SESSION AUTHORIZED FOR KAVYA R. (AV-2026-SYS)</span>
              </div>
              <span className="font-mono">SHA256: {doc.checksumSHA256?.substring(0, 16)}...</span>
            </div>

            {/* Document Content Simulation View */}
            <div style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
              padding: '24px',
              background: '#FFFFFF',
              color: '#111827',
              borderRadius: 'var(--radius-md)',
              minHeight: '340px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              lineHeight: 1.6,
              fontSize: '13.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0B1220', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#0B1220' }}>AVYOMA SYSTEMS PRIVATE LIMITED</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Defence, Aerospace & Engineering Document Vault</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748B' }}>
                  <div style={{ fontWeight: 700, color: '#0B1220' }}>CLASSIFICATION: {doc.confidentiality}</div>
                  <div>Doc ID: {doc.id}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{doc.title}</h3>

              <p style={{ color: '#334155', marginBottom: '16px' }}>
                {doc.contentPreviewText || doc.description}
              </p>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569' }}>
                <div style={{ fontWeight: 600, color: '#0B1220', marginBottom: '4px' }}>Technical Parameters & Compliance:</div>
                <div>• Applicable Standard: {doc.applicableStandard || 'MIL-STD-810H / AS9100D'}</div>
                <div>• Contract Number: {doc.contractNumber || 'AVY/HAL/UAV/2026/099'}</div>
                <div>• Part Number: {doc.partNumber || 'AV-UAV-CS-8041'} • Revision: {doc.revisionNumber || 'Rev C'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Metadata & Engineering Attributes */}
        {activeTab === 'metadata' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>DOCUMENT TITLE</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginTop: '2px' }}>{doc.title}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>FILE NAME & SIZE</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginTop: '2px' }}>{doc.fileName} ({doc.fileSize})</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>CATEGORY</div>
              <div style={{ fontWeight: 600, color: 'var(--primary-blue)', marginTop: '2px' }}>{doc.category}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>DEPARTMENT / PROJECT</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginTop: '2px' }}>{doc.department} • {doc.project}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>CONTRACT #</div>
              <div style={{ fontWeight: 600 }} className="font-mono">{doc.contractNumber || 'N/A'}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>PART # / DRAWING #</div>
              <div style={{ fontWeight: 600 }} className="font-mono">{doc.partNumber || doc.drawingNumber || 'N/A'}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>EXPIRY DATE</div>
              <div style={{ fontWeight: 600, color: 'var(--status-amber-text)' }}>{doc.expiryDate || 'No Expiry'}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(248, 250, 252, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>DOCUMENT OWNER</div>
              <div style={{ fontWeight: 600 }}>{doc.owner}</div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
