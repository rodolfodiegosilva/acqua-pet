import React from 'react';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { ClientUser } from '@/services/clientPortal';
import type { PortalTab, PortalTabItem, PortalTheme } from '../types';

interface ClientPortalSidebarProps {
  currentUser: ClientUser;
  activeTab: PortalTab;
  tabItems: PortalTabItem[];
  setActiveTab: (tab: PortalTab) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  portalTheme: PortalTheme;
  setPortalTheme: React.Dispatch<React.SetStateAction<PortalTheme>>;
}

export const ClientPortalSidebar: React.FC<ClientPortalSidebarProps> = ({
  currentUser,
  activeTab,
  tabItems,
  setActiveTab,
  onLogout,
  isOpen,
  onClose,
  portalTheme,
  setPortalTheme
}) => {
  const isMobile = useMediaQuery('(max-width: 980px)');

  const handleClose = () => {
    onClose();
  };

  const sidebarContent = (
    <>
      <div className="portal-sidebar-mobile-head" style={{ display: isMobile ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <strong style={{ color: 'var(--portal-text)', fontSize: '18px', fontWeight: 800 }}>Menu do cliente</strong>
        <button type="button" className="portal-sidebar-close" onClick={handleClose} aria-label="Fechar menu lateral" style={{ lineHeight: 0 }}>
          <ArrowBackRounded sx={{ fontSize: 22, color: 'currentColor' }} />
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--portal-accent) 0%, #1d4ed8 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            {currentUser.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}
          </div>
          <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', border: '2px solid var(--portal-surface)', boxShadow: '0 0 8px #22c55e' }} />
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '18px', fontWeight: 800, color: 'var(--portal-text)', letterSpacing: '-0.3px' }}>{currentUser.name}</strong>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'var(--portal-accent)',
            background: portalTheme === 'dark' ? 'rgba(37, 99, 235, 0.16)' : 'rgba(37, 99, 235, 0.08)',
            padding: '2px 8px',
            borderRadius: '12px',
            marginTop: '4px'
          }}>
            {currentUser.plan} Member
          </span>
        </div>
      </div>

      <div className="portal-surface" style={{ padding: '16px', border: '1px solid var(--portal-border)', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)' }}>
        <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--portal-muted)', marginBottom: '8px' }}>
          Identificação do Tutor
        </span>
        <strong
          style={{
            display: 'block',
            fontSize: '15px',
            marginBottom: '4px',
            color: 'var(--portal-text)',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            fontWeight: 600
          }}
        >
          {currentUser.email}
        </strong>
        <p style={{ fontSize: '12px', color: 'var(--portal-muted)', marginTop: '8px' }}>{currentUser.city} · Tutor desde {currentUser.memberSince}</p>
      </div>

      <nav className="portal-tab-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                handleClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                background: isActive ? 'linear-gradient(135deg, var(--portal-accent) 0%, #1d4ed8 100%)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#fff' : 'var(--portal-text)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isActive ? '0 8px 20px rgba(37, 99, 235, 0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Icon sx={{ fontSize: 18, opacity: isActive ? 1 : 0.7 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px #fff' }} />}
            </button>
          );
        })}
      </nav>

      <div className="portal-sidebar-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        <button 
          onClick={() => setPortalTheme((current) => (current === 'dark' ? 'light' : 'dark'))} 
          className="portal-ghost-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid var(--portal-border)',
            background: 'transparent',
            color: 'var(--portal-text)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          {portalTheme === 'dark' ? <LightModeRounded sx={{ fontSize: 16 }} /> : <DarkModeRounded sx={{ fontSize: 16 }} />}
          {portalTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        </button>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px' }}>
        <button
          onClick={() => {
            onLogout();
            handleClose();
          }}
          style={{
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid var(--portal-danger-border)',
            background: 'var(--portal-danger-surface)',
            color: 'var(--portal-danger-text)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <LogoutRounded sx={{ fontSize: 16 }} />
          Sair
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 'min(320px, 88vw)',
              maxWidth: 320,
              background: portalTheme === 'dark' ? '#091322' : '#ffffff',
              color: 'var(--portal-text)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderRight: '1px solid var(--portal-border)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
              backgroundImage: 'none',
              boxSizing: 'border-box',
              borderRadius: '0 24px 24px 0',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: portalTheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: portalTheme === 'dark' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(0, 0, 0, 0.24)',
              },
            }
          }
        }}
      >
        <div className="portal-app" data-portal-theme={portalTheme} style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', width: '100%', boxSizing: 'border-box' }}>
          {sidebarContent}
        </div>
      </Drawer>
    );
  }

  return (
    <aside className="glass-card portal-sidebar" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'start', position: 'sticky', top: '24px' }}>
      {sidebarContent}
    </aside>
  );
};
