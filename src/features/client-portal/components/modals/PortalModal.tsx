import React from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface PortalModalProps {
  eyebrow: string;
  title: string;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
}

export const PortalModal: React.FC<PortalModalProps> = ({ eyebrow, title, onClose, width = 'min(640px, 100%)', children }) => {
  return (
    <div
      className="portal-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 23, 0.68)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 90
      }}
      onClick={onClose}
    >
      <div
        className="portal-modal-card"
        style={{
          width,
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: '24px',
          background: 'var(--portal-surface)',
          border: '1px solid var(--portal-border)',
          boxShadow: '0 24px 60px rgba(2, 6, 23, 0.3)',
          padding: '24px'
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="portal-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--portal-danger-text)', marginBottom: '8px' }}>
              {eyebrow}
            </span>
            <h3 style={{ fontSize: '24px', color: 'var(--portal-text)' }}>{title}</h3>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '1px solid var(--portal-border)',
              background: 'var(--portal-soft-surface)',
              color: 'var(--portal-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <CloseRounded sx={{ fontSize: 18 }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
