import React from 'react';
import { Drawer } from './Modal';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/storageService';

export const NotificationDrawer = ({ isOpen, onClose, onRefresh }) => {
  const notifications = getNotifications();

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Notification Center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                cursor: 'pointer'
              }}
              className="prec-card-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                {n.type === 'success' ? <CheckCircle size={16} style={{ color: 'var(--status-green)' }} /> :
                 n.type === 'warning' ? <AlertTriangle size={16} style={{ color: 'var(--status-amber)' }} /> :
                 <Info size={16} style={{ color: 'var(--primary-blue)' }} />}
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)' }}>{n.title}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>{n.time}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No notifications.
          </div>
        )}
      </div>
    </Drawer>
  );
};
