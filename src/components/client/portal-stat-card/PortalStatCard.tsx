import React from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import './PortalStatCard.css';

interface PortalStatCardProps {
  icon: React.ElementType<SvgIconProps>;
  label: string;
  value: string;
  hint: string;
}

export const PortalStatCard: React.FC<PortalStatCardProps> = ({ icon: Icon, label, value, hint }) => {
  return (
    <div className="glass-card portal-stat-card">
      <div className="portal-stat-card__icon">
        <Icon sx={{ fontSize: 22 }} />
      </div>

      <div className="portal-stat-card__content">
        <span className="portal-stat-card__label">{label}</span>
        <strong className="portal-stat-card__value">{value}</strong>
      </div>

      <p className="portal-stat-card__hint">{hint}</p>
    </div>
  );
};
