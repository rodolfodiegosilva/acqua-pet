import React, { useEffect, useMemo, useState } from 'react';
import type { BackofficeClient } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminClientsTabProps {
  clients: BackofficeClient[];
}

export const AdminClientsTab: React.FC<AdminClientsTabProps> = ({ clients }) => {
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'Todos' | BackofficeClient['plan']>('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'joinedAt' | 'status'>('name');
  const [page, setPage] = useState(1);

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
  }, [query, planFilter, sortBy]);

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(sortedClients.length / perPage));
  const paginatedClients = sortedClients.slice((page - 1) * perPage, page * perPage);

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
          <div key={client.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
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
          </div>
        ))}
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
