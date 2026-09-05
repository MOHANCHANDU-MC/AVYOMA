import React, { useState } from 'react';
import { USERS } from '../../data/seedData';
import { Shield, Lock, Settings, Users, Sliders, CheckCircle, Database } from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '../../services/storageService';

export const SettingsView = ({ onRefresh }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [activeUser, setActiveUser] = useState(getCurrentUser());

  const rolesList = [
    { name: 'Super Admin', desc: 'Full system access & administrative controls' },
    { name: 'Admin', desc: 'Manage CRM settings, users, and pipelines' },
    { name: 'Sales Manager', desc: 'Access team leads, opportunities, and reports' },
    { name: 'Sales Executive', desc: 'Manage assigned leads & pipeline opportunities' },
    { name: 'Technical / Engineering', desc: 'Access RFPs, technical specs, and design opportunities' },
    { name: 'Finance', desc: 'Access commercial proposals, quotations, and accounts' },
    { name: 'Viewer', desc: 'Read-only access to CRM records' }
  ];

  const permissionsMatrix = [
    { resource: 'Leads', view: true, create: true, edit: true, delete: false, export: true },
    { resource: 'Accounts', view: true, create: true, edit: true, delete: false, export: true },
    { resource: 'Opportunities', view: true, create: true, edit: true, moveStage: true, delete: false },
    { resource: 'Proposals / Quotes', view: true, create: true, edit: true, delete: false, export: true },
    { resource: 'Reports & Analytics', view: true, create: false, edit: false, export: true },
    { resource: 'System Audit Logs', view: true, create: false, edit: false, delete: false }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
      {/* Settings Sub-nav */}
      <div className="prec-card" style={{ padding: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 12px', textTransform: 'uppercase' }}>
          Settings Menu
        </div>
        {[
          { id: 'general', label: 'General & Company', icon: Settings },
          { id: 'scoring', label: 'Lead Scoring Rules', icon: Sliders },
          { id: 'roles', label: 'Users & RBAC Roles', icon: Users },
          { id: 'permissions', label: 'Permission Matrix', icon: Shield }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`btn btn-ghost ${activeSection === item.id ? 'btn-primary' : ''}`}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                marginBottom: '4px',
                backgroundColor: activeSection === item.id ? 'var(--primary-blue-light)' : 'transparent',
                color: activeSection === item.id ? 'var(--primary-blue)' : 'var(--text-dark)',
                fontWeight: activeSection === item.id ? 600 : 400
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Content */}
      <div className="prec-card">
        {activeSection === 'general' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Company Information</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Global settings for Avyoma Systems CRM instance</p>

            <form onSubmit={e => { e.preventDefault(); alert('General settings updated successfully.'); }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="input-field" defaultValue="AVYOMA SYSTEMS PVT LTD" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Base Currency</label>
                  <select className="select-field" defaultValue="INR">
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">System Timezone</label>
                  <input type="text" className="input-field" defaultValue="Asia/Kolkata (IST +05:30)" readOnly />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'scoring' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Configurable Lead Scoring Engine</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Rules for calculating automatic 0-100 score for incoming leads</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Industry Weighting</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Defence (+25 pts) • Aerospace (+25 pts) • Manufacturing (+20 pts) • Industrial (+15 pts)</div>
              </div>
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Estimated Deal Value Weighting</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>≥ ₹5 Cr (+25 pts) • ≥ ₹1 Cr (+20 pts) • ≥ ₹25 L (+10 pts)</div>
              </div>
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Engagement & Status Weighting</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Qualified Status (+20 pts) • Engaged (+15 pts) • Contacted (+10 pts)</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'roles' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Users & Role Assignments</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Switch active logged-in user profile to simulate RBAC roles</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {USERS.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setActiveUser(user);
                    if (onRefresh) onRefresh();
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: activeUser.id === user.id ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                    backgroundColor: activeUser.id === user.id ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name} ({user.title})</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                  <span className="badge badge-purple">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'permissions' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Role Permission Matrix</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Granular permissions for <strong>{activeUser.role}</strong> role</p>

            <table className="prec-table">
              <thead>
                <tr>
                  <th>Resource Module</th>
                  <th style={{ textAlign: 'center' }}>View</th>
                  <th style={{ textAlign: 'center' }}>Create</th>
                  <th style={{ textAlign: 'center' }}>Edit</th>
                  <th style={{ textAlign: 'center' }}>Export</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map(row => (
                  <tr key={row.resource}>
                    <td style={{ fontWeight: 600 }}>{row.resource}</td>
                    <td style={{ textAlign: 'center' }}>{row.view ? '✅' : '❌'}</td>
                    <td style={{ textAlign: 'center' }}>{row.create ? '✅' : '❌'}</td>
                    <td style={{ textAlign: 'center' }}>{row.edit ? '✅' : '❌'}</td>
                    <td style={{ textAlign: 'center' }}>{row.export ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
