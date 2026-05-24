import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface BackofficeMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}

export const BackofficeMetricCard: React.FC<BackofficeMetricCardProps> = ({ icon: Icon, label, value, hint }) => {
  return (
    <div className="backoffice-card" style={{ padding: '22px', display: 'grid', gap: '14px', minHeight: '170px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--backoffice-accent-strong) 14%, var(--backoffice-soft))', color: 'var(--backoffice-accent-strong)' }}>
        <Icon size={22} />
      </div>
      <div>
        <span style={{ display: 'block', fontSize: '13px', color: 'var(--backoffice-muted)', marginBottom: '6px' }}>{label}</span>
        <strong style={{ display: 'block', fontSize: '30px', lineHeight: 1.05, color: 'var(--backoffice-text)' }}>{value}</strong>
      </div>
      <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.55, fontSize: '14px' }}>{hint}</p>
    </div>
  );
};
