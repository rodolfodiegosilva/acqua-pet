import React from 'react';
import './PortalSectionCard.css';

interface PortalSectionCardProps {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const PortalSectionCard: React.FC<PortalSectionCardProps> = ({ title, eyebrow, action, children }) => {
  return (
    <section
      className="glass-card portal-section-card"
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
        <div className="portal-section-card__heading">
          {eyebrow && (
            <span className="portal-section-card__eyebrow">
              {eyebrow}
            </span>
          )}
          <h3 className="portal-section-card__title">{title}</h3>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
};
