import React from 'react';
import './BackofficeSectionCard.css';

interface BackofficeSectionCardProps {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const BackofficeSectionCard: React.FC<BackofficeSectionCardProps> = ({ title, eyebrow, action, children }) => {
  return (
    <section className="backoffice-card backoffice-section-card" style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div className="backoffice-section-card__heading">
          {eyebrow && (
            <span className="backoffice-section-card__eyebrow">
              {eyebrow}
            </span>
          )}
          <h3 className="backoffice-section-card__title">{title}</h3>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
};
