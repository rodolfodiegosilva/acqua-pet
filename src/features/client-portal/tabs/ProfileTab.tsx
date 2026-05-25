import React, { useEffect, useState } from 'react';
import { PortalSectionCard } from '@/components/client/portal-section-card/PortalSectionCard';
import type { ClientUser } from '@/services/clientPortal';

interface ProfileTabProps {
  currentUser: ClientUser;
  onUpdateProfile: (updates: Pick<ClientUser, 'name' | 'email' | 'cpf' | 'phone' | 'city' | 'neighborhood'>) => void;
  isSubmittingProfile?: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  onUpdateProfile,
  isSubmittingProfile = false
}) => {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    cpf: currentUser.cpf,
    phone: currentUser.phone
  });
  const [profileForm, setProfileForm] = useState({
    city: currentUser.city,
    neighborhood: currentUser.neighborhood
  });

  useEffect(() => {
    setPersonalForm({
      name: currentUser.name,
      email: currentUser.email,
      cpf: currentUser.cpf,
      phone: currentUser.phone
    });
    setProfileForm({
      city: currentUser.city,
      neighborhood: currentUser.neighborhood
    });
  }, [currentUser]);

  const resetPersonalForm = () => {
    setPersonalForm({
      name: currentUser.name,
      email: currentUser.email,
      cpf: currentUser.cpf,
      phone: currentUser.phone
    });
  };

  const resetProfileForm = () => {
    setProfileForm({
      city: currentUser.city,
      neighborhood: currentUser.neighborhood
    });
  };

  return (
    <div className="portal-two-cols portal-profile-layout" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '20px' }}>
      <PortalSectionCard
        title="Dados pessoais"
        eyebrow="Perfil"
        action={
          <button
            type="button"
            className="portal-ghost-btn"
            onClick={() => {
              resetPersonalForm();
              setIsEditingPersonal((current) => !current);
              setIsEditingProfile(false);
            }}
          >
            {isEditingPersonal ? 'Fechar edição' : 'Editar dados'}
          </button>
        }
      >
        {isEditingPersonal ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onUpdateProfile({
                name: personalForm.name,
                email: personalForm.email,
                cpf: personalForm.cpf,
                phone: personalForm.phone,
                city: currentUser.city,
                neighborhood: currentUser.neighborhood
              });
              setIsEditingPersonal(false);
            }}
            className="portal-profile-form"
            style={{ display: 'grid', gap: '12px' }}
          >
            <input className="portal-input" type="text" placeholder="Nome completo" value={personalForm.name} onChange={(event) => setPersonalForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="portal-input" type="email" placeholder="E-mail" value={personalForm.email} onChange={(event) => setPersonalForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="portal-input" type="text" placeholder="CPF" value={personalForm.cpf} onChange={(event) => setPersonalForm((current) => ({ ...current, cpf: event.target.value }))} />
            <input className="portal-input" type="text" placeholder="Telefone" value={personalForm.phone} onChange={(event) => setPersonalForm((current) => ({ ...current, phone: event.target.value }))} />
            <div className="portal-profile-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="submit" className="portal-ghost-btn" disabled={isSubmittingProfile}>
                {isSubmittingProfile ? 'Salvando dados...' : 'Salvar dados pessoais'}
              </button>
              <button
                type="button"
                className="portal-link-btn"
                onClick={() => {
                  resetPersonalForm();
                  setIsEditingPersonal(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
            ) : (
          <div className="portal-profile-card-list" style={{ display: 'grid', gap: '12px' }}>
            {[
              { label: 'Nome', value: currentUser.name },
              { label: 'CPF', value: currentUser.cpf },
              { label: 'E-mail', value: currentUser.email },
              { label: 'Telefone', value: currentUser.phone }
            ].map(({ label, value }) => (
              <div key={label} className="portal-surface portal-profile-info-card" style={{ padding: '16px', display: 'grid', gap: '8px' }}>
                <span className="portal-mini-label">{label}</span>
                <strong style={{ color: 'var(--portal-text)', overflowWrap: 'anywhere' }}>{value}</strong>
              </div>
            ))}
          </div>
        )}
      </PortalSectionCard>

      <div style={{ display: 'grid', gap: '20px' }}>
        <PortalSectionCard
          title="Dados de perfil"
          eyebrow="Base de atendimento"
          action={
          <button
            type="button"
            className="portal-ghost-btn"
            onClick={() => {
              resetProfileForm();
              setIsEditingProfile((current) => !current);
              setIsEditingPersonal(false);
            }}
          >
            {isEditingProfile ? 'Fechar edição' : 'Editar perfil'}
          </button>
        }
        >
          {isEditingProfile ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onUpdateProfile({
                  name: currentUser.name,
                  email: currentUser.email,
                  cpf: currentUser.cpf,
                  phone: currentUser.phone,
                  city: profileForm.city,
                  neighborhood: profileForm.neighborhood
                });
                setIsEditingProfile(false);
              }}
              className="portal-profile-form"
              style={{ display: 'grid', gap: '12px' }}
            >
              <input className="portal-input" type="text" placeholder="Cidade base" value={profileForm.city} onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))} />
              <input className="portal-input" type="text" placeholder="Bairro" value={profileForm.neighborhood} onChange={(event) => setProfileForm((current) => ({ ...current, neighborhood: event.target.value }))} />
              <div className="portal-profile-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="submit" className="portal-ghost-btn" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? 'Salvando perfil...' : 'Salvar dados de perfil'}
                </button>
                <button
                  type="button"
                  className="portal-link-btn"
                  onClick={() => {
                    resetProfileForm();
                    setIsEditingProfile(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="portal-profile-card-list" style={{ display: 'grid', gap: '12px' }}>
              <div className="portal-surface portal-profile-info-card" style={{ padding: '16px', display: 'grid', gap: '8px' }}>
                <span className="portal-mini-label">Plano atual</span>
                <strong style={{ color: 'var(--portal-text)' }}>{currentUser.plan}</strong>
                <span style={{ color: 'var(--portal-muted)', fontSize: '13px', lineHeight: 1.6 }}>Gerenciado pela operação da AcquaPet.</span>
              </div>
              <div className="portal-surface portal-profile-info-card" style={{ padding: '16px', display: 'grid', gap: '8px' }}>
                <span className="portal-mini-label">Cidade base</span>
                <strong style={{ color: 'var(--portal-text)' }}>{currentUser.city}</strong>
              </div>
              <div className="portal-surface portal-profile-info-card" style={{ padding: '16px', display: 'grid', gap: '8px' }}>
                <span className="portal-mini-label">Bairro</span>
                <strong style={{ color: 'var(--portal-text)' }}>{currentUser.neighborhood}</strong>
              </div>
              <div className="portal-surface portal-profile-info-card" style={{ padding: '16px', display: 'grid', gap: '8px' }}>
                <span className="portal-mini-label">Cliente desde</span>
                <strong style={{ color: 'var(--portal-text)' }}>{currentUser.memberSince}</strong>
              </div>
            </div>
          )}
        </PortalSectionCard>
      </div>
    </div>
  );
};
