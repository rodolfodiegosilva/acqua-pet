import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { PortalTheme } from '../types';

interface ClientPortalTopbarProps {
  portalTheme: PortalTheme;
  setPortalTheme: React.Dispatch<React.SetStateAction<PortalTheme>>;
  setView: (view: 'landing' | 'store' | 'client') => void;
}

export const ClientPortalTopbar: React.FC<ClientPortalTopbarProps> = ({ portalTheme, setPortalTheme, setView }) => {
  return (
    <div className="portal-app-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
      <div>
        <span style={{ display: 'block', fontSize: '12px', color: 'var(--portal-muted-strong)', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '6px' }}>
          AcquaPet Client Suite
        </span>
        <strong style={{ fontSize: '22px', color: 'var(--portal-text)' }}>Ambiente privado do cliente</strong>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setPortalTheme((current) => (current === 'dark' ? 'light' : 'dark'))} className="portal-ghost-btn">
          {portalTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {portalTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        </button>
        <button onClick={() => setView('store')} className="portal-ghost-btn">Loja pública</button>
        <button onClick={() => setView('landing')} className="portal-ghost-btn">Site institucional</button>
      </div>
    </div>
  );
};
