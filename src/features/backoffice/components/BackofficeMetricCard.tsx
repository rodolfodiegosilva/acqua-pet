import React from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import './BackofficeMetricCard.css';

interface BackofficeMetricCardProps {
  icon: React.ElementType<SvgIconProps>;
  label: string;
  value: string;
  hint: string;
}

export const BackofficeMetricCard: React.FC<BackofficeMetricCardProps> = ({ icon: Icon, label, value, hint }) => {
  return (
    <div className="backoffice-card backoffice-metric-card">
      <div className="backoffice-metric-card__icon">
        <Icon sx={{ fontSize: 22 }} />
      </div>
      <div className="backoffice-metric-card__content">
        <span className="backoffice-metric-card__label">{label}</span>
        <strong className="backoffice-metric-card__value">{value}</strong>
      </div>
      <p className="backoffice-metric-card__hint">{hint}</p>
    </div>
  );
};
