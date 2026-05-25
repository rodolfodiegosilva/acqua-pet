import React from 'react';

interface PortalSectionCardProps {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const PortalSectionCard: React.FC<PortalSectionCardProps> = ({ title, eyebrow, action, children }) => {
  return (
    <section
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div
        className="portal-section-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}
      >
        <div>
          {eyebrow && (
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
              {eyebrow}
            </span>
          )}
          <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{title}</h3>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
};
