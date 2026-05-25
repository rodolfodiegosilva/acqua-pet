import React, { useEffect, useMemo, useState } from 'react';
import type { BackofficeClient, BackofficePet } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminPetsTabProps {
  pets: BackofficePet[];
  clients: BackofficeClient[];
  onUpdatePet: (petId: number, updates: Partial<Omit<BackofficePet, 'id' | 'clientId' | 'tutorName' | 'vaccines'>>) => void;
  isSubmitting?: boolean;
}

export const AdminPetsTab: React.FC<AdminPetsTabProps> = ({ pets, clients, onUpdatePet, isSubmitting = false }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficePet['status']>('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'species'>('lastVisit');
  const [page, setPage] = useState(1);
  const [editingPet, setEditingPet] = useState<BackofficePet | null>(null);
  const [form, setForm] = useState({
    name: '',
    species: '',
    sex: '',
    breed: '',
    age: '',
    weight: '',
    observation: '',
    status: 'Ativo' as BackofficePet['status'],
    lastVisit: '',
    nextAction: ''
  });

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

  const startEditingPet = (pet: BackofficePet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      species: pet.species,
      sex: pet.sex,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      observation: pet.observation,
      status: pet.status,
      lastVisit: pet.lastVisit,
      nextAction: pet.nextAction
    });
  };

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
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
                <button type="button" className="backoffice-primary-btn" onClick={() => startEditingPet(pet)}>Editar cadastro</button>
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

      {editingPet && (
        <div
          onClick={() => setEditingPet(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.68)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 160 }}
        >
          <div
            className="backoffice-card"
            onClick={(event) => event.stopPropagation()}
            style={{ width: 'min(760px, 100%)', maxHeight: '88vh', overflowY: 'auto', padding: '24px', display: 'grid', gap: '16px' }}
          >
            <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--backoffice-accent-strong)', marginBottom: '8px' }}>
                  Edição de pet
                </span>
                <h3 style={{ fontSize: '24px', color: 'var(--backoffice-text)' }}>Editar cadastro de {editingPet.name}</h3>
              </div>
              <button type="button" className="backoffice-ghost-btn" onClick={() => setEditingPet(null)}>Fechar</button>
            </div>

            <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              <input className="backoffice-input" type="text" placeholder="Nome do pet" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              <input className="backoffice-input" type="text" placeholder="Espécie" value={form.species} onChange={(event) => setForm((current) => ({ ...current, species: event.target.value }))} />
              <input className="backoffice-input" type="text" placeholder="Sexo" value={form.sex} onChange={(event) => setForm((current) => ({ ...current, sex: event.target.value }))} />
              <input className="backoffice-input" type="text" placeholder="Raça" value={form.breed} onChange={(event) => setForm((current) => ({ ...current, breed: event.target.value }))} />
              <input className="backoffice-input" type="text" placeholder="Idade" value={form.age} onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))} />
              <input className="backoffice-input" type="text" placeholder="Peso" value={form.weight} onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))} />
              <select className="backoffice-select" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BackofficePet['status'] }))}>
                <option value="Ativo">Ativo</option>
                <option value="Em acompanhamento">Em acompanhamento</option>
                <option value="Observação">Observação</option>
              </select>
              <input className="backoffice-input" type="text" placeholder="Última visita" value={form.lastVisit} onChange={(event) => setForm((current) => ({ ...current, lastVisit: event.target.value }))} />
            </div>

            <input className="backoffice-input" type="text" placeholder="Próxima ação" value={form.nextAction} onChange={(event) => setForm((current) => ({ ...current, nextAction: event.target.value }))} />
            <textarea className="backoffice-input backoffice-textarea" rows={4} placeholder="Observação" value={form.observation} onChange={(event) => setForm((current) => ({ ...current, observation: event.target.value }))} />

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="backoffice-primary-btn"
                disabled={isSubmitting}
                onClick={() => {
                  onUpdatePet(editingPet.id, {
                    name: form.name,
                    species: form.species as BackofficePet['species'],
                    sex: form.sex as BackofficePet['sex'],
                    breed: form.breed,
                    age: form.age,
                    weight: form.weight,
                    observation: form.observation,
                    status: form.status,
                    lastVisit: form.lastVisit,
                    nextAction: form.nextAction
                  });
                  setEditingPet(null);
                }}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <button type="button" className="backoffice-ghost-btn" onClick={() => setEditingPet(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </BackofficeSectionCard>
  );
};
