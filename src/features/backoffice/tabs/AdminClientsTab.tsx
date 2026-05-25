import React, { useEffect, useMemo, useState } from 'react';
import { AppPagination, getResponsiveDefaultPageSize } from '@/components/pagination/AppPagination';
import type { BackofficeClient, BackofficePet } from '@/services/backoffice';
import { AdminClientDetailView } from '../components/AdminClientDetailView';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminClientsTabProps {
  clients: BackofficeClient[];
  pets: BackofficePet[];
  selectedClientId: number | null;
  onSelectClient: (clientId: number) => void;
  onBackToList: () => void;
}

export const AdminClientsTab: React.FC<AdminClientsTabProps> = ({ clients, pets, selectedClientId, onSelectClient, onBackToList }) => {
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'Todos' | BackofficeClient['plan']>('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'joinedAt' | 'status'>('name');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsiveDefaultPageSize());

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        client.name.toLowerCase().includes(normalizedQuery) ||
        client.email.toLowerCase().includes(normalizedQuery) ||
        client.neighborhood.toLowerCase().includes(normalizedQuery);

      const matchesPlan = planFilter === 'Todos' || client.plan === planFilter;
      return matchesQuery && matchesPlan;
    });
  }, [clients, planFilter, query]);

  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      if (sortBy === 'status') return a.status.localeCompare(b.status, 'pt-BR');
      if (sortBy === 'joinedAt') return b.joinedAt.localeCompare(a.joinedAt, 'pt-BR');
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [filteredClients, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, planFilter, sortBy, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / pageSize));
  const paginatedClients = sortedClients.slice((page - 1) * pageSize, page * pageSize);
  const selectedClient = selectedClientId ? clients.find((client) => client.id === selectedClientId) ?? null : null;
  const selectedClientPets = selectedClient ? pets.filter((pet) => pet.clientId === selectedClient.id) : [];

  if (selectedClient) {
    return <AdminClientDetailView client={selectedClient} pets={selectedClientPets} onBack={onBackToList} />;
  }

  return (
    <BackofficeSectionCard title="Gestão de clientes" eyebrow="CRM clínico">
      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) repeat(2, minmax(0, 0.7fr))', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar nome, email ou bairro" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={planFilter} onChange={(event) => setPlanFilter(event.target.value as 'Todos' | BackofficeClient['plan'])}>
          <option value="Todos">Todos os planos</option>
          <option value="Essential">Essential</option>
          <option value="Care+">Care+</option>
          <option value="Prime">Prime</option>
        </select>
        <select className="backoffice-select" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'name' | 'joinedAt' | 'status')}>
          <option value="name">Nome</option>
          <option value="joinedAt">Entrada mais recente</option>
          <option value="status">Status</option>
        </select>
      </div>

      <span style={{ color: 'var(--backoffice-muted)', fontSize: '13px' }}>
        {sortedClients.length} clientes encontrados · página {page} de {totalPages}
      </span>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedClients.map((client) => (
          <button
            key={client.id}
            type="button"
            className="backoffice-card"
            onClick={() => onSelectClient(client.id)}
            style={{ padding: '18px', background: 'var(--backoffice-soft)', textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{client.name}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{client.email} · {client.phone}</p>
              </div>
              <span className={`backoffice-pill ${client.status === 'Ativo' ? 'backoffice-status-success' : client.status === 'Atenção' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>
                {client.status}
              </span>
            </div>

            <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Plano</span><strong style={{ color: 'var(--backoffice-text)' }}>{client.plan}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Cidade</span><strong style={{ color: 'var(--backoffice-text)' }}>{client.city}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Bairro</span><strong style={{ color: 'var(--backoffice-text)' }}>{client.neighborhood}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Desde</span><strong style={{ color: 'var(--backoffice-text)' }}>{client.joinedAt}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
              {client.tags.map((tag) => (
                <span key={tag} className="backoffice-pill backoffice-status-info">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <AppPagination page={page} count={totalPages} pageSize={pageSize} onPageSizeChange={setPageSize} onChange={setPage} tone="backoffice" />
    </BackofficeSectionCard>
  );
};
