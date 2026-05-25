import React, { useEffect, useState } from 'react';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
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
        <strong style={{ color: 'var(--backoffice-text)', fontSize: '18px', fontWeight: 800 }}>Menu interno</strong>
        <button type="button" className="backoffice-sidebar-close" onClick={handleCloseSidebar} aria-label="Fechar menu lateral" style={{ lineHeight: 0 }}>
          <ArrowBackRounded sx={{ fontSize: 22, color: 'currentColor' }} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--backoffice-accent)' }}>
          Painel Operativo Ativo
        </span>
      </div>

      <div style={{
        padding: '16px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        border: '1px solid var(--backoffice-border)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--backoffice-accent-strong) 0%, #1e40af 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)' }}>
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '15px', fontWeight: 700 }}>{user.name}</strong>
            <span style={{ display: 'block', color: 'var(--backoffice-accent)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
              {user.role === 'admin' ? 'Administrador' : 'Veterinário'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--backoffice-muted)', display: 'grid', gap: '6px', borderTop: '1px dashed var(--backoffice-border)', paddingTop: '12px', marginTop: '4px' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📧 {user.email}</span>
          <span>🏢 {user.unit}</span>
        </div>
      </div>

      <nav style={{ display: 'grid', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                handleCloseSidebar();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                background: isActive ? 'linear-gradient(135deg, var(--backoffice-accent-strong) 0%, #1e40af 100%)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#fff' : 'var(--backoffice-text)',
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

      <div style={{ display: 'grid', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--backoffice-border)' }}>
        <button 
          className="backoffice-ghost-btn" 
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid var(--backoffice-border)',
            background: 'transparent',
            color: 'var(--backoffice-text)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          {theme === 'dark' ? <LightModeRounded sx={{ fontSize: 16 }} /> : <DarkModeRounded sx={{ fontSize: 16 }} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        </button>
        <button 
          className="backoffice-ghost-btn" 
          onClick={() => {
            onLogout();
            handleCloseSidebar();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid var(--backoffice-border)',
            background: 'transparent',
            color: 'var(--backoffice-text)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
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
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(0, 0, 0, 0.24)',
                      },
                    }
                  }
                }}
              >
                <div className="backoffice-app" data-backoffice-theme={theme} style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', width: '100%', boxSizing: 'border-box' }}>
                  {sidebarContent}
                </div>
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
      {isMobile && !isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--backoffice-accent-strong)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--backoffice-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 0,
            cursor: 'pointer',
          }}
        >
          <ArrowForwardRounded sx={{ fontSize: 22, color: '#ffffff' }} />
        </button>
      )}
    </div>
  );
};
