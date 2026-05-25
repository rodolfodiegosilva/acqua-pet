import React from 'react';
import { PortalSectionCard } from '@/components/client/portal-section-card/PortalSectionCard';
import type { VetAvailability } from '@/services/clientPortal';

interface VetsTabProps {
  veterinarians: VetAvailability[];
}

export const VetsTab: React.FC<VetsTabProps> = ({ veterinarians }) => {
  return (
    <PortalSectionCard title="Disponibilidade da equipe" eyebrow="Operação clínica">
      <div className="portal-vets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
        {veterinarians.map((vet) => (
          <div key={vet.id} style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px', color: 'var(--portal-text)' }}>{vet.name}</strong>
                <span style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>{vet.specialty}</span>
              </div>
              <span style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', background: vet.status === 'Disponível' ? 'var(--portal-pill-success-bg)' : vet.status === 'Últimas vagas' ? 'var(--portal-pill-warn-bg)' : 'var(--portal-danger-surface)', color: vet.status === 'Disponível' ? 'var(--portal-pill-success-text)' : vet.status === 'Últimas vagas' ? 'var(--portal-pill-warn-text)' : 'var(--portal-danger-text)', fontSize: '12px', fontWeight: 700, height: 'fit-content' }}>
                {vet.status}
              </span>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div><span className="portal-mini-label">Próximo horário</span><strong style={{ color: 'var(--portal-text)' }}>{vet.nextSlot}</strong></div>
              <div><span className="portal-mini-label">Turno</span><strong style={{ color: 'var(--portal-text)' }}>{vet.shift}</strong></div>
              <div><span className="portal-mini-label">Canal</span><strong style={{ color: 'var(--portal-text)' }}>{vet.channel}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </PortalSectionCard>
  );
};
