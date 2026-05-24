import React, { useEffect, useMemo, useState } from 'react';
import type { ClientAppointment, ClientPet, VetAvailability } from '../../../services/clientPortal';
import { PortalSectionCard } from '../../../components/client/PortalSectionCard';

interface AppointmentsTabProps {
  pets: ClientPet[];
  appointments: ClientAppointment[];
  veterinarians: VetAvailability[];
  appointmentForm: {
    type: ClientAppointment['type'];
    petId: string;
    service: string;
    veterinarian: string;
    date: string;
    time: string;
    pickupAddress: string;
    destinationAddress: string;
    transportMode: NonNullable<ClientAppointment['transportMode']>;
    companion: NonNullable<ClientAppointment['companion']>;
  };
  setAppointmentForm: React.Dispatch<React.SetStateAction<{
    type: ClientAppointment['type'];
    petId: string;
    service: string;
    veterinarian: string;
    date: string;
    time: string;
    pickupAddress: string;
    destinationAddress: string;
    transportMode: NonNullable<ClientAppointment['transportMode']>;
    companion: NonNullable<ClientAppointment['companion']>;
  }>>;
  onCreateAppointment: (event: React.FormEvent) => void;
  formatDateInput: (value: string) => string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  pets,
  appointments,
  veterinarians,
  appointmentForm,
  setAppointmentForm,
  onCreateAppointment,
  formatDateInput
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ClientAppointment['status']>('Todos');
  const [typeFilter, setTypeFilter] = useState<'Todos' | ClientAppointment['type']>('Todos');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status' | 'type'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const pet = pets.find((item) => item.id === appointment.petId);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        appointment.service.toLowerCase().includes(normalizedQuery) ||
        appointment.type.toLowerCase().includes(normalizedQuery) ||
        appointment.veterinarian.toLowerCase().includes(normalizedQuery) ||
        appointment.location.toLowerCase().includes(normalizedQuery) ||
        appointment.pickupAddress?.toLowerCase().includes(normalizedQuery) ||
        appointment.destinationAddress?.toLowerCase().includes(normalizedQuery) ||
        pet?.name.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || appointment.status === statusFilter;
      const matchesType = typeFilter === 'Todos' || appointment.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointments, pets, searchQuery, statusFilter, typeFilter]);

  const sortedAppointments = useMemo(() => {
    const parseDate = (value: string, time: string) => {
      const normalizedDate = value.includes('-') ? value.split('-').map(Number) : value.split('/').reverse().map(Number);
      const [year, month, day] = normalizedDate;
      const [hours, minutes] = time.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes).getTime();
    };

    return [...filteredAppointments].sort((a, b) => {
      if (sortBy === 'date-asc') return parseDate(a.date, a.time) - parseDate(b.date, b.time);
      if (sortBy === 'status') return a.status.localeCompare(b.status, 'pt-BR');
      if (sortBy === 'type') return a.type.localeCompare(b.type, 'pt-BR');
      return parseDate(b.date, b.time) - parseDate(a.date, a.time);
    });
  }, [filteredAppointments, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, sortBy]);

  const appointmentsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(sortedAppointments.length / appointmentsPerPage));
  const paginatedAppointments = sortedAppointments.slice((currentPage - 1) * appointmentsPerPage, currentPage * appointmentsPerPage);

  return (
    <div className="portal-two-cols portal-appointments-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
      <PortalSectionCard title="Timeline de agendamentos" eyebrow="Serviços">
        <div style={{ display: 'grid', gap: '14px' }}>
          <div className="portal-appointments-controls" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) repeat(3, minmax(0, 0.7fr))', gap: '12px' }}>
            <input
              className="portal-input"
              type="text"
              placeholder="Buscar serviço, veterinário ou pet"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select className="portal-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | ClientAppointment['status'])}>
              <option value="Todos">Todos os status</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Em análise">Em análise</option>
              <option value="Concluído">Concluído</option>
            </select>
            <select className="portal-input" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'Todos' | ClientAppointment['type'])}>
              <option value="Todos">Todos os tipos</option>
              <option value="Serviço">Serviços</option>
              <option value="Táxi Pet">Táxi Pet</option>
            </select>
            <select className="portal-input" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'date-desc' | 'date-asc' | 'status' | 'type')}>
              <option value="date-desc">Mais recentes</option>
              <option value="date-asc">Mais antigos</option>
              <option value="status">Status</option>
              <option value="type">Tipo de agenda</option>
            </select>
          </div>

          <span className="portal-appointments-summary" style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>
            {sortedAppointments.length} agendamentos · página {currentPage} de {totalPages}
          </span>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {paginatedAppointments.map((appointment) => {
            const pet = pets.find((item) => item.id === appointment.petId);
            return (
              <div key={appointment.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '17px', color: 'var(--portal-text)' }}>{appointment.service}</strong>
                    <span style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>{pet?.avatar} {pet?.name} · {appointment.veterinarian}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', background: appointment.type === 'Táxi Pet' ? 'var(--portal-pill-warn-bg)' : 'var(--portal-pill-info-bg)', color: appointment.type === 'Táxi Pet' ? 'var(--portal-pill-warn-text)' : 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 700, height: 'fit-content' }}>
                      {appointment.type}
                    </span>
                    <span style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', background: appointment.status === 'Concluído' ? 'var(--portal-pill-success-bg)' : 'var(--portal-pill-info-bg)', color: appointment.status === 'Concluído' ? 'var(--portal-pill-success-text)' : 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 700, height: 'fit-content' }}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="portal-mini-grid portal-appointments-meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  <div><span className="portal-mini-label">Data</span><strong style={{ color: 'var(--portal-text)' }}>{appointment.date}</strong></div>
                  <div><span className="portal-mini-label">Hora</span><strong style={{ color: 'var(--portal-text)' }}>{appointment.time}</strong></div>
                  <div><span className="portal-mini-label">Unidade</span><strong style={{ color: 'var(--portal-text)' }}>{appointment.location}</strong></div>
                </div>
                {appointment.type === 'Táxi Pet' && (
                  <div className="portal-appointments-route" style={{ marginTop: '14px', padding: '14px', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--portal-accent) 8%, var(--portal-soft-surface))', border: '1px solid var(--portal-border)' }}>
                    <div className="portal-appointments-route-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                      <div>
                        <span className="portal-mini-label">Coleta</span>
                        <strong style={{ color: 'var(--portal-text)' }}>{appointment.pickupAddress}</strong>
                      </div>
                      <div>
                        <span className="portal-mini-label">Destino</span>
                        <strong style={{ color: 'var(--portal-text)' }}>{appointment.destinationAddress}</strong>
                      </div>
                      <div>
                        <span className="portal-mini-label">Trecho</span>
                        <strong style={{ color: 'var(--portal-text)' }}>{appointment.transportMode}</strong>
                      </div>
                      <div>
                        <span className="portal-mini-label">Acompanhamento</span>
                        <strong style={{ color: 'var(--portal-text)' }}>{appointment.companion}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedAppointments.length === 0 && (
            <div className="portal-surface" style={{ padding: '20px' }}>
              <strong style={{ display: 'block', color: 'var(--portal-text)', marginBottom: '6px' }}>Nenhum agendamento encontrado</strong>
              <p style={{ color: 'var(--portal-muted)', fontSize: '14px' }}>
                Ajuste a busca, o status ou a ordenação para localizar o agendamento.
              </p>
            </div>
          )}
        </div>

        {sortedAppointments.length > 0 && totalPages > 1 && (
          <div className="portal-appointments-pagination" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="portal-ghost-btn" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: currentPage === page ? 'var(--portal-accent)' : 'var(--portal-border)',
                    background: currentPage === page ? 'var(--portal-accent)' : 'var(--portal-soft-surface)',
                    color: currentPage === page ? '#fff' : 'var(--portal-text)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              );
            })}
            <button className="portal-ghost-btn" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
              Próxima
            </button>
          </div>
        )}
      </PortalSectionCard>

      <PortalSectionCard title="Novo agendamento" eyebrow="Mock funcional">
        <form onSubmit={onCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select className="portal-input" value={appointmentForm.type} onChange={(event) => setAppointmentForm((prev) => ({
            ...prev,
            type: event.target.value as ClientAppointment['type'],
            service: event.target.value === 'Táxi Pet' ? 'Táxi Pet para consulta ou banho' : 'Consulta clínica premium',
            veterinarian: event.target.value === 'Táxi Pet' ? 'Central de mobilidade pet' : veterinarians[0]?.name ?? ''
          }))}>
            <option value="Serviço">Serviço veterinário</option>
            <option value="Táxi Pet">Táxi Pet</option>
          </select>
          <select className="portal-input" value={appointmentForm.petId} onChange={(event) => setAppointmentForm({ ...appointmentForm, petId: event.target.value })}>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
          {appointmentForm.type === 'Táxi Pet' ? (
            <>
              <select className="portal-input" value={appointmentForm.service} onChange={(event) => setAppointmentForm({ ...appointmentForm, service: event.target.value })}>
                <option>Táxi Pet para consulta ou banho</option>
                <option>Táxi Pet para retorno veterinário</option>
                <option>Táxi Pet para hospedagem e day care</option>
              </select>
              <input
                className="portal-input"
                type="text"
                placeholder="Endereço de coleta"
                value={appointmentForm.pickupAddress}
                onChange={(event) => setAppointmentForm({ ...appointmentForm, pickupAddress: event.target.value })}
              />
              <select className="portal-input" value={appointmentForm.destinationAddress} onChange={(event) => setAppointmentForm({ ...appointmentForm, destinationAddress: event.target.value })}>
                <option>Unidade Coroado</option>
                <option>Unidade Vieiralves</option>
                <option>Centro cirúrgico pet</option>
              </select>
              <div className="portal-appointments-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                <select className="portal-input" value={appointmentForm.transportMode} onChange={(event) => setAppointmentForm({ ...appointmentForm, transportMode: event.target.value as NonNullable<ClientAppointment['transportMode']> })}>
                  <option>Somente ida</option>
                  <option>Ida e volta</option>
                </select>
                <select className="portal-input" value={appointmentForm.companion} onChange={(event) => setAppointmentForm({ ...appointmentForm, companion: event.target.value as NonNullable<ClientAppointment['companion']> })}>
                  <option>Tutor acompanha</option>
                  <option>Pet desacompanhado</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <select className="portal-input" value={appointmentForm.service} onChange={(event) => setAppointmentForm({ ...appointmentForm, service: event.target.value })}>
                <option>Consulta clínica premium</option>
                <option>Banho terapêutico premium</option>
                <option>Avaliação de ambiente aquático</option>
                <option>Retorno veterinário</option>
              </select>
              <select className="portal-input" value={appointmentForm.veterinarian} onChange={(event) => setAppointmentForm({ ...appointmentForm, veterinarian: event.target.value })}>
                {veterinarians.map((vet) => (
                  <option key={vet.id} value={vet.name}>{vet.name}</option>
                ))}
              </select>
            </>
          )}
          <input
            className="portal-input"
            type="text"
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            value={appointmentForm.date}
            onChange={(event) => setAppointmentForm({ ...appointmentForm, date: formatDateInput(event.target.value) })}
          />
          <input className="portal-input" type="time" value={appointmentForm.time} onChange={(event) => setAppointmentForm({ ...appointmentForm, time: event.target.value })} />
          <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '15px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {appointmentForm.type === 'Táxi Pet' ? 'Confirmar rota Táxi Pet' : 'Confirmar agendamento mockado'}
          </button>
        </form>
      </PortalSectionCard>
    </div>
  );
};
