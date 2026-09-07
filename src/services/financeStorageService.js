// Multi-Tenant Enterprise Finance Storage & Business Logic Service
import { formatFinanceCurrency, validateJournalBalance, calculateAgingBucket } from '../utils/financeFormatters';

const STORAGE_KEYS = {
  ORGANIZATION_ID: 'avyoma_finance_org_id',
  ACCOUNTS: 'avyoma_finance_accounts',
  JOURNALS: 'avyoma_finance_journals',
  CUSTOMERS: 'avyoma_finance_customers',
  VENDORS: 'avyoma_finance_vendors',
  INVOICES: 'avyoma_finance_invoices',
  BILLS: 'avyoma_finance_bills',
  EXPENSES: 'avyoma_finance_expenses',
  INCOME: 'avyoma_finance_income',
  PAYMENTS: 'avyoma_finance_payments',
  BANK_ACCOUNTS: 'avyoma_finance_bank_accounts',
  BANK_TRANSACTIONS: 'avyoma_finance_bank_txns',
  TAXES: 'avyoma_finance_taxes',
  PERIODS: 'avyoma_finance_periods',
  BUDGETS: 'avyoma_finance_budgets',
  COST_CENTERS: 'avyoma_finance_cost_centers',
  AUDIT_LOGS: 'avyoma_finance_audit_logs'
};

const DEFAULT_ORG_ID = 'ORG-AVYOMA-DEFENCE-01';

// Initial Seed Dataset for Enterprise Finance Module
const SEED_ACCOUNTS = [
  // ASSETS (1000-1999)
  { id: 'acc-1010', organizationId: DEFAULT_ORG_ID, accountCode: '1010', accountName: 'Cash on Hand', accountType: 'ASSET', category: 'CASH', currentBalance: 250000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-1020', organizationId: DEFAULT_ORG_ID, accountCode: '1020', accountName: 'SBI Defence Commercial Operating A/c', accountType: 'ASSET', category: 'BANK', currentBalance: 48500000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-1030', organizationId: DEFAULT_ORG_ID, accountCode: '1030', accountName: 'HDFC Escrow A/c - Defence Contracts', accountType: 'ASSET', category: 'BANK', currentBalance: 125000000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-1200', organizationId: DEFAULT_ORG_ID, accountCode: '1200', accountName: 'Accounts Receivable (Trade Debtors)', accountType: 'ASSET', category: 'AR', currentBalance: 65500000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-1300', organizationId: DEFAULT_ORG_ID, accountCode: '1300', accountName: 'Raw Materials & Aerospace Titanium Inventory', accountType: 'ASSET', category: 'INVENTORY', currentBalance: 32000000.00, isSystemAccount: true, isActive: true },
  
  // LIABILITIES (2000-2999)
  { id: 'acc-2010', organizationId: DEFAULT_ORG_ID, accountCode: '2010', accountName: 'Accounts Payable (Trade Creditors)', accountType: 'LIABILITY', category: 'AP', currentBalance: 28400000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-2210', organizationId: DEFAULT_ORG_ID, accountCode: '2210', accountName: 'CGST Output Tax Payable (9%)', accountType: 'LIABILITY', category: 'TAXES_PAYABLE', currentBalance: 5850000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-2220', organizationId: DEFAULT_ORG_ID, accountCode: '2220', accountName: 'SGST Output Tax Payable (9%)', accountType: 'LIABILITY', category: 'TAXES_PAYABLE', currentBalance: 5850000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-2230', organizationId: DEFAULT_ORG_ID, accountCode: '2230', accountName: 'IGST Output Tax Payable (18%)', accountType: 'LIABILITY', category: 'TAXES_PAYABLE', currentBalance: 11200000.00, isSystemAccount: true, isActive: true },

  // EQUITY (3000-3999)
  { id: 'acc-3010', organizationId: DEFAULT_ORG_ID, accountCode: '3010', accountName: 'Share Capital / Founder Equity', accountType: 'EQUITY', category: 'EQUITY', currentBalance: 150000000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-3020', organizationId: DEFAULT_ORG_ID, accountCode: '3020', accountName: 'Retained Earnings', accountType: 'EQUITY', category: 'EQUITY', currentBalance: 88450000.00, isSystemAccount: true, isActive: true },

  // INCOME (4000-4999)
  { id: 'acc-4010', organizationId: DEFAULT_ORG_ID, accountCode: '4010', accountName: 'Defence Systems Sales Revenue', accountType: 'INCOME', category: 'REVENUE', currentBalance: 185000000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-4020', organizationId: DEFAULT_ORG_ID, accountCode: '4020', accountName: 'Aerostructures Engineering & R&D Services', accountType: 'INCOME', category: 'REVENUE', currentBalance: 42000000.00, isSystemAccount: true, isActive: true },

  // EXPENSES (5000-5999)
  { id: 'acc-5010', organizationId: DEFAULT_ORG_ID, accountCode: '5010', accountName: 'Engineering & Manufacturing Personnel Salaries', accountType: 'EXPENSE', category: 'SALARIES', currentBalance: 45000000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-5020', organizationId: DEFAULT_ORG_ID, accountCode: '5020', accountName: 'Raw Material Forging & Sub-assembly Procurement', accountType: 'EXPENSE', category: 'PROCUREMENT', currentBalance: 68000000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-5030', organizationId: DEFAULT_ORG_ID, accountCode: '5030', accountName: 'Cleanroom Facility Lease & Plant Rent', accountType: 'EXPENSE', category: 'RENT', currentBalance: 8500000.00, isSystemAccount: true, isActive: true },
  { id: 'acc-5040', organizationId: DEFAULT_ORG_ID, accountCode: '5040', accountName: 'MIL-STD-810H Compliance & Testing Fees', accountType: 'EXPENSE', category: 'SERVICES', currentBalance: 3200000.00, isSystemAccount: true, isActive: true }
];

const SEED_CUSTOMERS = [
  { id: 'cust-101', organizationId: DEFAULT_ORG_ID, customerCode: 'CUST-HAL-01', name: 'Hindustan Aeronautics Ltd (HAL)', companyName: 'Hindustan Aeronautics Limited', email: 'billing@hal-india.co.in', phone: '+91 80 2232 0001', taxId: '29AAACH0123P1Z1', balance: 65520800.00 },
  { id: 'cust-102', organizationId: DEFAULT_ORG_ID, customerCode: 'CUST-BEL-02', name: 'Bharat Electronics Ltd (BEL)', companyName: 'Bharat Electronics Limited', email: 'finance@bel-india.in', phone: '+91 80 2838 2000', taxId: '29AAACB4567Q1Z8', balance: 124000000.00 },
  { id: 'cust-103', organizationId: DEFAULT_ORG_ID, customerCode: 'CUST-LNT-03', name: 'L&T Defence & Aerospace Systems', companyName: 'Larsen & Toubro Heavy Division', email: 'accounts@larsentoubro.com', phone: '+91 22 6752 5656', taxId: '27AAACL1029R1Z3', balance: 38000000.00 }
];

const SEED_VENDORS = [
  { id: 'vend-201', organizationId: DEFAULT_ORG_ID, vendorCode: 'VEND-MIDHANI-01', name: 'Mishra Dhatu Nigam Ltd (MIDHANI)', companyName: 'Mishra Dhatu Nigam Limited', email: 'sales@midhani.in', phone: '+91 40 2434 0001', taxId: '36AAACM1020K1Z9', balance: 18500000.00 },
  { id: 'vend-202', organizationId: DEFAULT_ORG_ID, vendorCode: 'VEND-MTAR-02', name: 'MTAR Technologies Ltd', companyName: 'MTAR Technologies Limited', email: 'vendors@mtar.in', phone: '+91 40 2307 8888', taxId: '36AAACM8820J1Z4', balance: 9900000.00 }
];

const SEED_INVOICES = [
  {
    id: 'inv-2026-001',
    organizationId: DEFAULT_ORG_ID,
    invoiceNumber: 'INV-2026-00001',
    customerId: 'cust-101',
    customerName: 'Hindustan Aeronautics Ltd (HAL)',
    invoiceDate: '2026-08-25',
    dueDate: '2026-10-25',
    currency: 'INR',
    subtotal: 54920000.00,
    discountTotal: 0.00,
    taxTotal: 9885600.00,
    grandTotal: 64805600.00,
    paidAmount: 20000000.00,
    outstandingAmount: 44805600.00,
    status: 'PARTIALLY_PAID',
    notes: 'UAV Composite Canopy Frame Tooling & Fabrication - Milestone 1 Invoice',
    lines: [
      { id: 'l1', description: 'Carbon Fiber Reinforced Canopy Tooling Mold', quantity: 2, unitPrice: 4500000, taxRate: 18, lineTotal: 10620000 },
      { id: 'l2', description: 'Tactical UAV Main Wing Spar Assembly', quantity: 12, unitPrice: 3800000, taxRate: 18, lineTotal: 53808000 }
    ]
  },
  {
    id: 'inv-2026-002',
    organizationId: DEFAULT_ORG_ID,
    invoiceNumber: 'INV-2026-00002',
    customerId: 'cust-102',
    customerName: 'Bharat Electronics Ltd (BEL)',
    invoiceDate: '2026-09-01',
    dueDate: '2026-09-30',
    currency: 'INR',
    subtotal: 10508474.00,
    discountTotal: 0.00,
    taxTotal: 1891526.00,
    grandTotal: 12400000.00,
    paidAmount: 0.00,
    outstandingAmount: 12400000.00,
    status: 'SENT',
    notes: 'Naval C-Band Radar Frequency Synthesizer Upgrade - Initial Advance',
    lines: [
      { id: 'l3', description: 'Direct Digital Synthesizer Sub-Assembly', quantity: 4, unitPrice: 2627118.5, taxRate: 18, lineTotal: 12400000 }
    ]
  }
];

const SEED_BILLS = [
  {
    id: 'bill-2026-001',
    organizationId: DEFAULT_ORG_ID,
    billNumber: 'BILL-MID-2026-88',
    vendorId: 'vend-201',
    vendorName: 'Mishra Dhatu Nigam Ltd (MIDHANI)',
    billDate: '2026-08-20',
    dueDate: '2026-09-20',
    currency: 'INR',
    subtotal: 15677966.00,
    taxTotal: 2822034.00,
    grandTotal: 18500000.00,
    paidAmount: 5000000.00,
    outstandingAmount: 13500000.00,
    status: 'APPROVED',
    notes: 'Aerospace grade titanium alloy 7075-T6 billets for launch vehicle thrusters',
    lines: [
      { id: 'bl1', description: 'Titanium Forging Billets (ASTM B348 Grade 5)', quantity: 500, unitPrice: 31355.93, taxRate: 18, lineTotal: 18500000 }
    ]
  }
];

const SEED_JOURNALS = [
  {
    id: 'jrn-001',
    organizationId: DEFAULT_ORG_ID,
    journalNumber: 'JV-2026-00101',
    entryDate: '2026-09-01',
    reference: 'REF-HAL-PAY-01',
    description: 'Received Advance Payment from HAL for UAV Canopy Project',
    sourceModule: 'INVOICE_PAYMENT',
    status: 'POSTED',
    totalDebit: 20000000.00,
    totalCredit: 20000000.00,
    createdById: 'Kavya R.',
    lines: [
      { id: 'jl1', accountId: 'acc-1020', accountName: 'SBI Defence Commercial Operating A/c', debit: 20000000.00, credit: 0.00 },
      { id: 'jl2', accountId: 'acc-1200', accountName: 'Accounts Receivable (HAL)', debit: 0.00, credit: 20000000.00 }
    ]
  }
];

const SEED_EXPENSES = [
  { id: 'exp-01', organizationId: DEFAULT_ORG_ID, expenseNumber: 'EXP-2026-089', category: 'Procurement', amount: 1850000.00, taxAmount: 333000.00, expenseDate: '2026-09-02', paymentMethod: 'Bank Transfer', vendorName: 'MIDHANI', department: 'Manufacturing', costCenter: 'Defence Weapons', description: 'Special alloy forging sample batch testing', status: 'APPROVED' },
  { id: 'exp-02', organizationId: DEFAULT_ORG_ID, expenseNumber: 'EXP-2026-090', category: 'Services', amount: 450000.00, taxAmount: 81000.00, expenseDate: '2026-09-04', paymentMethod: 'Corporate Credit Card', vendorName: 'TUV SUD India', department: 'Quality Assurance', costCenter: 'R&D Aerospace', description: 'MIL-STD-810H Environmental Shake Table Certification', status: 'PAID' }
];

const SEED_BANK_ACCOUNTS = [
  { id: 'bank-1', organizationId: DEFAULT_ORG_ID, bankName: 'State Bank of India', accountName: 'SBI Defence Commercial Operating A/c', accountNumber: '•••• •••• 4491', ifscOrSwift: 'SBIN0008892', currency: 'INR', openingBalance: 20000000.00, currentBalance: 48500000.00, isActive: true },
  { id: 'bank-2', organizationId: DEFAULT_ORG_ID, bankName: 'HDFC Bank', accountName: 'HDFC Escrow A/c - Defence Contracts', accountNumber: '•••• •••• 1092', ifscOrSwift: 'HDFC0000124', currency: 'INR', openingBalance: 50000000.00, currentBalance: 125000000.00, isActive: true }
];

const SEED_PERIODS = [
  { id: 'period-1', organizationId: DEFAULT_ORG_ID, periodName: 'FY 2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'CLOSED' },
  { id: 'period-2', organizationId: DEFAULT_ORG_ID, periodName: 'FY 2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'OPEN' }
];

const SEED_COST_CENTERS = [
  { id: 'cc-1', organizationId: DEFAULT_ORG_ID, code: 'CC-AERO-01', name: 'R&D Aerospace & Payloads', description: 'UAVs, Satellite Payload, Aerostructures' },
  { id: 'cc-2', organizationId: DEFAULT_ORG_ID, code: 'CC-DEF-02', name: 'Defence Weapons & Radar', description: 'Naval Radar, Missile Actuators, Ordnance' },
  { id: 'cc-3', organizationId: DEFAULT_ORG_ID, code: 'CC-MFG-03', name: 'Precision Machining Plant', description: '5-Axis CNC Gantry, Cleanroom Lay-up' }
];

const SEED_BUDGETS = [
  { id: 'bud-1', organizationId: DEFAULT_ORG_ID, budgetName: 'R&D Aerospace Payload Budget', fiscalYear: 'FY 2026-2027', department: 'Engineering', totalBudget: 50000000.00, actualAmount: 34200000.00, startDate: '2026-04-01', endDate: '2027-03-31' },
  { id: 'bud-2', organizationId: DEFAULT_ORG_ID, budgetName: 'Radar Electronics Development', fiscalYear: 'FY 2026-2027', department: 'Defence Systems', totalBudget: 80000000.00, actualAmount: 68500000.00, startDate: '2026-04-01', endDate: '2027-03-31' }
];

const SEED_TAXES = [
  { id: 'tax-1', organizationId: DEFAULT_ORG_ID, taxCode: 'CGST_9', taxName: 'Central GST (CGST)', rate: 9.0, taxType: 'OUTPUT_TAX', hsnSacCode: '998339' },
  { id: 'tax-2', organizationId: DEFAULT_ORG_ID, taxCode: 'SGST_9', taxName: 'State GST (SGST)', rate: 9.0, taxType: 'OUTPUT_TAX', hsnSacCode: '998339' },
  { id: 'tax-3', organizationId: DEFAULT_ORG_ID, taxCode: 'IGST_18', taxName: 'Integrated GST (IGST)', rate: 18.0, taxType: 'OUTPUT_TAX', hsnSacCode: '880211' }
];

const SEED_AUDIT_LOGS = [
  { id: 'faud-1', organizationId: DEFAULT_ORG_ID, actorName: 'Kavya R.', action: 'POSTED', entityType: 'Journal Entry', entityId: 'JV-2026-00101', details: 'Posted debits ₹2.00 Cr to SBI Operating A/c', timestamp: '2026-09-01 11:30' },
  { id: 'faud-2', organizationId: DEFAULT_ORG_ID, actorName: 'Rajesh Sharma', action: 'CREATED', entityType: 'Invoice', entityId: 'INV-2026-00002', details: 'Generated ₹1.24 Cr Invoice for BEL Naval Radar', timestamp: '2026-09-01 14:15' }
];

// Data Initialization Helper
export const initializeFinanceStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATION_ID)) {
    localStorage.setItem(STORAGE_KEYS.ORGANIZATION_ID, DEFAULT_ORG_ID);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(SEED_ACCOUNTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(SEED_VENDORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SEED_INVOICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(SEED_BILLS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOURNALS)) {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(SEED_JOURNALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(SEED_BANK_ACCOUNTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PERIODS)) {
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(SEED_PERIODS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COST_CENTERS)) {
    localStorage.setItem(STORAGE_KEYS.COST_CENTERS, JSON.stringify(SEED_COST_CENTERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(SEED_BUDGETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TAXES)) {
    localStorage.setItem(STORAGE_KEYS.TAXES, JSON.stringify(SEED_TAXES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
  }
};

// Generic Tenant Scoped Getter
const getScopedItems = (key) => {
  initializeFinanceStorage();
  const orgId = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_ID) || DEFAULT_ORG_ID;
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  return items.filter(item => item.organizationId === orgId);
};

const setScopedItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Log Audit Action
export const logFinanceAudit = (action, entityType, entityId, details) => {
  const logs = getScopedItems(STORAGE_KEYS.AUDIT_LOGS);
  const newLog = {
    id: `faud-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    actorName: 'Kavya R. (Finance Admin)',
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  logs.unshift(newLog);
  setScopedItems(STORAGE_KEYS.AUDIT_LOGS, logs);
};

// --- CHART OF ACCOUNTS ---
export const getFinanceAccounts = () => getScopedItems(STORAGE_KEYS.ACCOUNTS);

export const addFinanceAccount = (accData) => {
  const accounts = getFinanceAccounts();
  const newAcc = {
    id: `acc-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    currentBalance: 0.00,
    isSystemAccount: false,
    isActive: true,
    ...accData
  };
  accounts.push(newAcc);
  setScopedItems(STORAGE_KEYS.ACCOUNTS, accounts);
  logFinanceAudit('CREATED', 'Account', newAcc.accountCode, `Added COA Account "${newAcc.accountName}" (${newAcc.accountCode})`);
  return newAcc;
};

// --- GENERAL LEDGER & JOURNALS ---
export const getFinanceJournals = () => getScopedItems(STORAGE_KEYS.JOURNALS);

export const addFinanceJournal = (journalData) => {
  const { lines, description, reference } = journalData;
  
  // Double-Entry Balance Check
  const validation = validateJournalBalance(lines);
  if (!validation.isBalanced) {
    throw new Error(`Unbalanced Journal Entry! Total Debits (${validation.totalDebits}) must equal Total Credits (${validation.totalCredits}).`);
  }

  const journals = getFinanceJournals();
  const year = new Date().getFullYear();
  const num = Math.floor(100 + Math.random() * 900);
  
  const newJournal = {
    id: `jrn-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    journalNumber: `JV-${year}-${num}`,
    entryDate: journalData.entryDate || new Date().toISOString().substring(0, 10),
    reference: reference || '',
    description,
    sourceModule: 'MANUAL_JOURNAL',
    status: 'POSTED',
    totalDebit: validation.totalDebits,
    totalCredit: validation.totalCredits,
    createdById: 'Kavya R.',
    lines: lines.map((l, idx) => ({ id: `jl-${idx}`, ...l }))
  };

  journals.unshift(newJournal);
  setScopedItems(STORAGE_KEYS.JOURNALS, journals);
  logFinanceAudit('POSTED', 'Journal Entry', newJournal.journalNumber, `Posted JV ${newJournal.journalNumber} for ${formatFinanceCurrency(validation.totalDebits)}`);

  return newJournal;
};

// --- INVOICES & RECEIVABLES ---
export const getFinanceInvoices = () => getScopedItems(STORAGE_KEYS.INVOICES);

export const addFinanceInvoice = (invoiceData) => {
  const invoices = getFinanceInvoices();
  const year = new Date().getFullYear();
  const seq = String(invoices.length + 1).padStart(5, '0');
  
  const subtotal = Number(invoiceData.subtotal || 0);
  const taxTotal = Number(invoiceData.taxTotal || 0);
  const grandTotal = subtotal + taxTotal;

  const newInv = {
    id: `inv-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    invoiceNumber: `INV-${year}-${seq}`,
    currency: 'INR',
    paidAmount: 0.00,
    outstandingAmount: grandTotal,
    status: 'SENT',
    createdById: 'Kavya R.',
    createdAt: new Date().toISOString().substring(0, 10),
    grandTotal,
    ...invoiceData
  };

  invoices.unshift(newInv);
  setScopedItems(STORAGE_KEYS.INVOICES, invoices);
  logFinanceAudit('CREATED', 'Invoice', newInv.invoiceNumber, `Generated Invoice ${newInv.invoiceNumber} for ${newInv.customerName} (${formatFinanceCurrency(grandTotal)})`);

  return newInv;
};

export const recordInvoicePayment = (invoiceId, paymentAmount, bankAccountId) => {
  const invoices = getFinanceInvoices();
  const idx = invoices.findIndex(i => i.id === invoiceId);
  if (idx !== -1) {
    const inv = invoices[idx];
    const amt = Number(paymentAmount);
    inv.paidAmount = Number(inv.paidAmount) + amt;
    inv.outstandingAmount = Math.max(0, Number(inv.grandTotal) - inv.paidAmount);
    inv.status = inv.outstandingAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

    setScopedItems(STORAGE_KEYS.INVOICES, invoices);
    logFinanceAudit('PAID', 'Invoice Payment', inv.invoiceNumber, `Recorded payment of ${formatFinanceCurrency(amt)} for ${inv.invoiceNumber}`);
    return inv;
  }
  return null;
};

// --- BILLS & PAYABLES ---
export const getFinanceBills = () => getScopedItems(STORAGE_KEYS.BILLS);

export const addFinanceBill = (billData) => {
  const bills = getFinanceBills();
  const newBill = {
    id: `bill-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    currency: 'INR',
    paidAmount: 0.00,
    outstandingAmount: Number(billData.grandTotal),
    status: 'APPROVED',
    createdAt: new Date().toISOString().substring(0, 10),
    ...billData
  };
  bills.unshift(newBill);
  setScopedItems(STORAGE_KEYS.BILLS, bills);
  logFinanceAudit('CREATED', 'Vendor Bill', newBill.billNumber, `Logged Vendor Bill ${newBill.billNumber} from ${newBill.vendorName}`);
  return newBill;
};

// --- EXPENSES ---
export const getFinanceExpenses = () => getScopedItems(STORAGE_KEYS.EXPENSES);

export const addFinanceExpense = (expData) => {
  const expenses = getFinanceExpenses();
  const num = Math.floor(100 + Math.random() * 900);
  const newExp = {
    id: `exp-${Date.now()}`,
    organizationId: DEFAULT_ORG_ID,
    expenseNumber: `EXP-2026-${num}`,
    status: 'SUBMITTED',
    expenseDate: new Date().toISOString().substring(0, 10),
    ...expData
  };
  expenses.unshift(newExp);
  setScopedItems(STORAGE_KEYS.EXPENSES, expenses);
  logFinanceAudit('SUBMITTED', 'Expense Claim', newExp.expenseNumber, `Submitted ${newExp.category} expense of ${formatFinanceCurrency(newExp.amount)}`);
  return newExp;
};

export const updateExpenseStatus = (id, newStatus) => {
  const expenses = getFinanceExpenses();
  const idx = expenses.findIndex(e => e.id === id);
  if (idx !== -1) {
    expenses[idx].status = newStatus;
    setScopedItems(STORAGE_KEYS.EXPENSES, expenses);
    logFinanceAudit(newStatus, 'Expense Approval', expenses[idx].expenseNumber, `Updated expense status to ${newStatus}`);
    return expenses[idx];
  }
  return null;
};

// --- BANKING & RECONCILIATION ---
export const getFinanceBankAccounts = () => getScopedItems(STORAGE_KEYS.BANK_ACCOUNTS);
export const getFinancePeriods = () => getScopedItems(STORAGE_KEYS.PERIODS);
export const getFinanceCostCenters = () => getScopedItems(STORAGE_KEYS.COST_CENTERS);
export const getFinanceBudgets = () => getScopedItems(STORAGE_KEYS.BUDGETS);
export const getFinanceTaxes = () => getScopedItems(STORAGE_KEYS.TAXES);
export const getFinanceAuditLogs = () => getScopedItems(STORAGE_KEYS.AUDIT_LOGS);
