import React from 'react';
import { ArrowLeft, PawPrint, ShieldCheck, Smartphone, MapPinHouse, Tags } from 'lucide-react';
import type { BackofficeClient, BackofficePet } from '@/services/backoffice';
import { BackofficeSectionCard } from './BackofficeSectionCard';

interface AdminClientDetailViewProps {
  client: BackofficeClient;
  pets: BackofficePet[];
  onBack: () => void;
}

export const AdminClientDetailView: React.FC<AdminClientDetailViewProps> = ({ client, pets, onBack }) => {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div className="backoffice-card" style={{ padding: '24px', display: 'grid', gap: '18px', background: 'var(--backoffice-hero)' }}>
        <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', minWidth: 0 }}>
            <button className="backoffice-ghost-btn" type="button" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
              <ArrowLeft size={16} />
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
            <span className="backoffice-pill backoffice-status-info"><PawPrint size={14} /> {pets.length} pets vinculados</span>
            <span className="backoffice-pill backoffice-status-success"><ShieldCheck size={14} /> Plano {client.plan}</span>
          </div>
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Canal principal</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={15} />
              {client.phone}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Localização</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPinHouse size={15} />
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
              <Tags size={15} />
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
          <div style={{ display: 'grid', gap: '14px' }}>
            {pets.length > 0 ? pets.map((pet) => (
              <article key={pet.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)', display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '14px', minWidth: 0 }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--backoffice-surface)', display: 'grid', placeItems: 'center', fontSize: '28px', flexShrink: 0 }}>
                      {pet.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{pet.name}</strong>
                      <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                        {pet.species} · {pet.sex} · {pet.breed}
                      </p>
                      <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>
                        {pet.age} · {pet.weight}
                      </p>
                    </div>
                  </div>
                  <span className={`backoffice-pill ${pet.status === 'Ativo' ? 'backoffice-status-success' : pet.status === 'Em acompanhamento' ? 'backoffice-status-attention' : 'backoffice-status-info'}`}>
                    {pet.status}
                  </span>
                </div>

                <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  <div>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Última visita</span>
                    <strong style={{ color: 'var(--backoffice-text)' }}>{pet.lastVisit}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Próxima ação</span>
                    <strong style={{ color: 'var(--backoffice-text)' }}>{pet.nextAction}</strong>
                  </div>
                  <div>
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
