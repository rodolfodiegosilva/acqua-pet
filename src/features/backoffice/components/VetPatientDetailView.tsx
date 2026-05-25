import React, { useMemo } from 'react';
import { ArrowLeft, FilePlus2, Stethoscope } from 'lucide-react';
import type { BackofficePet } from '@/services/backoffice';
import type { MedicalRecord } from '@/services/clientPortal';
import type { VetRecordDraft } from '../types';
import { BackofficeSectionCard } from './BackofficeSectionCard';
import { VetRecordComposer } from './VetRecordComposer';

interface VetPatientDetailViewProps {
  pet: BackofficePet;
  records: MedicalRecord[];
  veterinarianName: string;
  onBack: () => void;
  onCreateRecord: (petId: number, draft: VetRecordDraft) => void;
}

export const VetPatientDetailView: React.FC<VetPatientDetailViewProps> = ({ pet, records, veterinarianName, onBack, onCreateRecord }) => {
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.split('/').reverse().join('-').localeCompare(a.date.split('/').reverse().join('-'))),
    [records]
  );

  const latestRecord = sortedRecords[0];

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div className="backoffice-card" style={{ padding: '24px', display: 'grid', gap: '18px', background: 'var(--backoffice-hero)' }}>
        <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', minWidth: 0 }}>
            <button className="backoffice-ghost-btn" type="button" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div className="backoffice-patient-avatar" style={{ width: '88px', height: '88px', borderRadius: '28px', background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', fontSize: '42px', flexShrink: 0 }}>
              {pet.avatar}
            </div>
            <div style={{ minWidth: 0 }}>
              <span style={{ display: 'inline-flex', padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.16)', color: 'var(--backoffice-text)', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
                {pet.status}
              </span>
              <h2 style={{ color: 'var(--backoffice-text)', fontSize: '30px', marginBottom: '8px' }}>{pet.name}</h2>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                {pet.species} · {pet.sex} · {pet.breed} · {pet.age} · {pet.weight}
              </p>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                Tutor: {pet.tutorName} · Último atendimento: {pet.lastVisit} · Próxima ação: {pet.nextAction}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="backoffice-pill backoffice-status-info"><Stethoscope size={14} /> Ficha clínica completa</span>
            <span className="backoffice-pill backoffice-status-success"><FilePlus2 size={14} /> {sortedRecords.length} registros</span>
          </div>
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Observação base</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{pet.observation || 'Sem observação registrada.'}</strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Vacinas</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{pet.vaccines.length > 0 ? pet.vaccines.join(', ') : 'Sem vacina registrada'}</strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Último diagnóstico</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{latestRecord?.diagnosis ?? 'Ainda sem prontuário clínico.'}</strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Retorno</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{latestRecord?.returnWindow ?? 'A definir'}</strong>
          </div>
        </div>
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', alignItems: 'start' }}>
        <BackofficeSectionCard title="Histórico médico completo" eyebrow="Prontuário">
          <div style={{ display: 'grid', gap: '14px' }}>
            {sortedRecords.length > 0 ? sortedRecords.map((record) => (
              <article key={record.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)', display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{record.diagnosis}</strong>
                    <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{record.date} · {record.veterinarian} · {record.specialty}</p>
                  </div>
                  <span className={`backoffice-pill ${record.status === 'Estável' ? 'backoffice-status-success' : record.status === 'Atenção' ? 'backoffice-status-attention' : 'backoffice-status-critical'}`}>
                    {record.status}
                  </span>
                </div>

                <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                  <div>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Sintomas</span>
                    <p style={{ color: 'var(--backoffice-text)', lineHeight: 1.7 }}>{record.symptoms}</p>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Notas clínicas</span>
                    <p style={{ color: 'var(--backoffice-text)', lineHeight: 1.7 }}>{record.clinicalNotes}</p>
                  </div>
                </div>

                <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '8px' }}>Receituário</span>
                    <p style={{ color: 'var(--backoffice-text)', lineHeight: 1.7, marginBottom: '10px' }}>{record.prescription}</p>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {record.prescriptionItems.map((item) => (
                        <span key={item} style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '8px' }}>Exames solicitados</span>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {record.examsRequested.length > 0 ? record.examsRequested.map((item) => (
                        <span key={item} style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{item}</span>
                      )) : <span style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Sem exames adicionais.</span>}
                    </div>
                  </div>
                  <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '8px' }}>Orientações ao tutor</span>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {record.recommendations.length > 0 ? record.recommendations.map((item) => (
                        <span key={item} style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{item}</span>
                      )) : <span style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Sem orientações adicionais.</span>}
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '8px' }}>Sem histórico ainda</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>Este pet ainda não tem prontuário salvo no painel veterinário. Use o formulário ao lado para registrar a primeira ficha clínica.</p>
              </div>
            )}
          </div>
        </BackofficeSectionCard>

        <VetRecordComposer veterinarianName={veterinarianName} onCreateRecord={(draft) => onCreateRecord(pet.id, draft)} />
      </div>
    </div>
  );
};
