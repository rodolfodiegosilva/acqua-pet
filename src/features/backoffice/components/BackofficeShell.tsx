import React, { useEffect, useRef, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import { LogOut, Moon, Sun } from 'lucide-react';
import type { BackofficeSessionUser } from '../../../services/backoffice';
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
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (isSidebarOpen) {
      closeButtonRef.current?.focus();
    } else if (document.activeElement instanceof HTMLElement) {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, [isSidebarOpen]);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="backoffice-app" data-backoffice-theme={theme} style={{ minHeight: '100vh', background: 'var(--backoffice-bg)', padding: '24px 0' }}>
      <div className="container">
        <div className="backoffice-topbar backoffice-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', gap: '18px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {!isSidebarOpen && (
              <button type="button" className="backoffice-sidebar-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Abrir menu lateral" style={{ lineHeight: 0 }}>
                <MenuRounded sx={{ fontSize: 22, color: 'currentColor' }} />
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="backoffice-ghost-btn" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </button>
            <button className="backoffice-ghost-btn" onClick={onLogout}>
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        <div className="backoffice-shell" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '22px' }}>
          <div className={`backoffice-sidebar-backdrop ${isSidebarOpen ? 'is-open' : ''}`} onClick={handleCloseSidebar} aria-hidden="true" />
          <aside className={`backoffice-card backoffice-sidebar ${isSidebarOpen ? 'is-open' : ''}`} style={{ padding: '20px', position: 'sticky', top: '24px', height: 'fit-content' }}>
            <div className="backoffice-sidebar-mobile-head" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <strong style={{ color: 'var(--backoffice-text)' }}>Menu interno</strong>
              <button ref={closeButtonRef} type="button" className="backoffice-sidebar-close" onClick={handleCloseSidebar} aria-label="Fechar menu lateral" style={{ lineHeight: 0 }}>
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
                    setIsSidebarOpen(false);
                  }}>
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div style={{ display: 'grid', gap: '22px', minWidth: 0 }}>
            {children}
            <footer className="backoffice-panel-footer">
              <span>{user.role === 'admin' ? 'AcquaPet Admin Console' : 'AcquaPet Vet Console'}</span>
              <span>Painel interno mockado com arquitetura desacoplada para operação e rotina clínica.</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
