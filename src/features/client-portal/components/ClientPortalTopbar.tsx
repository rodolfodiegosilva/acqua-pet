import React from 'react';
import MenuRounded from '@mui/icons-material/MenuRounded';

interface ClientPortalTopbarProps {
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

export const ClientPortalTopbar: React.FC<ClientPortalTopbarProps> = ({ onOpenSidebar, isSidebarOpen }) => {
  return (
    <div className="portal-app-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isSidebarOpen && (
          <button type="button" className="portal-sidebar-toggle" onClick={onOpenSidebar} aria-label="Abrir menu lateral" style={{ lineHeight: 0 }}>
            <MenuRounded sx={{ fontSize: 22, color: 'currentColor' }} />
          </button>
        )}
        <div>
        <span style={{ display: 'block', fontSize: '12px', color: 'var(--portal-muted-strong)', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '6px' }}>
          AcquaPet Client Suite
        </span>
        <strong style={{ fontSize: '22px', color: 'var(--portal-text)' }}>Ambiente privado do cliente</strong>
        </div>
      </div>
      <div />
    </div>
  );
};
