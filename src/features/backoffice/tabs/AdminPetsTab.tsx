import React, { useEffect, useMemo, useState } from 'react';
import type { BackofficeClient, BackofficePet } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminPetsTabProps {
  pets: BackofficePet[];
  clients: BackofficeClient[];
}

export const AdminPetsTab: React.FC<AdminPetsTabProps> = ({ pets, clients }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficePet['status']>('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'species'>('lastVisit');
  const [page, setPage] = useState(1);

  const filteredPets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return pets.filter((pet) => {
      const tutor = clients.find((client) => client.id === pet.clientId);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        pet.name.toLowerCase().includes(normalizedQuery) ||
        pet.species.toLowerCase().includes(normalizedQuery) ||
        tutor?.name.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || pet.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, pets, query, statusFilter]);

  const sortedPets = useMemo(() => {
    return [...filteredPets].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      if (sortBy === 'species') return a.species.localeCompare(b.species, 'pt-BR');
      return b.lastVisit.localeCompare(a.lastVisit, 'pt-BR');
    });
  }, [filteredPets, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(sortedPets.length / perPage));
  const paginatedPets = sortedPets.slice((page - 1) * perPage, page * perPage);

  return (
    <BackofficeSectionCard title="Base de pets" eyebrow="Perfis clínicos">
      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) repeat(2, minmax(0, 0.7fr))', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar pet, espécie ou tutor" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | BackofficePet['status'])}>
          <option value="Todos">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Em acompanhamento">Em acompanhamento</option>
          <option value="Observação">Observação</option>
        </select>
        <select className="backoffice-select" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'name' | 'lastVisit' | 'species')}>
          <option value="lastVisit">Último atendimento</option>
          <option value="name">Nome</option>
          <option value="species">Espécie</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedPets.map((pet) => {
          const tutor = clients.find((client) => client.id === pet.clientId);
          return (
            <div key={pet.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '18px', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{pet.avatar} {pet.name}</strong>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{pet.species} · {pet.sex} · {pet.breed}</p>
                </div>
                <span className={`backoffice-pill ${pet.status === 'Ativo' ? 'backoffice-status-success' : pet.status === 'Em acompanhamento' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>
                  {pet.status}
                </span>
              </div>

              <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Tutor</span><strong style={{ color: 'var(--backoffice-text)' }}>{tutor?.name ?? pet.tutorName}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Última visita</span><strong style={{ color: 'var(--backoffice-text)' }}>{pet.lastVisit}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Próxima ação</span><strong style={{ color: 'var(--backoffice-text)' }}>{pet.nextAction}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Vacinas</span><strong style={{ color: 'var(--backoffice-text)' }}>{pet.vaccines.length || 0}</strong></div>
              </div>

              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6, fontSize: '14px', marginTop: '14px' }}>{pet.observation}</p>
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
