// AVYOMA Finance Module — Formatting & Accounting Math Utilities

export const formatFinanceCurrency = (amount, currency = 'INR', compact = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  const num = Number(amount);
  
  if (currency === 'INR') {
    if (compact) {
      if (Math.abs(num) >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
      } else if (Math.abs(num) >= 100000) {
        return `₹${(num / 100000).toFixed(2)} L`;
      }
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatFinanceDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatDate = formatFinanceDate;

// Double-Entry Accounting Rule Verification (Debits must equal Credits)
export const validateJournalBalance = (lines = []) => {
  const totalDebits = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const totalCredits = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  const difference = Math.abs(totalDebits - totalCredits);
  const isBalanced = difference < 0.0001 && lines.length >= 2;

  return {
    totalDebits,
    totalCredits,
    difference,
    isBalanced
  };
};

// Accounts Receivable / Payable Aging Calculator
export const calculateAgingBucket = (dueDateString, outstandingAmount) => {
  if (!dueDateString || Number(outstandingAmount || 0) <= 0) return 'CURRENT';

  const due = new Date(dueDateString).getTime();
  const today = new Date().getTime();
  const diffDays = Math.floor((today - due) / (1000 * 3600 * 24));

  if (diffDays <= 0) return 'CURRENT';
  if (diffDays <= 30) return '1_30_DAYS';
  if (diffDays <= 60) return '31_60_DAYS';
  if (diffDays <= 90) return '61_90_DAYS';
  return '90_PLUS_DAYS';
};

export const ACCOUNT_TYPE_CONFIG = {
  ASSET: { label: 'Asset', color: 'badge-blue', category: 'ASSETS' },
  LIABILITY: { label: 'Liability', color: 'badge-amber', category: 'LIABILITIES' },
  EQUITY: { label: 'Equity', color: 'badge-purple', category: 'EQUITY' },
  INCOME: { label: 'Income', color: 'badge-green', category: 'INCOME' },
  EXPENSE: { label: 'Expense', color: 'badge-red', category: 'EXPENSES' }
};
