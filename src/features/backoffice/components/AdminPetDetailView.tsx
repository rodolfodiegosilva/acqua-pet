import React from 'react';
import { ArrowLeft, CalendarClock, MapPinHouse, ShieldCheck, Smartphone, UserRound } from 'lucide-react';
import type { BackofficeClient, BackofficePet } from '@/services/backoffice';
import { BackofficeSectionCard } from './BackofficeSectionCard';

interface AdminPetDetailViewProps {
  pet: BackofficePet;
  tutor: BackofficeClient | null;
  onBack: () => void;
  onEdit: () => void;
}

export const AdminPetDetailView: React.FC<AdminPetDetailViewProps> = ({ pet, tutor, onBack, onEdit }) => {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div className="backoffice-card" style={{ padding: '24px', display: 'grid', gap: '18px', background: 'var(--backoffice-hero)' }}>
        <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', minWidth: 0 }}>
            <button className="backoffice-ghost-btn" type="button" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', fontSize: '42px', flexShrink: 0 }}>
              {pet.avatar}
            </div>
            <div style={{ minWidth: 0 }}>
              <span className={`backoffice-pill ${pet.status === 'Ativo' ? 'backoffice-status-success' : pet.status === 'Em acompanhamento' ? 'backoffice-status-attention' : 'backoffice-status-info'}`} style={{ marginBottom: '10px' }}>
                {pet.status}
              </span>
              <h2 style={{ color: 'var(--backoffice-text)', fontSize: '30px', marginBottom: '8px' }}>{pet.name}</h2>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                {pet.species} · {pet.sex} · {pet.breed} · {pet.age} · {pet.weight}
              </p>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                Última visita: {pet.lastVisit} · Próxima ação: {pet.nextAction}
              </p>
            </div>
          </div>
          <button type="button" className="backoffice-primary-btn" onClick={onEdit}>
            Editar cadastro
          </button>
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Tutor responsável</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserRound size={15} />
              {tutor?.name ?? pet.tutorName}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Vacinas registradas</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} />
              {pet.vaccines.length}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Último atendimento</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarClock size={15} />
              {pet.lastVisit}
            </strong>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Próximo passo</span>
            <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{pet.nextAction}</strong>
          </div>
        </div>
      </div>

      <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', alignItems: 'start' }}>
        <BackofficeSectionCard title="Ficha do pet" eyebrow="Perfil clínico">
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              ['Espécie', pet.species],
              ['Sexo', pet.sex],
              ['Raça', pet.breed],
              ['Idade', pet.age],
              ['Peso', pet.weight],
              ['Status atual', pet.status]
            ].map(([label, value]) => (
              <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--backoffice-border)' }}>
                <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '5px' }}>{label}</span>
                <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{value}</strong>
              </div>
            ))}
            <div>
              <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Observação clínica base</span>
              <p style={{ color: 'var(--backoffice-text)', lineHeight: 1.7 }}>{pet.observation || 'Sem observação cadastrada.'}</p>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '6px' }}>Vacinas</span>
              <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>
                {pet.vaccines.length > 0 ? pet.vaccines.join(', ') : 'Sem registro vacinal'}
              </strong>
            </div>
          </div>
        </BackofficeSectionCard>

        <BackofficeSectionCard title="Dados do tutor" eyebrow="Relacionamento">
          <div style={{ display: 'grid', gap: '14px' }}>
            {tutor ? (
              <>
                {[
                  ['Nome', tutor.name],
                  ['Email', tutor.email],
                  ['Telefone', tutor.phone],
                  ['Plano', tutor.plan],
                  ['Cidade', tutor.city],
                  ['Bairro', tutor.neighborhood]
                ].map(([label, value]) => (
                  <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--backoffice-border)' }}>
                    <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '5px' }}>{label}</span>
                    <strong style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{value}</strong>
                  </div>
                ))}
                <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-soft)', display: 'grid', gap: '8px' }}>
                  <strong style={{ color: 'var(--backoffice-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={15} />
                    {tutor.phone}
                  </strong>
                  <span style={{ color: 'var(--backoffice-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPinHouse size={15} />
                    {tutor.city} · {tutor.neighborhood}
                  </span>
                </div>
              </>
            ) : (
              <div className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '8px' }}>Tutor não localizado</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.7 }}>
                  Este pet está sem vínculo completo com um cliente da base compartilhada no momento.
                </p>
              </div>
            )}
          </div>
        </BackofficeSectionCard>
      </div>
    </div>
  );
};
