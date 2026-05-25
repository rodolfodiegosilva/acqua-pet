import React from 'react';
import { CalendarClock, HeartPulse, Syringe, TriangleAlert } from 'lucide-react';
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
        <BackofficeMetricCard icon={CalendarClock} label="Agenda ativa" value={String(appointments.length)} hint="Atendimentos e rotas em acompanhamento hoje." />
        <BackofficeMetricCard icon={HeartPulse} label="Prontuários relevantes" value={String(records.length)} hint="Históricos disponíveis para decisão clínica." />
        <BackofficeMetricCard icon={TriangleAlert} label="Pacientes críticos" value={String(records.filter((record) => record.status !== 'Estável').length)} hint="Casos que exigem retorno, revisão ou observação." />
        <BackofficeMetricCard icon={Syringe} label="Pets com ação próxima" value={String(pets.filter((pet) => pet.nextAction.toLowerCase().includes('vac')).length)} hint="Base com vacina, reforço ou revisão preventiva." />
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <BackofficeSectionCard title="Fila clínica priorizada" eyebrow="Hoje">
          <div style={{ display: 'grid', gap: '14px' }}>
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{appointment.service}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{appointment.date} às {appointment.time} · {appointment.location}</p>
                <span className={`backoffice-pill ${appointment.status === 'Confirmado' ? 'backoffice-status-success' : appointment.status === 'Em análise' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginTop: '10px' }}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Casos de atenção" eyebrow="Clínica">
          <div style={{ display: 'grid', gap: '14px' }}>
            {records.filter((record) => record.status !== 'Estável').slice(0, 3).map((record) => (
              <div key={record.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{record.diagnosis}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{record.veterinarian} · {record.returnWindow}</p>
                <span className={`backoffice-pill ${record.status === 'Em tratamento' ? 'backoffice-status-critical' : 'backoffice-status-attention'}`} style={{ marginTop: '10px' }}>
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
