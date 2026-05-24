import React from 'react';
import { LogOut } from 'lucide-react';
import type { ClientUser } from '../../../services/clientPortal';
import type { PortalTab, PortalTabItem } from '../types';

interface ClientPortalSidebarProps {
  currentUser: ClientUser;
  activeTab: PortalTab;
  tabItems: PortalTabItem[];
  setActiveTab: (tab: PortalTab) => void;
  setView: (view: 'landing' | 'store' | 'client') => void;
  onLogout: () => void;
}

export const ClientPortalSidebar: React.FC<ClientPortalSidebarProps> = ({
  currentUser,
  activeTab,
  tabItems,
  setActiveTab,
  setView,
  onLogout
}) => {
  return (
    <aside className="glass-card portal-sidebar" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'start', position: 'sticky', top: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--portal-accent) 0%, #1d4ed8 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
          {currentUser.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '17px', color: 'var(--portal-text)' }}>{currentUser.name}</strong>
          <span style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>{currentUser.plan} Member</span>
        </div>
      </div>

      <div className="portal-surface" style={{ padding: '16px' }}>
        <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--portal-muted)', marginBottom: '6px' }}>
          Conta ativa
        </span>
        <strong
          style={{
            display: 'block',
            fontSize: '18px',
            marginBottom: '4px',
            color: 'var(--portal-text)',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word'
          }}
        >
          {currentUser.email}
        </strong>
        <p style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>{currentUser.city} · Cliente desde {currentUser.memberSince}</p>
      </div>

      <nav className="portal-tab-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--portal-accent)' : 'var(--portal-border)',
                background: isActive ? 'var(--portal-accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--portal-text)',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => setView('landing')}
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--portal-border)',
            background: 'var(--portal-soft-surface)',
            color: 'var(--portal-text)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Voltar ao site
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--portal-danger-border)',
            background: 'var(--portal-danger-surface)',
            color: 'var(--portal-danger-text)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
};
