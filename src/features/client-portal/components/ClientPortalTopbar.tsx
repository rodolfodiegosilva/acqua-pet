import React from 'react';

interface ClientPortalTopbarProps {
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

export const ClientPortalTopbar: React.FC<ClientPortalTopbarProps> = () => {
  return (
    <div className="portal-app-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
