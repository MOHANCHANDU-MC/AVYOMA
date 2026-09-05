// Storage & Business Logic Service for Avyoma CRM
import {
  LEADS,
  ACCOUNTS,
  CONTACTS,
  OPPORTUNITIES,
  PROPOSALS,
  ACTIVITIES,
  TASKS,
  PRODUCTS,
  DOCUMENTS,
  AUDIT_LOGS,
  NOTIFICATIONS,
  USERS
} from '../data/seedData';
import { generateId, STAGE_CONFIG } from '../utils/formatters';

const STORAGE_KEYS = {
  LEADS: 'avyoma_crm_leads',
  ACCOUNTS: 'avyoma_crm_accounts',
  CONTACTS: 'avyoma_crm_contacts',
  OPPORTUNITIES: 'avyoma_crm_opportunities',
  PROPOSALS: 'avyoma_crm_proposals',
  ACTIVITIES: 'avyoma_crm_activities',
  TASKS: 'avyoma_crm_tasks',
  PRODUCTS: 'avyoma_crm_products',
  DOCUMENTS: 'avyoma_crm_documents',
  AUDIT_LOGS: 'avyoma_crm_audit_logs',
  NOTIFICATIONS: 'avyoma_crm_notifications',
  SCORING_RULES: 'avyoma_crm_scoring_rules',
  CURRENT_USER: 'avyoma_crm_current_user'
};

// Initialize Storage with Seed Data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(LEADS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(ACCOUNTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(CONTACTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(OPPORTUNITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROPOSALS)) {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(PROPOSALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(ACTIVITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(USERS[0]));
  }
};

// Helper getter & setter
const getItems = (key) => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const setItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Current Active User
export const getCurrentUser = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(USERS[0]));
};

export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

// Audit Log Logger
export const logAudit = (action, details) => {
  const logs = getItems(STORAGE_KEYS.AUDIT_LOGS);
  const currentUser = getCurrentUser();
  const newLog = {
    id: generateId('AUD'),
    user: currentUser.name,
    action,
    details,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  logs.unshift(newLog);
  setItems(STORAGE_KEYS.AUDIT_LOGS, logs);
};

// --- LEADS ---
export const getLeads = () => getItems(STORAGE_KEYS.LEADS);

export const addLead = (leadData) => {
  const leads = getLeads();
  const score = calculateLeadScore(leadData);
  const newLead = {
    id: generateId('LD'),
    createdDate: new Date().toISOString().substring(0, 10),
    leadStatus: 'New',
    priority: 'Medium',
    leadScore: score,
    qualificationStatus: 'Pending',
    ...leadData
  };
  leads.unshift(newLead);
  setItems(STORAGE_KEYS.LEADS, leads);
  logAudit('Created Lead', `Created lead "${newLead.fullName}" (${newLead.company})`);
  return newLead;
};

export const updateLead = (id, updates) => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates };
    if (updates.industry || updates.requirement || updates.estimatedValue) {
      leads[index].leadScore = calculateLeadScore(leads[index]);
    }
    setItems(STORAGE_KEYS.LEADS, leads);
    logAudit('Updated Lead', `Updated details for lead ID ${id}`);
    return leads[index];
  }
  return null;
};

export const deleteLead = (id) => {
  const leads = getLeads().filter(l => l.id !== id);
  setItems(STORAGE_KEYS.LEADS, leads);
  logAudit('Deleted Lead', `Deleted lead ID ${id}`);
};

// Configurable Lead Scoring Engine
export const calculateLeadScore = (lead) => {
  let score = 10; // Base score
  
  // Industry relevance
  const ind = (lead.industry || '').toLowerCase();
  if (ind.includes('defence') || ind.includes('defense')) score += 25;
  else if (ind.includes('aerospace')) score += 25;
  else if (ind.includes('manufacturing')) score += 20;
  else if (ind.includes('industrial')) score += 15;
  else score += 5;

  // Requirement value
  const val = Number(lead.estimatedValue || 0);
  if (val >= 50000000) score += 25; // >= ₹5 Cr
  else if (val >= 10000000) score += 20; // >= ₹1 Cr
  else if (val >= 2500000) score += 10;

  // Status progression
  if (lead.leadStatus === 'Qualified') score += 20;
  else if (lead.leadStatus === 'Engaged') score += 15;
  else if (lead.leadStatus === 'Contacted') score += 10;

  return Math.min(100, Math.max(5, score));
};

// Lead Conversion Flow (Lead -> Account + Contact + Opportunity)
export const convertLead = (leadId, convertOptions = {}) => {
  const leads = getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return null;

  // 1. Create or match Account
  let accounts = getAccounts();
  let existingAcc = accounts.find(a => a.companyName.toLowerCase() === (lead.company || '').toLowerCase());
  let accountId = existingAcc ? existingAcc.id : generateId('ACC');
  
  if (!existingAcc) {
    const newAcc = {
      id: accountId,
      companyName: lead.company || 'Unknown Company',
      legalName: lead.company || 'Unknown Company',
      industry: lead.industry || 'Defence',
      sector: lead.sector || 'Engineering',
      companyType: 'Prospect',
      city: lead.location || 'India',
      country: lead.country || 'India',
      accountOwner: lead.leadOwner || 'Kavya R.',
      accountStatus: 'Active',
      customerType: 'Prospect',
      createdDate: new Date().toISOString().substring(0, 10)
    };
    accounts.unshift(newAcc);
    setItems(STORAGE_KEYS.ACCOUNTS, accounts);
  }

  // 2. Create Contact
  let contacts = getContacts();
  const newContact = {
    id: generateId('CON'),
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    name: lead.fullName || `${lead.firstName} ${lead.lastName}`,
    designation: lead.jobTitle || 'Representative',
    department: 'Business Unit',
    email: lead.email || '',
    phone: lead.phone || '',
    accountId: accountId,
    companyName: lead.company || 'Converted Account',
    role: 'Decision Maker',
    isPrimary: true,
    location: lead.location || ''
  };
  contacts.unshift(newContact);
  setItems(STORAGE_KEYS.CONTACTS, contacts);

  // 3. Create Opportunity
  let opportunities = getOpportunities();
  const newOpp = {
    id: generateId('OPP'),
    opportunityName: `${lead.company} - ${lead.requirement ? lead.requirement.substring(0, 35) + '...' : 'New Defense Opportunity'}`,
    account: lead.company || 'Converted Account',
    accountId: accountId,
    primaryContact: newContact.name,
    contactId: newContact.id,
    owner: lead.leadOwner || 'Kavya R.',
    industry: lead.industry || 'Defence',
    sector: lead.sector || 'Engineering',
    description: lead.requirement || 'Converted from Lead ID ' + lead.id,
    opportunityValue: lead.estimatedValue || 2500000,
    currency: 'INR',
    probability: 20,
    weightedValue: (lead.estimatedValue || 2500000) * 0.2,
    expectedCloseDate: '2026-11-30',
    salesStage: 'QUALIFICATION',
    priority: lead.priority || 'Medium',
    leadSource: lead.leadSource || 'Direct',
    nextStep: 'Schedule technical discovery meeting',
    createdDate: new Date().toISOString().substring(0, 10),
    lastUpdated: new Date().toISOString().substring(0, 10)
  };
  opportunities.unshift(newOpp);
  setItems(STORAGE_KEYS.OPPORTUNITIES, opportunities);

  // 4. Update Lead Status to Converted
  updateLead(leadId, { leadStatus: 'Converted', qualificationStatus: 'Converted' });

  logAudit('Converted Lead', `Converted lead "${lead.fullName}" into Account, Contact, and Opportunity (${newOpp.id})`);

  return { accountId, contactId: newContact.id, opportunityId: newOpp.id };
};

// --- ACCOUNTS ---
export const getAccounts = () => getItems(STORAGE_KEYS.ACCOUNTS);

export const addAccount = (accData) => {
  const accounts = getAccounts();
  const newAcc = {
    id: generateId('ACC'),
    createdDate: new Date().toISOString().substring(0, 10),
    accountStatus: 'Active',
    customerType: 'Prospect',
    ...accData
  };
  accounts.unshift(newAcc);
  setItems(STORAGE_KEYS.ACCOUNTS, accounts);
  logAudit('Created Account', `Created account "${newAcc.companyName}" (${newAcc.id})`);
  return newAcc;
};

// --- CONTACTS ---
export const getContacts = () => getItems(STORAGE_KEYS.CONTACTS);

export const addContact = (contactData) => {
  const contacts = getContacts();
  const newContact = {
    id: generateId('CON'),
    name: `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
    ...contactData
  };
  contacts.unshift(newContact);
  setItems(STORAGE_KEYS.CONTACTS, contacts);
  logAudit('Created Contact', `Created contact "${newContact.name}"`);
  return newContact;
};

// --- OPPORTUNITIES & KANBAN ---
export const getOpportunities = () => getItems(STORAGE_KEYS.OPPORTUNITIES);

export const addOpportunity = (oppData) => {
  const opportunities = getOpportunities();
  const stage = oppData.salesStage || 'NEW';
  const prob = STAGE_CONFIG[stage] ? STAGE_CONFIG[stage].probability : 10;
  const val = Number(oppData.opportunityValue || 0);

  const newOpp = {
    id: generateId('OPP'),
    createdDate: new Date().toISOString().substring(0, 10),
    lastUpdated: new Date().toISOString().substring(0, 10),
    probability: prob,
    weightedValue: (val * prob) / 100,
    currency: 'INR',
    priority: 'Medium',
    ...oppData
  };
  opportunities.unshift(newOpp);
  setItems(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  logAudit('Created Opportunity', `Created opportunity "${newOpp.opportunityName}" (${newOpp.id})`);
  return newOpp;
};

export const updateOpportunityStage = (oppId, newStage, reason = '') => {
  const opportunities = getOpportunities();
  const index = opportunities.findIndex(o => o.id === oppId);
  if (index !== -1) {
    const oldStage = opportunities[index].salesStage;
    const prob = STAGE_CONFIG[newStage] ? STAGE_CONFIG[newStage].probability : 0;
    const val = Number(opportunities[index].opportunityValue || 0);

    opportunities[index].salesStage = newStage;
    opportunities[index].probability = prob;
    opportunities[index].weightedValue = (val * prob) / 100;
    opportunities[index].lastUpdated = new Date().toISOString().substring(0, 10);

    if (newStage === 'LOST' && reason) {
      opportunities[index].lostReason = reason;
    }

    setItems(STORAGE_KEYS.OPPORTUNITIES, opportunities);
    logAudit('Stage Changed', `Moved opportunity ${oppId} from ${oldStage} → ${newStage}`);
    return opportunities[index];
  }
  return null;
};

// --- PROPOSALS ---
export const getProposals = () => getItems(STORAGE_KEYS.PROPOSALS);

export const addProposal = (propData) => {
  const proposals = getProposals();
  const newProp = {
    id: generateId('PRP'),
    proposalNumber: `AVY-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    proposalDate: new Date().toISOString().substring(0, 10),
    status: 'Draft',
    ...propData
  };
  proposals.unshift(newProp);
  setItems(STORAGE_KEYS.PROPOSALS, proposals);
  logAudit('Created Proposal', `Generated proposal ${newProp.proposalNumber} for ${newProp.customer}`);
  return newProp;
};

// --- ACTIVITIES & TASKS ---
export const getActivities = () => getItems(STORAGE_KEYS.ACTIVITIES);

export const addActivity = (actData) => {
  const activities = getActivities();
  const newAct = {
    id: generateId('ACT'),
    date: new Date().toISOString().substring(0, 10),
    status: 'Completed',
    ...actData
  };
  activities.unshift(newAct);
  setItems(STORAGE_KEYS.ACTIVITIES, activities);
  logAudit('Logged Activity', `Logged ${newAct.type} - "${newAct.subject}"`);
  return newAct;
};

export const getTasks = () => getItems(STORAGE_KEYS.TASKS);

export const addTask = (taskData) => {
  const tasks = getTasks();
  const newTask = {
    id: generateId('TSK'),
    status: 'To Do',
    priority: 'Medium',
    ...taskData
  };
  tasks.unshift(newTask);
  setItems(STORAGE_KEYS.TASKS, tasks);
  logAudit('Created Task', `Created task "${newTask.title}"`);
  return newTask;
};

export const updateTaskStatus = (id, status) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].status = status;
    setItems(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  }
  return null;
};

// --- PRODUCTS, DOCUMENTS, AUDIT LOGS, NOTIFICATIONS ---
export const getProducts = () => getItems(STORAGE_KEYS.PRODUCTS);
export const getDocuments = () => getItems(STORAGE_KEYS.DOCUMENTS);
export const getAuditLogs = () => getItems(STORAGE_KEYS.AUDIT_LOGS);
export const getNotifications = () => getItems(STORAGE_KEYS.NOTIFICATIONS);

export const markNotificationRead = (id) => {
  const notifs = getNotifications();
  const index = notifs.findIndex(n => n.id === id);
  if (index !== -1) {
    notifs[index].read = true;
    setItems(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
};

// Duplicate Detection Helper
export const checkDuplicateAccount = (companyName) => {
  if (!companyName) return null;
  const accounts = getAccounts();
  return accounts.find(a => a.companyName.toLowerCase().trim() === companyName.toLowerCase().trim()) || null;
};

// Reset Storage to Fresh Seed Data
export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEYS.LEADS);
  localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
  localStorage.removeItem(STORAGE_KEYS.CONTACTS);
  localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
  localStorage.removeItem(STORAGE_KEYS.PROPOSALS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  initializeStorage();
  window.location.reload();
};
