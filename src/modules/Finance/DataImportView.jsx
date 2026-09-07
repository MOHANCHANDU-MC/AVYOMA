import React, { useState } from 'react';
import { Upload, CheckCircle2, FileSpreadsheet, AlertTriangle, ArrowRight, Database } from 'lucide-react';
import { logFinanceAudit } from '../../services/financeStorageService';

export const DataImportView = ({ onRefresh }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Validation, 4: Complete
  const [fileName, setFileName] = useState('');
  const [mappings, setMappings] = useState({
    'Trans Date': 'Transaction Date',
    'Ref No': 'Reference / Invoice Number',
    'Party Name': 'Customer / Vendor',
    'Debit Amount': 'Debit (₹)',
    'Credit Amount': 'Credit (₹)',
    'Account Code': 'General Ledger Code'
  });

  const samplePreviewData = [
    { date: '2021-04-15', ref: 'INV-2021-089', party: 'Hindustan Aeronautics Ltd', debit: '₹4,500,000.00', credit: '₹0.00', code: '1200' },
    { date: '2021-05-10', ref: 'BILL-MID-2021-12', party: 'MIDHANI Titanium', debit: '₹0.00', credit: '₹2,800,000.00', code: '2010' },
    { date: '2022-01-20', ref: 'JV-2022-0044', party: 'Bharat Electronics Ltd', debit: '₹12,000,000.00', credit: '₹12,000,000.00', code: '1020' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setStep(2);
    }
  };

  const handleExecuteImport = () => {
    logFinanceAudit('IMPORTED', 'Historical Financial Batch', `IMP-${Date.now()}`, `Imported 342 historical transaction records from ${fileName}`);
    setStep(4);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Data Import Center — Historical Financial Data</h2>
          <div className="page-subtitle">Import 5-10+ years of legacy accounting records, Chart of Accounts, invoices, and bank statements</div>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        {[
          { num: 1, title: 'Upload File' },
          { num: 2, title: 'Map Fields' },
          { num: 3, title: 'Validate Records' },
          { num: 4, title: 'Import Summary' }
        ].map(s => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= s.num ? 1 : 0.4 }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: step >= s.num ? 'var(--primary-blue)' : '#CBD5E1',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px'
            }}>
              {s.num}
            </div>
            <span style={{ fontWeight: step === s.num ? 700 : 500, fontSize: '13px' }}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="prec-card" style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
          <FileSpreadsheet size={48} style={{ color: 'var(--primary-blue)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Upload Historical Financial Data (CSV / XLSX)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Upload accounts, transactions, invoices, or bank statement files</p>

          <input type="file" id="fileUpload" accept=".csv, .xlsx" style={{ display: 'none' }} onChange={handleFileUpload} />
          <label htmlFor="fileUpload" className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Choose File
          </label>
        </div>
      )}

      {/* Step 2: Field Mapping */}
      {step === 2 && (
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Column Mapping ({fileName})</div>
              <div className="card-subtitle">Match columns in your uploaded file with Avyoma Finance Data Schema</div>
            </div>
          </div>

          <table className="prec-table" style={{ marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Uploaded CSV Column Header</th>
                <th>Suggested Avyoma Schema Field</th>
                <th>Match Confidence</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mappings).map(([hdr, field]) => (
                <tr key={hdr}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{hdr}</td>
                  <td>
                    <select className="select-field" defaultValue={field} style={{ maxWidth: '240px' }}>
                      <option value={field}>{field}</option>
                      <option value="Unmapped">Ignore Column</option>
                    </select>
                  </td>
                  <td><span className="badge badge-green">98% High Confidence</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Proceed to Validation</button>
          </div>
        </div>
      )}

      {/* Step 3: Validation Preview */}
      {step === 3 && (
        <div className="prec-card">
          <div className="card-header">
            <div>
              <div className="card-title">Data Validation & Record Preview</div>
              <div className="card-subtitle">342 historical records validated. 0 critical errors found.</div>
            </div>
          </div>

          <table className="prec-table" style={{ marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Trans Date</th>
                <th>Reference #</th>
                <th>Party Name</th>
                <th>Account Code</th>
                <th style={{ textAlign: 'right' }}>Debit</th>
                <th style={{ textAlign: 'right' }}>Credit</th>
              </tr>
            </thead>
            <tbody>
              {samplePreviewData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td className="font-mono">{row.ref}</td>
                  <td style={{ fontWeight: 600 }}>{row.party}</td>
                  <td className="font-mono">{row.code}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{row.debit}</td>
                  <td style={{ textAlign: 'right' }} className="num-tabular">{row.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={handleExecuteImport}>
              Confirm & Import 342 Historical Records
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Import Complete */}
      {step === 4 && (
        <div className="prec-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--status-green)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-green-text)', marginBottom: '4px' }}>Historical Data Import Successful!</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            342 historical financial records were imported into batch <strong>IMP-HIST-2026-09</strong>. General ledger accounts & financial period reports have been updated.
          </p>
          <button className="btn btn-primary" onClick={() => setStep(1)}>Import Another File</button>
        </div>
      )}
    </div>
  );
};
