import React, { useEffect, useMemo, useState } from 'react';
import type { ClientAppointment } from '../../../services/clientPortal';
import type { BackofficePet } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface VetAgendaTabProps {
  appointments: ClientAppointment[];
  pets: BackofficePet[];
}

export const VetAgendaTab: React.FC<VetAgendaTabProps> = ({ appointments, pets }) => {
  const [statusFilter, setStatusFilter] = useState<'Todos' | ClientAppointment['status']>('Todos');
  const [typeFilter, setTypeFilter] = useState<'Todos' | ClientAppointment['type']>('Todos');
  const [page, setPage] = useState(1);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === 'Todos' || appointment.status === statusFilter;
      const matchesType = typeFilter === 'Todos' || appointment.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [appointments, statusFilter, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter]);

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / perPage));
  const paginatedAppointments = filteredAppointments.slice((page - 1) * perPage, page * perPage);

  return (
    <BackofficeSectionCard title="Agenda clínica e logística" eyebrow="Atendimento">
      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | ClientAppointment['status'])}>
          <option value="Todos">Todos os status</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Em análise">Em análise</option>
          <option value="Concluído">Concluído</option>
        </select>
        <select className="backoffice-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'Todos' | ClientAppointment['type'])}>
          <option value="Todos">Todos os tipos</option>
          <option value="Serviço">Serviço</option>
          <option value="Táxi Pet">Táxi Pet</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedAppointments.map((appointment) => {
          const pet = pets.find((item) => item.id === appointment.petId);
          return (
            <div key={appointment.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{appointment.service}</strong>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{pet?.avatar} {pet?.name} · {appointment.veterinarian}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`backoffice-pill ${appointment.type === 'Táxi Pet' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>{appointment.type}</span>
                  <span className={`backoffice-pill ${appointment.status === 'Confirmado' ? 'backoffice-status-success' : appointment.status === 'Em análise' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>{appointment.status}</span>
                </div>
              </div>

              <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Data</span><strong style={{ color: 'var(--backoffice-text)' }}>{appointment.date}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Hora</span><strong style={{ color: 'var(--backoffice-text)' }}>{appointment.time}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Unidade</span><strong style={{ color: 'var(--backoffice-text)' }}>{appointment.location}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="backoffice-ghost-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Anterior</button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button key={pageNumber} className={pageNumber === page ? 'backoffice-primary-btn' : 'backoffice-ghost-btn'} onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </button>
            );
          })}
          <button className="backoffice-ghost-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>Próxima</button>
        </div>
      )}
    </BackofficeSectionCard>
  );
};
