import React from 'react';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import HomeWorkRounded from '@mui/icons-material/HomeWorkRounded';
import PetsRounded from '@mui/icons-material/PetsRounded';
import SellRounded from '@mui/icons-material/SellRounded';
import SmartphoneRounded from '@mui/icons-material/SmartphoneRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import type { BackofficeClient, BackofficePet } from '@/services/backoffice';
import { BackofficeSectionCard } from './BackofficeSectionCard';

interface AdminClientDetailViewProps {
  client: BackofficeClient;
  pets: BackofficePet[];
  onBack: () => void;
}

export const AdminClientDetailView: React.FC<AdminClientDetailViewProps> = ({ client, pets, onBack }) => {
  return (
    <div className="backoffice-admin-client-detail" style={{ display: 'grid', gap: '20px' }}>
      <div className="backoffice-card backoffice-detail-hero" style={{ padding: '24px', display: 'grid', gap: '18px', background: 'var(--backoffice-hero)' }}>
        <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', minWidth: 0 }}>
            <button className="backoffice-ghost-btn" type="button" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
              <ArrowBackRounded sx={{ fontSize: 16 }} />
              Voltar
            </button>
            <div style={{ minWidth: 0 }}>
              <span className={`backoffice-pill ${client.status === 'Ativo' ? 'backoffice-status-success' : client.status === 'Atenção' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginBottom: '10px' }}>
                {client.status}
              </span>
              <h2 style={{ color: 'var(--backoffice-text)', fontSize: '30px', marginBottom: '8px' }}>{client.name}</h2>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                {client.email} · {client.phone}
              </p>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                {client.city} · {client.neighborhood} · Cliente desde {client.joinedAt}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="backoffice-pill backoffice-status-info"><PetsRounded sx={{ fontSize: 14 }} /> {pets.length} pets vinculados</span>
            <span className="backoffice-pill backoffice-status-success"><VerifiedRounded sx={{ fontSize: 14 }} /> Plano {client.plan}</span>
          </div>
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Canal principal</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SmartphoneRounded sx={{ fontSize: 15 }} />
              {client.phone}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Localização</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HomeWorkRounded sx={{ fontSize: 15 }} />
              {client.neighborhood}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Plano atual</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{client.plan}</strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Marcadores</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SellRounded sx={{ fontSize: 15 }} />
              {client.tags.length}
            </strong>
          </div>
        </div>
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '20px', alignItems: 'start' }}>
        <BackofficeSectionCard title="Dados do relacionamento" eyebrow="Conta">
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              ['Email principal', client.email],
              ['Telefone', client.phone],
              ['Cidade', client.city],
              ['Bairro', client.neighborhood],
              ['Status da carteira', client.status],
              ['Entrada na base', client.joinedAt]
            ].map(([label, value]) => (
              <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--backoffice-border)' }}>
                <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '5px' }}>{label}</span>
                <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{value}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {client.tags.map((tag) => (
                <span key={tag} className="backoffice-pill backoffice-status-info">{tag}</span>
              ))}
            </div>
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Pets vinculados" eyebrow="Base animal">
          <div className="backoffice-admin-client-detail__pet-list" style={{ display: 'grid', gap: '14px' }}>
            {pets.length > 0 ? pets.map((pet) => (
              <article key={pet.id} className="backoffice-card backoffice-entity-card backoffice-admin-client-pet-card" style={{ padding: '18px', background: 'var(--backoffice-soft)', display: 'grid', gap: '14px' }}>
                <div className="backoffice-admin-client-pet-card__head" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div className="backoffice-admin-client-pet-card__identity" style={{ display: 'flex', gap: '14px', minWidth: 0 }}>
                    <div className="backoffice-admin-client-pet-card__avatar" style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--backoffice-surface)', display: 'grid', placeItems: 'center', fontSize: '28px', flexShrink: 0 }}>
                      {pet.avatar}
                    </div>
                    <div className="backoffice-admin-client-pet-card__content" style={{ minWidth: 0 }}>
                      <strong className="backoffice-admin-client-pet-card__title" style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{pet.name}</strong>
                      <p className="backoffice-admin-client-pet-card__subtitle" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                        {pet.species} · {pet.sex} · {pet.breed}
                      </p>
                      <p className="backoffice-admin-client-pet-card__subtitle" style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                        {pet.age} · {pet.weight}
                      </p>
                    </div>
                  </div>
                  <span className={`backoffice-pill backoffice-admin-client-pet-card__status ${pet.status === 'Ativo' ? 'backoffice-status-success' : pet.status === 'Em acompanhamento' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>
                    {pet.status}
                  </span>
                </div>

                <div className="backoffice-grid backoffice-admin-client-pet-card__meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  <div className="backoffice-admin-client-pet-card__meta-item">
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Última visita</span>
                    <strong style={{ color: 'var(--backoffice-text)' }}>{pet.lastVisit}</strong>
                  </div>
                  <div className="backoffice-admin-client-pet-card__meta-item">
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Próxima ação</span>
                    <strong style={{ color: 'var(--backoffice-text)' }}>{pet.nextAction}</strong>
                  </div>
                  <div className="backoffice-admin-client-pet-card__meta-item">
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Vacinas</span>
                    <strong style={{ color: 'var(--backoffice-text)' }}>{pet.vaccines.length > 0 ? pet.vaccines.join(', ') : 'Sem registro'}</strong>
                  </div>
                </div>

                <div style={{ paddingTop: '2px' }}>
                  <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Observação</span>
                  <p style={{ color: 'var(--backoffice-text)', lineHeight: 1.7 }}>{pet.observation || 'Sem observação cadastrada.'}</p>
                </div>
              </article>
            )) : (
              <div className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '8px' }}>Nenhum pet vinculado</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                  Este cliente ainda não possui pets cadastrados na base compartilhada do sistema.
                </p>
              </div>
            )}
          </div>
        </BackofficeSectionCard>
      </div>
    </div>
  );
};
