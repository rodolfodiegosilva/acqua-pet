import React from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import MedicationRounded from '@mui/icons-material/MedicationRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import type { BackofficePet } from '@/services/backoffice';
import type { ClientAppointment, MedicalRecord } from '@/services/clientPortal';
import { BackofficeMetricCard } from '../components/BackofficeMetricCard';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface VetOverviewTabProps {
  appointments: ClientAppointment[];
  records: MedicalRecord[];
  pets: BackofficePet[];
}

export const VetOverviewTab: React.FC<VetOverviewTabProps> = ({ appointments, records, pets }) => {
  return (
    <>
      <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
        <BackofficeMetricCard icon={CalendarMonthRounded} label="Agenda ativa" value={String(appointments.length)} hint="Atendimentos e rotas em acompanhamento hoje." />
        <BackofficeMetricCard icon={FavoriteRounded} label="Prontuários relevantes" value={String(records.length)} hint="Históricos disponíveis para decisão clínica." />
        <BackofficeMetricCard icon={WarningAmberRounded} label="Pacientes críticos" value={String(records.filter((record) => record.status !== 'Estável').length)} hint="Casos que exigem retorno, revisão ou observação." />
        <BackofficeMetricCard icon={MedicationRounded} label="Pets com ação próxima" value={String(pets.filter((pet) => pet.nextAction.toLowerCase().includes('vac')).length)} hint="Base com vacina, reforço ou revisão preventiva." />
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <BackofficeSectionCard title="Fila clínica priorizada" eyebrow="Hoje">
          <div className="backoffice-vet-overview-list" style={{ display: 'grid', gap: '14px' }}>
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="backoffice-card backoffice-overview-card backoffice-vet-overview-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong className="backoffice-vet-overview-card__title" style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{appointment.service}</strong>
                <p className="backoffice-vet-overview-card__copy" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{appointment.date} às {appointment.time} · {appointment.location}</p>
                <span className={`backoffice-pill backoffice-vet-overview-card__status ${appointment.status === 'Confirmado' ? 'backoffice-status-success' : appointment.status === 'Em análise' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginTop: '10px' }}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Casos de atenção" eyebrow="Clínica">
          <div className="backoffice-vet-overview-list" style={{ display: 'grid', gap: '14px' }}>
            {records.filter((record) => record.status !== 'Estável').slice(0, 3).map((record) => (
              <div key={record.id} className="backoffice-card backoffice-overview-card backoffice-vet-overview-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong className="backoffice-vet-overview-card__title" style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{record.diagnosis}</strong>
                <p className="backoffice-vet-overview-card__copy" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{record.veterinarian} · {record.returnWindow}</p>
                <span className={`backoffice-pill backoffice-vet-overview-card__status ${record.status === 'Em tratamento' ? 'backoffice-status-critical' : 'backoffice-status-attention'}`} style={{ marginTop: '10px' }}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>
      </div>
    </>
  );
};
