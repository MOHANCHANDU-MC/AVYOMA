// Document Vault System Constants & Enums
// Avyoma Systems Private Limited

export const VAULT_CATEGORIES = [
  { id: 'cat-01', name: 'Legal Documents', code: 'LEGAL', description: 'Corporate, statutory, and legal filings' },
  { id: 'cat-02', name: 'Contracts & Agreements', code: 'CONTRACTS', description: 'B2B agreements, NDAs, MoUs, and SLAs' },
  { id: 'cat-03', name: 'Finance & Accounting', code: 'FINANCE', description: 'Financial statements, tax audits, and ledgers' },
  { id: 'cat-04', name: 'HR & Employee Records', code: 'HR', description: 'Personnel files, payroll, and compliance' },
  { id: 'cat-05', name: 'Procurement Documents', code: 'PROCUREMENT', description: 'Purchase orders, RFQs, and vendor quotes' },
  { id: 'cat-06', name: 'Vendor Documents', code: 'VENDOR', description: 'Supplier onboarding, ISO certificates, and audits' },
  { id: 'cat-07', name: 'Tender Documents', code: 'TENDER', description: 'Government tenders, EOI, and bid proposals' },
  { id: 'cat-08', name: 'Compliance & Certifications', code: 'COMPLIANCE', description: 'AS9100, ISO9001, CMMI, and DGCA certificates' },
  { id: 'cat-09', name: 'Defence & Aerospace Documentation', code: 'DEFENCE_AERO', description: 'Military specs, MIL-STD, ITAR, and DRDO specs' },
  { id: 'cat-10', name: 'Engineering Drawings', code: 'ENGINEERING', description: 'CAD models, 2D/3D schematics, and GERBER files' },
  { id: 'cat-11', name: 'Technical Specifications', code: 'TECH_SPEC', description: 'Datasheets, ICDs, and software architecture specs' },
  { id: 'cat-12', name: 'Quality Management Documents', code: 'QUALITY', description: 'Inspection reports, CMM reports, and NCR files' },
  { id: 'cat-13', name: 'Manufacturing Documents', code: 'MANUFACTURING', description: 'Bill of Materials (BOM), work instructions, route sheets' },
  { id: 'cat-14', name: 'Project Documentation', code: 'PROJECT', description: 'Project charters, milestones, and progress reports' },
  { id: 'cat-15', name: 'Standard Operating Procedures', code: 'SOP', description: 'Factory SOPs, safety protocols, and lab guides' },
  { id: 'cat-16', name: 'Policies & Manuals', code: 'POLICY', description: 'Company policies, cybersecurity guidelines, handbook' },
  { id: 'cat-17', name: 'Reports & Presentations', code: 'REPORT', description: 'Board decks, R&D progress, quarterly reviews' },
  { id: 'cat-18', name: 'General Documents', code: 'GENERAL', description: 'Uncategorized corporate documentation' }
];

export const CONFIDENTIALITY_LEVELS = {
  PUBLIC: { id: 'PUBLIC', label: 'Public', color: 'gray', badgeBg: 'rgba(241, 245, 249, 0.9)', text: '#475569', icon: 'Globe' },
  INTERNAL: { id: 'INTERNAL', label: 'Internal Use Only', color: 'blue', badgeBg: 'rgba(239, 246, 255, 0.9)', text: '#1D4ED8', icon: 'Building2' },
  CONFIDENTIAL: { id: 'CONFIDENTIAL', label: 'Confidential', color: 'amber', badgeBg: 'rgba(254, 243, 199, 0.9)', text: '#B45309', icon: 'Lock' },
  RESTRICTED: { id: 'RESTRICTED', label: 'Restricted (Defence / Proprietary)', color: 'red', badgeBg: 'rgba(254, 226, 226, 0.9)', text: '#B91C1C', icon: 'ShieldAlert' }
};

export const APPROVAL_STATUSES = {
  DRAFT: { id: 'DRAFT', label: 'Draft', badgeClass: 'badge-gray', color: '#64748B' },
  SUBMITTED: { id: 'SUBMITTED', label: 'Submitted for Review', badgeClass: 'badge-blue', color: '#2563EB' },
  UNDER_REVIEW: { id: 'UNDER_REVIEW', label: 'Under Review', badgeClass: 'badge-purple', color: '#8B5CF6' },
  CHANGES_REQUESTED: { id: 'CHANGES_REQUESTED', label: 'Changes Requested', badgeClass: 'badge-amber', color: '#F59E0B' },
  APPROVED: { id: 'APPROVED', label: 'Approved', badgeClass: 'badge-green', color: '#10B981' },
  REJECTED: { id: 'REJECTED', label: 'Rejected', badgeClass: 'badge-red', color: '#EF4444' },
  ARCHIVED: { id: 'ARCHIVED', label: 'Archived', badgeClass: 'badge-gray', color: '#475569' }
};

export const USER_ROLES = {
  ORG_ADMIN: 'Organization Administrator',
  DOC_ADMIN: 'Document Administrator',
  DEPT_MANAGER: 'Department Manager',
  PROJECT_MANAGER: 'Project Manager',
  APPROVER: 'Document Approver',
  EMPLOYEE: 'Standard Employee',
  AUDITOR: 'Compliance Auditor',
  READ_ONLY: 'Read-Only Viewer'
};

export const SUPPORTED_FILE_TYPES = [
  { extension: 'pdf', label: 'PDF Document', mime: 'application/pdf', icon: 'FileText', category: 'Document' },
  { extension: 'docx', label: 'Word Document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'FileText', category: 'Document' },
  { extension: 'xlsx', label: 'Excel Spreadsheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'FileSpreadsheet', category: 'Spreadsheet' },
  { extension: 'pptx', label: 'PowerPoint Deck', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: 'Presentation', category: 'Presentation' },
  { extension: 'png', label: 'PNG Image', mime: 'image/png', icon: 'Image', category: 'Image' },
  { extension: 'jpg', label: 'JPEG Image', mime: 'image/jpeg', icon: 'Image', category: 'Image' },
  { extension: 'svg', label: 'SVG Vector', mime: 'image/svg+xml', icon: 'Image', category: 'Image' },
  { extension: 'zip', label: 'Archive Zip', mime: 'application/zip', icon: 'Archive', category: 'Archive' },
  { extension: 'dxf', label: 'CAD Drawing (DXF/DWG)', mime: 'application/dxf', icon: 'Compass', category: 'Engineering' },
  { extension: 'step', label: '3D STEP Model', mime: 'application/step', icon: 'Box', category: 'Engineering' }
];
