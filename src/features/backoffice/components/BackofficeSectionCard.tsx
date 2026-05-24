import React from 'react';

interface BackofficeSectionCardProps {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const BackofficeSectionCard: React.FC<BackofficeSectionCardProps> = ({ title, eyebrow, action, children }) => {
  return (
    <section className="backoffice-card" style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          {eyebrow && (
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--backoffice-accent-strong)', marginBottom: '6px' }}>
              {eyebrow}
            </span>
          )}
          <h3 style={{ fontSize: '24px', color: 'var(--backoffice-text)' }}>{title}</h3>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
};
