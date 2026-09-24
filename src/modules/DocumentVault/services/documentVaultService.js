// Full-Stack Document Vault Service Engine
// Avyoma Systems Private Limited

import {
  INITIAL_FOLDERS,
  INITIAL_DOCUMENTS,
  INITIAL_VERSIONS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RETENTION_POLICIES
} from '../data/vaultSeedData';

import { VAULT_CATEGORIES, CONFIDENTIALITY_LEVELS } from '../data/vaultConstants';

const STORAGE_KEYS = {
  FOLDERS: 'avyoma_vault_folders',
  DOCUMENTS: 'avyoma_vault_documents',
  VERSIONS: 'avyoma_vault_versions',
  APPROVALS: 'avyoma_vault_approvals',
  AUDIT_LOGS: 'avyoma_vault_audit_logs',
  RETENTION: 'avyoma_vault_retention',
  NOTIFICATIONS: 'avyoma_vault_notifications'
};

// Initialize Storage Engine
export const initializeVaultStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.FOLDERS)) {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(INITIAL_FOLDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VERSIONS)) {
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(INITIAL_VERSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPROVALS)) {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(INITIAL_APPROVALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RETENTION)) {
    localStorage.setItem(STORAGE_KEYS.RETENTION, JSON.stringify(INITIAL_RETENTION_POLICIES));
  }
};

const getItems = (key, fallback = []) => {
  initializeVaultStorage();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setItems = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- AUDIT LOGGER ---
export const logVaultAudit = (action, documentId, documentTitle, details, status = 'SUCCESS') => {
  const logs = getItems(STORAGE_KEYS.AUDIT_LOGS);
  const newLog = {
    id: `LOG-${Math.floor(8000 + Math.random() * 2000)}`,
    documentId: documentId || 'N/A',
    documentTitle: documentTitle || 'System Action',
    user: 'Kavya R.',
    userRole: 'CEO / Admin',
    action,
    details,
    status,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  logs.unshift(newLog);
  setItems(STORAGE_KEYS.AUDIT_LOGS, logs);
  return newLog;
};

// --- DASHBOARD STATISTICS ---
export const getVaultDashboardStats = () => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS).filter(d => !d.isDeleted);
  const approvals = getItems(STORAGE_KEYS.APPROVALS).filter(a => a.stage === 'UNDER_REVIEW' || a.stage === 'SUBMITTED');
  
  // Calculate total bytes
  const totalSizeBytes = docs.reduce((acc, d) => acc + (d.fileSizeBytes || 1048576), 0);
  const storageMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const storageGB = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Expiring soon (within 60 days)
  const now = new Date();
  const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const expiringDocs = docs.filter(d => {
    if (!d.expiryDate) return false;
    const exp = new Date(d.expiryDate);
    return exp >= now && exp <= sixtyDaysLater;
  });

  return {
    totalDocuments: docs.length,
    totalStorageFormatted: Number(storageGB) > 1 ? `${storageGB} GB` : `${storageMB} MB`,
    documentsShared: docs.filter(d => d.confidentiality === 'PUBLIC' || d.downloadCount > 10).length,
    pendingApprovals: approvals.length,
    expiringSoonCount: expiringDocs.length,
    recentlyUpdatedCount: docs.filter(d => d.updatedAt && d.updatedAt.startsWith('2026-09')).length
  };
};

// --- DOCUMENTS QUERY & FILTERS ---
export const getVaultDocuments = (options = {}) => {
  let docs = getItems(STORAGE_KEYS.DOCUMENTS);

  if (options.includeDeleted) {
    docs = docs.filter(d => d.isDeleted);
  } else if (options.isArchived !== undefined) {
    docs = docs.filter(d => d.isArchived === options.isArchived && !d.isDeleted);
  } else {
    docs = docs.filter(d => !d.isDeleted);
  }

  if (options.folderId) {
    docs = docs.filter(d => d.folderId === options.folderId);
  }

  if (options.categoryCode) {
    docs = docs.filter(d => d.categoryCode === options.categoryCode);
  }

  if (options.confidentiality) {
    docs = docs.filter(d => d.confidentiality === options.confidentiality);
  }

  if (options.status) {
    docs = docs.filter(d => d.status === options.status);
  }

  if (options.starredOnly) {
    docs = docs.filter(d => d.starred);
  }

  if (options.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    docs = docs.filter(d =>
      (d.title + d.fileName + d.id + d.category + d.department + (d.contractNumber || '') + (d.partNumber || '')).toLowerCase().includes(q)
    );
  }

  return docs;
};

// Toggle Starred
export const toggleStarDocument = (docId) => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    docs[index].starred = !docs[index].starred;
    setItems(STORAGE_KEYS.DOCUMENTS, docs);
    return docs[index];
  }
  return null;
};

// --- DOCUMENT UPLOAD ---
export const uploadVaultDocument = (uploadData, fileObj) => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const id = `DOC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const fileName = uploadData.fileName || (fileObj ? fileObj.name : 'Document.pdf');
  const ext = fileName.split('.').pop().toLowerCase();
  const bytes = fileObj ? fileObj.size : (uploadData.fileSizeBytes || 2450000);
  const formattedSize = bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  const newDoc = {
    id,
    fileName,
    title: uploadData.title || fileName,
    description: uploadData.description || 'Uploaded document record.',
    category: uploadData.category || 'General Documents',
    categoryCode: uploadData.categoryCode || 'GENERAL',
    department: uploadData.department || 'Avionics R&D',
    project: uploadData.project || 'General Operations',
    documentType: uploadData.documentType || 'PDF Document',
    fileExtension: ext,
    fileSize: formattedSize,
    fileSizeBytes: bytes,
    mimeType: fileObj ? fileObj.type : 'application/pdf',
    uploadedBy: 'Kavya R.',
    uploaderRole: 'Finance & System Admin',
    owner: uploadData.owner || 'Kavya R.',
    confidentiality: uploadData.confidentiality || 'INTERNAL',
    version: '1.0',
    status: uploadData.requireApproval ? 'SUBMITTED' : 'APPROVED',
    folderId: uploadData.folderId || null,
    folderPath: uploadData.folderPath || '/',
    effectiveDate: uploadData.effectiveDate || new Date().toISOString().substring(0, 10),
    reviewDate: uploadData.reviewDate || '2027-09-24',
    expiryDate: uploadData.expiryDate || '2029-09-24',
    tags: uploadData.tags ? uploadData.tags.split(',').map(t => t.trim()) : ['Avyoma', 'Document'],
    contractNumber: uploadData.contractNumber || '',
    partNumber: uploadData.partNumber || '',
    drawingNumber: uploadData.drawingNumber || '',
    revisionNumber: uploadData.revisionNumber || 'Rev 1.0',
    applicableStandard: uploadData.applicableStandard || 'AS9100D / ISO9001',
    isArchived: false,
    isDeleted: false,
    starred: false,
    downloadCount: 0,
    viewCount: 1,
    checksumSHA256: `sha256-${Math.random().toString(36).substring(2, 15)}`,
    contentPreviewText: uploadData.contentPreviewText || `PREVIEW FOR ${fileName}. Avyoma Systems Private Limited Confidential Record.`,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  docs.unshift(newDoc);
  setItems(STORAGE_KEYS.DOCUMENTS, docs);

  // Initial Version Entry
  const versions = getItems(STORAGE_KEYS.VERSIONS);
  versions.unshift({
    id: `VER-${id}-1`,
    documentId: id,
    versionNumber: '1.0',
    fileName,
    fileSize: formattedSize,
    uploadedBy: 'Kavya R.',
    uploadedAt: newDoc.updatedAt,
    changeSummary: 'Initial document upload.',
    checksumSHA256: newDoc.checksumSHA256
  });
  setItems(STORAGE_KEYS.VERSIONS, versions);

  // Create Approval Entry if required
  if (uploadData.requireApproval) {
    const approvals = getItems(STORAGE_KEYS.APPROVALS);
    approvals.unshift({
      id: `APR-2026-${Math.floor(200 + Math.random() * 800)}`,
      documentId: id,
      documentTitle: newDoc.title,
      requestedBy: 'Kavya R.',
      assignedApprover: uploadData.assignedApprover || 'Air Cmdr. Rajesh Sharma (Retd)',
      approverRole: 'VP Defence Systems',
      stage: 'SUBMITTED',
      submittedAt: newDoc.updatedAt,
      deadlineAt: '2026-10-05 18:00',
      comments: [
        { id: `CMT-${Date.now()}`, author: 'Kavya R.', text: 'Submitted for managerial & technical review.', timestamp: newDoc.updatedAt }
      ]
    });
    setItems(STORAGE_KEYS.APPROVALS, approvals);
  }

  logVaultAudit('UPLOAD_DOCUMENT', id, newDoc.title, `Uploaded document (${formattedSize}, ${newDoc.confidentiality})`);
  return newDoc;
};

// --- VERSION CONTROL ---
export const getDocumentVersions = (docId) => {
  const versions = getItems(STORAGE_KEYS.VERSIONS);
  return versions.filter(v => v.documentId === docId);
};

export const uploadNewDocumentVersion = (docId, versionData, fileObj) => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const index = docs.findIndex(d => d.id === docId);
  if (index === -1) return null;

  const currentVerNum = parseFloat(docs[index].version || '1.0');
  const nextVerNum = (currentVerNum + 0.1).toFixed(1);
  const fileName = fileObj ? fileObj.name : docs[index].fileName;
  const bytes = fileObj ? fileObj.size : docs[index].fileSizeBytes;
  const formattedSize = bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  const updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  docs[index].version = nextVerNum;
  docs[index].fileName = fileName;
  docs[index].fileSize = formattedSize;
  docs[index].fileSizeBytes = bytes;
  docs[index].updatedAt = updatedAt;

  setItems(STORAGE_KEYS.DOCUMENTS, docs);

  const versions = getItems(STORAGE_KEYS.VERSIONS);
  const newVer = {
    id: `VER-${docId}-${nextVerNum}`,
    documentId: docId,
    versionNumber: nextVerNum,
    fileName,
    fileSize: formattedSize,
    uploadedBy: 'Kavya R.',
    uploadedAt,
    changeSummary: versionData.changeSummary || `Updated document version to v${nextVerNum}`,
    checksumSHA256: `sha256-${Math.random().toString(36).substring(2, 15)}`
  };
  versions.unshift(newVer);
  setItems(STORAGE_KEYS.VERSIONS, versions);

  logVaultAudit('UPLOAD_NEW_VERSION', docId, docs[index].title, `Uploaded new version v${nextVerNum} (${formattedSize})`);
  return newVer;
};

// --- FOLDER MANAGEMENT ---
export const getVaultFolders = () => getItems(STORAGE_KEYS.FOLDERS);

export const createVaultFolder = (folderData) => {
  const folders = getVaultFolders();
  const parent = folders.find(f => f.id === folderData.parentId);
  const parentPath = parent ? parent.path : '';
  const newPath = `${parentPath}/${folderData.name}`;

  const newFolder = {
    id: `fld-${Math.floor(100 + Math.random() * 900)}`,
    name: folderData.name,
    parentId: folderData.parentId || null,
    path: newPath,
    color: folderData.color || '#2563EB',
    department: folderData.department || 'General Operations',
    confidentiality: folderData.confidentiality || 'INTERNAL',
    createdAt: new Date().toISOString().substring(0, 10)
  };

  folders.push(newFolder);
  setItems(STORAGE_KEYS.FOLDERS, folders);
  logVaultAudit('CREATE_FOLDER', 'N/A', newFolder.name, `Created folder at path "${newPath}"`);
  return newFolder;
};

// --- APPROVAL WORKFLOWS ---
export const getVaultApprovals = () => getItems(STORAGE_KEYS.APPROVALS);

export const executeApprovalDecision = (approvalId, decision, commentText) => {
  const approvals = getVaultApprovals();
  const index = approvals.findIndex(a => a.id === approvalId);
  if (index === -1) return null;

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  approvals[index].stage = decision; // APPROVED, CHANGES_REQUESTED, REJECTED
  if (commentText) {
    approvals[index].comments.push({
      id: `CMT-${Date.now()}`,
      author: 'Kavya R.',
      text: commentText,
      timestamp: nowStr
    });
  }

  setItems(STORAGE_KEYS.APPROVALS, approvals);

  // Update linked document status
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const docIdx = docs.findIndex(d => d.id === approvals[index].documentId);
  if (docIdx !== -1) {
    docs[docIdx].status = decision;
    setItems(STORAGE_KEYS.DOCUMENTS, docs);
  }

  logVaultAudit('APPROVAL_DECISION', approvals[index].documentId, approvals[index].documentTitle, `Workflow stage updated to ${decision}`);
  return approvals[index];
};

// --- SOFT DELETE & RESTORE ---
export const softDeleteDocument = (docId) => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    docs[index].isDeleted = true;
    docs[index].deletedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setItems(STORAGE_KEYS.DOCUMENTS, docs);
    logVaultAudit('TRASH_DOCUMENT', docId, docs[index].title, 'Moved document to Trash & Recovery Vault');
    return true;
  }
  return false;
};

export const restoreDocument = (docId) => {
  const docs = getItems(STORAGE_KEYS.DOCUMENTS);
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    docs[index].isDeleted = false;
    delete docs[index].deletedAt;
    setItems(STORAGE_KEYS.DOCUMENTS, docs);
    logVaultAudit('RESTORE_DOCUMENT', docId, docs[index].title, 'Restored document from Trash');
    return true;
  }
  return false;
};

// --- AUDIT LOGS QUERY ---
export const getVaultAuditLogs = () => getItems(STORAGE_KEYS.AUDIT_LOGS);
