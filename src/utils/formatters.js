// Formatters & Helper Utilities for Avyoma CRM

// Format Currency in INR or USD
export const formatCurrency = (amount, currency = 'INR', compact = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  if (currency === 'INR') {
    if (compact) {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
      }
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format Date (e.g. "30 Oct 2026")
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Format Time (e.g. "10:30 AM")
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

// Format Percent (e.g. "65%")
export const formatPercent = (value) => {
  if (value === undefined || value === null) return '0%';
  return `${Math.round(value)}%`;
};

// Lead Score Helper
export const getLeadScoreCategory = (score) => {
  if (score >= 81) return { label: 'Very Hot', badgeClass: 'score-very-hot' };
  if (score >= 61) return { label: 'Hot', badgeClass: 'score-hot' };
  if (score >= 31) return { label: 'Warm', badgeClass: 'score-warm' };
  return { label: 'Cold', badgeClass: 'score-cold' };
};

// Pipeline Stage Color & Probabilities Default
export const STAGE_CONFIG = {
  'NEW': { label: 'New', probability: 10, badgeClass: 'badge-gray' },
  'QUALIFICATION': { label: 'Qualification', probability: 20, badgeClass: 'badge-blue' },
  'DISCOVERY': { label: 'Discovery', probability: 30, badgeClass: 'badge-blue' },
  'TECHNICAL EVALUATION': { label: 'Technical Evaluation', probability: 50, badgeClass: 'badge-purple' },
  'PROPOSAL': { label: 'Proposal', probability: 65, badgeClass: 'badge-amber' },
  'NEGOTIATION': { label: 'Negotiation', probability: 80, badgeClass: 'badge-amber' },
  'CONTRACT': { label: 'Contract / PO', probability: 90, badgeClass: 'badge-blue' },
  'WON': { label: 'Won', probability: 100, badgeClass: 'badge-green' },
  'LOST': { label: 'Lost', probability: 0, badgeClass: 'badge-red' }
};

// Unique ID Generator
export const generateId = (prefix) => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
};
