import React, { useEffect, useMemo, useState } from 'react';
import InventoryRounded from '@mui/icons-material/InventoryRounded';
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded';
import WalletRounded from '@mui/icons-material/WalletRounded';
import { AppPagination, getResponsiveDefaultPageSize } from '@/components/pagination/AppPagination';
import type { BackofficeClient, BackofficeOrder } from '@/services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminOrdersTabProps {
  orders: BackofficeOrder[];
  clients: BackofficeClient[];
  onUpdateOrderStatus: (orderId: number, status: BackofficeOrder['status']) => void;
  onEditOrder: (orderId: number, updates: Partial<Pick<BackofficeOrder, 'status' | 'fulfillment' | 'notes'>>) => void;
  onCancelOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: BackofficeOrder['status'][] = ['Separando', 'Pago', 'Enviado', 'Entregue', 'Cancelado'];
const FULFILLMENT_OPTIONS: BackofficeOrder['fulfillment'][] = ['Entrega', 'Retirada'];

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  clients,
  onUpdateOrderStatus,
  onEditOrder,
  onCancelOrder,
  onDeleteOrder,
  isSubmitting = false
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficeOrder['status']>('Todos');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsiveDefaultPageSize());
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    status: 'Separando' as BackofficeOrder['status'],
    fulfillment: 'Entrega' as BackofficeOrder['fulfillment'],
    notes: ''
  });

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
  }, [query, statusFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
  const selectedOrder = selectedOrderId ? orders.find((order) => order.id === selectedOrderId) ?? null : null;
  const selectedClient = selectedOrder ? clients.find((item) => item.id === selectedOrder.clientId) ?? null : null;
  const openOrders = orders.filter((order) => !['Entregue', 'Cancelado'].includes(order.status)).length;
  const canceledOrders = orders.filter((order) => order.status === 'Cancelado').length;
  const paidOrders = orders.filter((order) => ['Pago', 'Enviado', 'Entregue'].includes(order.status)).length;

  const openOrderModal = (order: BackofficeOrder) => {
    setSelectedOrderId(order.id);
    setEditForm({
      status: order.status,
      fulfillment: order.fulfillment,
      notes: order.notes
    });
  };

  return (
    <BackofficeSectionCard title="Pedidos da loja" eyebrow="Fulfillment e cancelamento">
      <div className="backoffice-inventory-summary">
        <div className="backoffice-relationship-card">
          <span className="backoffice-relationship-card-label">Pedidos no painel</span>
          <strong className="backoffice-relationship-card-value">{orders.length}</strong>
          <p className="backoffice-relationship-card-hint">Todos os pedidos persistidos na base mockada compartilhada.</p>
        </div>
        <div className="backoffice-relationship-card">
          <span className="backoffice-relationship-card-label">Pedidos em fluxo</span>
          <strong className="backoffice-relationship-card-value">{openOrders}</strong>
          <p className="backoffice-relationship-card-hint">Pedidos que ainda exigem separação, envio ou fechamento operacional.</p>
        </div>
        <div className="backoffice-relationship-card">
          <span className="backoffice-relationship-card-label">Pedidos pagos</span>
          <strong className="backoffice-relationship-card-value">{paidOrders}</strong>
          <p className="backoffice-relationship-card-hint">Base com receita já capturada e pronta para fulfillment.</p>
        </div>
        <div className="backoffice-relationship-card">
          <span className="backoffice-relationship-card-label">Pedidos cancelados</span>
          <strong className="backoffice-relationship-card-value">{canceledOrders}</strong>
          <p className="backoffice-relationship-card-hint">Cancelamentos rastreados para análise de atrito comercial.</p>
        </div>
      </div>

      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.8fr)', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar pedido, cliente ou tipo de entrega" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | BackofficeOrder['status'])}>
          <option value="Todos">Todos os status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="backoffice-admin-order-list" style={{ display: 'grid', gap: '14px' }}>
        {paginatedOrders.map((order) => {
          const client = clients.find((item) => item.id === order.clientId);
          return (
            <button
              key={order.id}
              type="button"
              className="backoffice-card backoffice-inventory-item backoffice-admin-order-card"
              onClick={() => openOrderModal(order)}
              style={{ padding: '18px', background: 'var(--backoffice-soft)', textAlign: 'left', cursor: 'pointer' }}
            >
              <div className="backoffice-admin-order-card__head" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div className="backoffice-admin-order-card__content">
                  <strong className="backoffice-admin-order-card__title" style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{order.number}</strong>
                  <p className="backoffice-admin-order-card__subtitle" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{client?.name} · {order.createdAt} · {order.fulfillment}</p>
                </div>
                <span className={`backoffice-pill backoffice-admin-order-card__status ${order.status === 'Entregue' ? 'backoffice-status-success' : order.status === 'Cancelado' ? 'backoffice-status-critical' : order.status === 'Enviado' ? 'backoffice-status-info' : 'backoffice-status-attention'}`}>
                  {order.status}
                </span>
              </div>

              <div className="backoffice-mini-grid backoffice-admin-order-card__meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Itens</span>
                  <strong style={{ color: 'var(--backoffice-text)' }}>{order.items.length}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Total</span>
                  <strong style={{ color: 'var(--backoffice-text)' }}>R$ {order.total.toFixed(2)}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Entrega</span>
                  <strong style={{ color: 'var(--backoffice-text)' }}>{order.fulfillment}</strong>
                </div>
              </div>

              <p className="backoffice-admin-order-card__notes" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6, fontSize: '14px' }}>
                {order.notes}
              </p>
            </button>
          );
        })}
      </div>

      <AppPagination page={page} count={totalPages} pageSize={pageSize} onPageSizeChange={setPageSize} onChange={setPage} tone="backoffice" />

      {selectedOrder && (
        <div className="backoffice-modal-overlay" onClick={() => setSelectedOrderId(null)}>
          <div className="backoffice-card backoffice-product-modal" onClick={(event) => event.stopPropagation()}>
            <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '20px', marginBottom: '6px' }}>Gerenciar pedido {selectedOrder.number}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                  {selectedClient?.name} · {selectedOrder.createdAt} · {selectedOrder.fulfillment}
                </p>
              </div>
              <button type="button" className="backoffice-ghost-btn" onClick={() => setSelectedOrderId(null)}>Fechar</button>
            </div>

            <div className="backoffice-product-modal-grid">
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                  <label style={{ display: 'grid', gap: '8px' }}>
                    <span style={{ color: 'var(--backoffice-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Status</span>
                    <select className="backoffice-select" value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value as BackofficeOrder['status'] }))}>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '8px' }}>
                    <span style={{ color: 'var(--backoffice-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Fulfillment</span>
                    <select className="backoffice-select" value={editForm.fulfillment} onChange={(event) => setEditForm((current) => ({ ...current, fulfillment: event.target.value as BackofficeOrder['fulfillment'] }))}>
                      {FULFILLMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ color: 'var(--backoffice-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Observações internas</span>
                  <textarea
                    className="backoffice-input backoffice-textarea"
                    rows={5}
                    value={editForm.notes}
                    onChange={(event) => setEditForm((current) => ({ ...current, notes: event.target.value }))}
                  />
                </label>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="backoffice-primary-btn"
                    disabled={isSubmitting}
                    onClick={() => onEditOrder(selectedOrder.id, editForm)}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar edição'}
                  </button>
                  {selectedOrder.status !== 'Cancelado' && (
                    <button
                      type="button"
                      className="backoffice-ghost-btn"
                      disabled={isSubmitting}
                      onClick={() => onCancelOrder(selectedOrder.id)}
                    >
                      Cancelar pedido
                    </button>
                  )}
                  <button
                    type="button"
                    className="backoffice-ghost-btn"
                    disabled={isSubmitting}
                    onClick={() => onDeleteOrder(selectedOrder.id)}
                  >
                    Excluir pedido
                  </button>
                  {selectedOrder.status !== 'Entregue' && selectedOrder.status !== 'Cancelado' && (
                    <button
                      type="button"
                      className="backoffice-ghost-btn"
                      disabled={isSubmitting}
                      onClick={() =>
                        onUpdateOrderStatus(
                          selectedOrder.id,
                          selectedOrder.status === 'Separando'
                            ? 'Pago'
                            : selectedOrder.status === 'Pago'
                              ? 'Enviado'
                              : 'Entregue'
                        )
                      }
                    >
                      Avançar status
                    </button>
                  )}
                </div>
              </div>

              <div className="backoffice-card backoffice-product-preview-shell" style={{ padding: '16px', background: 'var(--backoffice-soft)', display: 'grid', gap: '14px' }}>
                <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  <div className="backoffice-card" style={{ padding: '14px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Total</span>
                    <strong style={{ color: 'var(--backoffice-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <WalletRounded sx={{ fontSize: 15 }} />
                      R$ {selectedOrder.total.toFixed(2)}
                    </strong>
                  </div>
                  <div className="backoffice-card" style={{ padding: '14px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Entrega</span>
                    <strong style={{ color: 'var(--backoffice-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LocalShippingRounded sx={{ fontSize: 15 }} />
                      {selectedOrder.fulfillment}
                    </strong>
                  </div>
                  <div className="backoffice-card" style={{ padding: '14px', background: 'var(--backoffice-surface)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Itens</span>
                    <strong style={{ color: 'var(--backoffice-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <InventoryRounded sx={{ fontSize: 15 }} />
                      {selectedOrder.items.length}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {selectedOrder.items.map((item) => (
                    <div key={`${selectedOrder.id}-${item.productId}`} className="backoffice-card" style={{ padding: '14px', background: 'var(--backoffice-surface)' }}>
                      <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{item.name}</strong>
                      <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                        {item.quantity}x unidade(s) · R$ {item.unitPrice.toFixed(2)} cada
                      </p>
                    </div>
                  ))}
                </div>

                <div className="backoffice-card" style={{ padding: '14px', background: 'var(--backoffice-surface)' }}>
                  <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Cliente</span>
                  <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '4px' }}>{selectedClient?.name ?? 'Cliente não encontrado'}</strong>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{selectedClient?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BackofficeSectionCard>
  );
};
