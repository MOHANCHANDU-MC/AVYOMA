import React from 'react';
import { Drawer } from './Modal';
import { Bell, CheckCircle, Info, AlertTriangle, Inbox } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/storageService';

export const NotificationDrawer = ({ isOpen, onClose, onRefresh }) => {
  const notifications = getNotifications();

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Notification Center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { markNotificationRead(n.id); if (onRefresh) onRefresh(); }}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: n.read ? '#FFFFFF' : '#EFF6FF',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              className="prec-card-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {n.type === 'success' ? <CheckCircle size={15} style={{ color: 'var(--status-green)' }} /> :
                 n.type === 'warning' ? <AlertTriangle size={15} style={{ color: 'var(--status-amber)' }} /> :
                 <Info size={15} style={{ color: 'var(--primary-blue)' }} />}
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{n.title}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{n.message}</p>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{n.time}</div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '48px 0' }}>
            <div className="empty-state-icon">
              <Inbox size={22} />
            </div>
            <div className="empty-state-title">No New Notifications</div>
            <div className="empty-state-desc">You are all caught up! System alerts and team notifications will appear here.</div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
