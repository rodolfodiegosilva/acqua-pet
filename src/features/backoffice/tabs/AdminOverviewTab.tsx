import React from 'react';
import Inventory2Rounded from '@mui/icons-material/Inventory2Rounded';
import ManageSearchRounded from '@mui/icons-material/ManageSearchRounded';
import PetsRounded from '@mui/icons-material/PetsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PriorityHighRounded from '@mui/icons-material/PriorityHighRounded';
import WalletRounded from '@mui/icons-material/WalletRounded';
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
  const newClients = clients.filter((client) => client.status === 'Novo').length;
  const upgradedClients = clients.filter((client) => client.plan !== 'Essential').length;
  const multispeciesClients = clients.filter((client) => client.tags.includes('multiespécie')).length;
  const canceledOrders = orders.filter((order) => order.status === 'Cancelado').length;
  const lowStockItems = inventory.filter((item) => item.status !== 'Saudável').length;

  const relationshipMetrics = [
    {
      label: 'Clientes novos',
      value: String(newClients),
      hint: 'Entradas recentes aguardando ativação plena na carteira.'
    },
    {
      label: 'Planos Care+ ou Prime',
      value: String(upgradedClients),
      hint: 'Clientes com maior recorrência e potencial comercial.'
    },
    {
      label: 'Tutoria multiespécie',
      value: String(multispeciesClients),
      hint: 'Famílias com maior profundidade de relacionamento.'
    },
    {
      label: 'Pedidos cancelados',
      value: String(canceledOrders),
      hint: 'Pontos de atrito comercial para reengajamento.'
    },
    {
      label: 'SKUs sob pressão',
      value: String(lowStockItems),
      hint: 'Itens que podem afetar retenção e experiência de compra.'
    }
  ];

  return (
    <>
      <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' }}>
        <BackofficeMetricCard icon={PersonRounded} label="Clientes na base" value={String(clients.length)} hint="Total de tutores monitorados pelo portal e operação." />
        <BackofficeMetricCard icon={PetsRounded} label="Pets ativos" value={String(pets.length)} hint="Todos os perfis sob gestão da clínica e da loja." />
        <BackofficeMetricCard icon={PriorityHighRounded} label="Pets com atenção" value={String(attentionPets)} hint="Pacientes com retorno, observação ou cuidado ativo." />
        <BackofficeMetricCard icon={WalletRounded} label="Clientes Prime" value={String(primeClients)} hint="Base premium com maior recorrência e ticket médio." />
        <BackofficeMetricCard icon={Inventory2Rounded} label="Estoque crítico" value={String(criticalStock)} hint="SKUs com ruptura próxima ou necessidade de reposição." />
        <BackofficeMetricCard icon={ManageSearchRounded} label="Pedidos abertos" value={String(openOrders)} hint="Pedidos em separação, pagos ou enviados aguardando conclusão." />
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <BackofficeSectionCard title="Alertas operacionais" eyebrow="Prioridades">
          <div className="backoffice-admin-overview-list" style={{ display: 'grid', gap: '14px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} className="backoffice-card backoffice-alert-card backoffice-admin-alert-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <span className={`backoffice-pill backoffice-admin-alert-card__status ${alert.tone === 'critical' ? 'backoffice-status-critical' : alert.tone === 'attention' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginBottom: '10px' }}>
                  {alert.tone === 'critical' ? 'Crítico' : alert.tone === 'attention' ? 'Atenção' : 'Informativo'}
                </span>
                <strong className="backoffice-admin-alert-card__title" style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '6px' }}>{alert.title}</strong>
                <p className="backoffice-admin-alert-card__copy" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{alert.description}</p>
              </div>
            ))}
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Resumo da carteira" eyebrow="Relacionamento">
          <div className="backoffice-relationship-panel">
            <div className="backoffice-relationship-hero">
              <span className="backoffice-pill backoffice-status-info">Base acompanhada</span>
              <strong className="backoffice-relationship-value">{activeClients}</strong>
              <span className="backoffice-relationship-label">clientes ativos com relacionamento em andamento</span>
              <p className="backoffice-relationship-copy">
                Carteira viva entre assinaturas, recorrência clínica e consumo de loja. O foco aqui é retenção, upgrade de plano e prevenção de atrito operacional.
              </p>
            </div>

            <div className="backoffice-relationship-grid">
              {relationshipMetrics.map((item) => (
                <div key={item.label} className="backoffice-relationship-card">
                  <span className="backoffice-relationship-card-label">{item.label}</span>
                  <strong className="backoffice-relationship-card-value">{item.value}</strong>
                  <p className="backoffice-relationship-card-hint">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </BackofficeSectionCard>
      </div>
    </>
  );
};
