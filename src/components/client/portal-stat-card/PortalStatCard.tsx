import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PortalStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}

export const PortalStatCard: React.FC<PortalStatCardProps> = ({ icon: Icon, label, value, hint }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minHeight: '160px'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(3, 2, 116, 0.08) 0%, rgba(214, 20, 44, 0.08) 100%)',
          color: 'var(--primary)'
        }}
      >
        <Icon size={22} />
      </div>

      <div>
        <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</span>
        <strong style={{ display: 'block', fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{value}</strong>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{hint}</p>
    </div>
  );
};
