import React, { useEffect, useMemo, useState } from 'react';
import type { BackofficeClient, BackofficeOrder } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminOrdersTabProps {
  orders: BackofficeOrder[];
  clients: BackofficeClient[];
  onUpdateOrderStatus: (orderId: number, status: BackofficeOrder['status']) => void;
  onCancelOrder: (orderId: number) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, clients, onUpdateOrderStatus, onCancelOrder }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficeOrder['status']>('Todos');
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const client = clients.find((item) => item.id === order.clientId);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.number.toLowerCase().includes(normalizedQuery) ||
        client?.name.toLowerCase().includes(normalizedQuery) ||
        order.fulfillment.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, orders, query, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  return (
    <BackofficeSectionCard title="Pedidos da loja" eyebrow="Fulfillment e cancelamento">
      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.8fr)', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar pedido, cliente ou tipo de entrega" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | BackofficeOrder['status'])}>
          <option value="Todos">Todos os status</option>
          <option value="Separando">Separando</option>
          <option value="Pago">Pago</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedOrders.map((order) => {
          const client = clients.find((item) => item.id === order.clientId);
          return (
            <div key={order.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{order.number}</strong>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{client?.name} · {order.createdAt} · {order.fulfillment}</p>
                </div>
                <span className={`backoffice-pill ${order.status === 'Entregue' ? 'backoffice-status-success' : order.status === 'Cancelado' ? 'backoffice-status-critical' : order.status === 'Enviado' ? 'backoffice-status-info' : 'backoffice-status-attention'}`}>
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                {order.items.map((item) => (
                  <p key={`${order.id}-${item.productId}`} style={{ color: 'var(--backoffice-text)', lineHeight: 1.55 }}>
                    {item.quantity}x {item.name} · R$ {item.unitPrice.toFixed(2)}
                  </p>
                ))}
              </div>

              <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Total</span><strong style={{ color: 'var(--backoffice-text)' }}>R$ {order.total.toFixed(2)}</strong></div>
                <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Observação</span><strong style={{ color: 'var(--backoffice-text)' }}>{order.notes}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {order.status !== 'Cancelado' && order.status !== 'Entregue' && (
                  <>
                    <button className="backoffice-ghost-btn" onClick={() => onUpdateOrderStatus(order.id, order.status === 'Separando' ? 'Pago' : order.status === 'Pago' ? 'Enviado' : 'Entregue')}>
                      Avançar status
                    </button>
                    <button className="backoffice-ghost-btn" onClick={() => onCancelOrder(order.id)}>
                      Cancelar pedido
                    </button>
                  </>
                )}
                {order.status === 'Cancelado' && (
                  <button className="backoffice-primary-btn" onClick={() => onUpdateOrderStatus(order.id, 'Pago')}>
                    Reativar como pago
                  </button>
                )}
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
