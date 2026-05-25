import React, { useEffect, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { BackofficeSessionUser } from '@/services/backoffice';
import type { BackofficeNavItem, BackofficeTheme } from '../types';

interface BackofficeShellProps<TTab extends string> {
  theme: BackofficeTheme;
  setTheme: React.Dispatch<React.SetStateAction<BackofficeTheme>>;
  user: BackofficeSessionUser;
  title: string;
  description: string;
  navItems: BackofficeNavItem<TTab>[];
  activeTab: TTab;
  setActiveTab: React.Dispatch<React.SetStateAction<TTab>>;
  onLogout: () => void;
  children: React.ReactNode;
}

export const BackofficeShell = <TTab extends string>({
  theme,
  setTheme,
  user,
  title,
  description,
  navItems,
  activeTab,
  setActiveTab,
  onLogout,
  children
}: BackofficeShellProps<TTab>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 760px)');

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="backoffice-sidebar-mobile-head" style={{ display: isMobile ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <strong style={{ color: 'var(--backoffice-text)' }}>Menu interno</strong>
        <button type="button" className="backoffice-sidebar-close" onClick={handleCloseSidebar} aria-label="Fechar menu lateral" style={{ lineHeight: 0 }}>
          <CloseRounded sx={{ fontSize: 22, color: 'currentColor' }} />
        </button>
      </div>
      <div style={{ paddingBottom: '18px', marginBottom: '18px', borderBottom: '1px solid var(--backoffice-border)' }}>
        <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{user.name}</strong>
        <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '14px' }}>{user.email}</span>
        <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '14px', marginTop: '4px' }}>{user.unit}</span>
      </div>

      <nav style={{ display: 'grid', gap: '10px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`backoffice-nav-btn ${activeTab === item.id ? 'is-active' : ''}`} onClick={() => {
              setActiveTab(item.id);
              handleCloseSidebar();
            }}>
              <Icon sx={{ fontSize: 18 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'grid', gap: '10px', marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--backoffice-border)' }}>
        <button className="backoffice-ghost-btn" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? <LightModeRounded sx={{ fontSize: 16 }} /> : <DarkModeRounded sx={{ fontSize: 16 }} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        </button>
        <button className="backoffice-ghost-btn" onClick={() => {
          onLogout();
          handleCloseSidebar();
        }}>
          <LogoutRounded sx={{ fontSize: 16 }} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="backoffice-app" data-backoffice-theme={theme} style={{ minHeight: '100vh', background: 'var(--backoffice-bg)', padding: '24px 0' }}>
      <div className="container">
        <div className="backoffice-frame">
          <div className="backoffice-topbar backoffice-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', gap: '18px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {!isSidebarOpen && (
                <button type="button" className="backoffice-sidebar-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Abrir menu lateral" style={{ lineHeight: 0 }}>
                  <ArrowForwardRounded sx={{ fontSize: 22, color: 'currentColor' }} />
                </button>
              )}
              <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--backoffice-accent-strong)', marginBottom: '8px' }}>
                {user.title}
              </span>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.05, color: 'var(--backoffice-text)', marginBottom: '8px' }}>{title}</h1>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.65 }}>{description}</p>
              </div>
            </div>

            <div />
          </div>

          <div className="backoffice-shell" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '22px' }}>
            {isMobile ? (
              <Drawer
                anchor="left"
                open={isSidebarOpen}
                onClose={handleCloseSidebar}
                slotProps={{
                  paper: {
                    sx: {
                      width: 'min(320px, 88vw)',
                      maxWidth: 320,
                      background: theme === 'dark' ? '#0a1320' : '#ffffff',
                      color: 'var(--backoffice-text)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      borderRight: '1px solid var(--backoffice-border)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                      backgroundImage: 'none',
                      boxSizing: 'border-box',
                      borderRadius: '0 24px 24px 0',
                    }
                  }
                }}
              >
                {sidebarContent}
              </Drawer>
            ) : (
              <aside className="backoffice-card backoffice-sidebar" style={{ padding: '20px', position: 'sticky', top: '24px', height: 'fit-content' }}>
                {sidebarContent}
              </aside>
            )}

            <div className="backoffice-main" style={{ display: 'grid', gap: '22px', minWidth: 0 }}>
              {children}
              <footer className="backoffice-panel-footer">
                <span>{user.role === 'admin' ? 'AcquaPet Admin Console' : 'AcquaPet Vet Console'}</span>
                <span>Painel interno mockado com arquitetura desacoplada para operação e rotina clínica.</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
