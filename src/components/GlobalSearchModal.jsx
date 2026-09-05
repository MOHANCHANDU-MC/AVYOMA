import React, { useState, useEffect } from 'react';
import { Search, Building2, Users, UserCheck, TrendingUp, FileText, CheckSquare, X } from 'lucide-react';
import { Modal } from './Modal';
import { getLeads, getAccounts, getContacts, getOpportunities, getProposals, getTasks } from '../services/storageService';

export const GlobalSearchModal = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ leads: [], accounts: [], contacts: [], opportunities: [], proposals: [], tasks: [] });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-search-modal'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ leads: [], accounts: [], contacts: [], opportunities: [], proposals: [], tasks: [] });
      return;
    }

    const q = query.toLowerCase();

    setResults({
      leads: getLeads().filter(l => (l.fullName + l.company + l.id).toLowerCase().includes(q)).slice(0, 3),
      accounts: getAccounts().filter(a => (a.companyName + a.id + a.industry).toLowerCase().includes(q)).slice(0, 3),
      contacts: getContacts().filter(c => (c.name + c.email + c.companyName).toLowerCase().includes(q)).slice(0, 3),
      opportunities: getOpportunities().filter(o => (o.opportunityName + o.account + o.id).toLowerCase().includes(q)).slice(0, 3),
      proposals: getProposals().filter(p => (p.proposalNumber + p.customer).toLowerCase().includes(q)).slice(0, 3),
      tasks: getTasks().filter(t => (t.title + t.assignedTo).toLowerCase().includes(q)).slice(0, 3)
    });
  }, [query]);

  if (!isOpen) return null;

  const totalHits = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Search" maxWidth="640px">
      <div style={{ marginBottom: '16px' }}>
        <div className="input-search-wrapper">
          <Search size={18} className="input-search-icon" />
          <input
            type="text"
            className="input-field input-search"
            placeholder="Type to search leads, accounts, contacts, proposals, tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{ fontSize: '15px', padding: '12px 14px 12px 40px' }}
          />
        </div>
      </div>

      {!query.trim() && (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '13px' }}>Start typing to search across Avyoma CRM database...</p>
        </div>
      )}

      {query.trim() && totalHits === 0 && (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '14px' }}>No records found matching "{query}"</p>
        </div>
      )}

      {query.trim() && totalHits > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
          {results.opportunities.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Opportunities
              </div>
              {results.opportunities.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => { onNavigate('opportunities', opp); onClose(); }}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}
                  className="prec-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TrendingUp size={16} style={{ color: 'var(--primary-blue)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{opp.opportunityName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opp.account} • {opp.salesStage}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700 }} className="num-tabular">₹{(opp.opportunityValue/100000).toFixed(1)} L</span>
                </div>
              ))}
            </div>
          )}

          {results.leads.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Leads
              </div>
              {results.leads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => { onNavigate('leads', lead); onClose(); }}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}
                  className="prec-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={16} style={{ color: 'var(--status-amber-text)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{lead.fullName} ({lead.company})</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lead.jobTitle} • Score: {lead.leadScore}/100</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.accounts.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Accounts
              </div>
              {results.accounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => { onNavigate('accounts', acc); onClose(); }}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}
                  className="prec-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={16} style={{ color: 'var(--status-purple-text)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{acc.companyName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{acc.industry} • {acc.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
