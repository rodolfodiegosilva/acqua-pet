import React from 'react';
import { AlertTriangle, Boxes, PackageSearch, PawPrint, UserRound, Wallet } from 'lucide-react';
import type { BackofficeAlert, BackofficeClient, BackofficeInventoryItem, BackofficeOrder, BackofficePet } from '@/services/backoffice';
import { BackofficeMetricCard } from '../components/BackofficeMetricCard';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminOverviewTabProps {
  clients: BackofficeClient[];
  pets: BackofficePet[];
  alerts: BackofficeAlert[];
  inventory: BackofficeInventoryItem[];
  orders: BackofficeOrder[];
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ clients, pets, alerts, inventory, orders }) => {
  const activeClients = clients.filter((client) => client.status === 'Ativo').length;
  const attentionPets = pets.filter((pet) => pet.status !== 'Ativo').length;
  const primeClients = clients.filter((client) => client.plan === 'Prime').length;
  const criticalStock = inventory.filter((item) => item.status === 'Crítico').length;
  const openOrders = orders.filter((order) => !['Entregue', 'Cancelado'].includes(order.status)).length;

  return (
    <>
      <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' }}>
        <BackofficeMetricCard icon={UserRound} label="Clientes na base" value={String(clients.length)} hint="Total de tutores monitorados pelo portal e operação." />
        <BackofficeMetricCard icon={PawPrint} label="Pets ativos" value={String(pets.length)} hint="Todos os perfis sob gestão da clínica e da loja." />
        <BackofficeMetricCard icon={AlertTriangle} label="Pets com atenção" value={String(attentionPets)} hint="Pacientes com retorno, observação ou cuidado ativo." />
        <BackofficeMetricCard icon={Wallet} label="Clientes Prime" value={String(primeClients)} hint="Base premium com maior recorrência e ticket médio." />
        <BackofficeMetricCard icon={Boxes} label="Estoque crítico" value={String(criticalStock)} hint="SKUs com ruptura próxima ou necessidade de reposição." />
        <BackofficeMetricCard icon={PackageSearch} label="Pedidos abertos" value={String(openOrders)} hint="Pedidos em separação, pagos ou enviados aguardando conclusão." />
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <BackofficeSectionCard title="Alertas operacionais" eyebrow="Prioridades">
          <div style={{ display: 'grid', gap: '14px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <span className={`backoffice-pill ${alert.tone === 'critical' ? 'backoffice-status-critical' : alert.tone === 'attention' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginBottom: '10px' }}>
                  {alert.tone === 'critical' ? 'Crítico' : alert.tone === 'attention' ? 'Atenção' : 'Informativo'}
                </span>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{alert.title}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{alert.description}</p>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Resumo da carteira" eyebrow="Relacionamento">
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              ['Clientes ativos', String(activeClients)],
              ['Clientes novos', String(clients.filter((client) => client.status === 'Novo').length)],
              ['Planos Care+ ou Prime', String(clients.filter((client) => client.plan !== 'Essential').length)],
              ['Pets multiespécie', String(clients.filter((client) => client.tags.includes('multiespécie')).length)],
              ['Pedidos cancelados', String(orders.filter((order) => order.status === 'Cancelado').length)],
              ['SKUs com estoque baixo', String(inventory.filter((item) => item.status !== 'Saudável').length)]
            ].map(([label, value]) => (
              <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--backoffice-border)' }}>
                <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '13px', marginBottom: '4px' }}>{label}</span>
                <strong style={{ color: 'var(--backoffice-text)', fontSize: '18px' }}>{value}</strong>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>
      </div>
    </>
  );
};
