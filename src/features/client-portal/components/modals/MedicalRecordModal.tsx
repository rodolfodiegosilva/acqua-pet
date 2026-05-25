import React from 'react';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import HealthAndSafetyRounded from '@mui/icons-material/HealthAndSafetyRounded';
import NoteAddRounded from '@mui/icons-material/NoteAddRounded';
import type { ClientPet, MedicalRecord } from '@/services/clientPortal';
import { PortalModal } from './PortalModal';

interface MedicalRecordModalProps {
  record: MedicalRecord | null;
  pet?: ClientPet;
  onClose: () => void;
}

export const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({ record, pet, onClose }) => {
  if (!record) return null;

  return (
    <PortalModal eyebrow="Prontuário detalhado" title={record.diagnosis} onClose={onClose} width="min(920px, 100%)">
      <div className="portal-medical-modal-hero" style={{ marginBottom: '18px', padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, color-mix(in srgb, var(--portal-accent) 18%, var(--portal-surface)) 0%, color-mix(in srgb, var(--portal-danger-text) 12%, var(--portal-surface)) 100%)', border: '1px solid var(--portal-border)' }}>
        <p style={{ color: 'var(--portal-muted)', fontSize: '14px', marginBottom: '14px' }}>
          {pet?.avatar} {pet?.name} · {record.veterinarian} · {record.specialty}
        </p>

        <div className="portal-medical-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
            <span className="portal-mini-label">Data do atendimento</span>
            <strong style={{ color: 'var(--portal-text)' }}>{record.date}</strong>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
            <span className="portal-mini-label">Status clínico</span>
            <strong style={{ color: 'var(--portal-text)' }}>{record.status}</strong>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
            <span className="portal-mini-label">Retorno indicado</span>
            <strong style={{ color: 'var(--portal-text)' }}>{record.returnWindow}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        <div className="portal-surface" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <NoteAddRounded sx={{ fontSize: 18, color: 'var(--portal-danger-text)' }} />
            <span className="portal-mini-label" style={{ marginBottom: 0 }}>Sintomas e queixa principal</span>
          </div>
          <p style={{ color: 'var(--portal-text)', lineHeight: 1.7 }}>{record.symptoms}</p>
        </div>

        <div className="portal-surface" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <HealthAndSafetyRounded sx={{ fontSize: 18, color: 'var(--portal-accent)' }} />
            <span className="portal-mini-label" style={{ marginBottom: 0 }}>Observações clínicas do veterinário</span>
          </div>
          <p style={{ color: 'var(--portal-text)', lineHeight: 1.7 }}>{record.clinicalNotes}</p>
        </div>

        <div className="portal-medical-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
          <div className="portal-surface" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <DescriptionOutlined sx={{ fontSize: 18, color: 'var(--portal-accent)' }} />
              <span className="portal-mini-label" style={{ marginBottom: 0 }}>Receituário</span>
            </div>
            <p style={{ color: 'var(--portal-muted)', fontSize: '14px', marginBottom: '12px' }}>{record.prescription}</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {record.prescriptionItems.map((item) => (
                <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
              ))}
            </div>
          </div>

          <div className="portal-surface" style={{ padding: '18px' }}>
            <span className="portal-mini-label">Exames e acompanhamentos solicitados</span>
            <div style={{ display: 'grid', gap: '8px' }}>
              {record.examsRequested.map((item) => (
                <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="portal-surface" style={{ padding: '18px' }}>
          <span className="portal-mini-label">Orientações adicionais</span>
          <div style={{ display: 'grid', gap: '8px' }}>
            {record.recommendations.map((item) => (
              <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
